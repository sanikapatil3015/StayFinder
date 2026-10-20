const express = require("express");
const router = express.Router();

const RecentSearch = require("../models/RecentSearch");
const protect = require("../middleware/authMiddleware");

// GET: Fetch the logged-in user's recent searches
router.get("/", protect, async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;

        const searches = await RecentSearch.find({ userId })
            .sort({ searchedAt: -1 })
            .limit(10);

        res.status(200).json({
            success: true,
            searches
        });
    } catch (error) {
        console.error("Fetch recent searches error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to fetch recent searches"
        });
    }
});

// POST: Save a recent search
router.post("/", protect, async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const location = String(req.body.location || "").trim();

        if (!location) {
            return res.status(400).json({
                success: false,
                message: "Search location is required"
            });
        }

        // Remove an older matching search for this user.
        await RecentSearch.deleteMany({
            userId,
            location: {
                $regex: new RegExp(
                    "^" + location.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$",
                    "i"
                )
            }
        });

        const search = await RecentSearch.create({
            userId,
            location,
            searchedAt: new Date()
        });

        // Retain only the latest 10 searches.
        const oldSearches = await RecentSearch.find({ userId })
            .sort({ searchedAt: -1 })
            .skip(10)
            .select("_id");

        if (oldSearches.length > 0) {
            await RecentSearch.deleteMany({
                _id: { $in: oldSearches.map(item => item._id) }
            });
        }

        res.status(201).json({
            success: true,
            search
        });
    } catch (error) {
        console.error("Save recent search error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to save recent search"
        });
    }
});

// DELETE: Clear the logged-in user's recent searches
router.delete("/", protect, async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;

        await RecentSearch.deleteMany({ userId });

        res.status(200).json({
            success: true,
            message: "Recent searches cleared successfully"
        });
    } catch (error) {
        console.error("Clear recent searches error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to clear recent searches"
        });
    }
});

module.exports = router;