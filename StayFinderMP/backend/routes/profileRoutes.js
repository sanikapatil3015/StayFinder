const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
    getOwnerProfile,
    updateOwnerProfile
} = require("../controllers/profileController");

const router = express.Router();

// Get logged-in owner's profile
router.get("/", protect, getOwnerProfile);

// Update logged-in owner's profile
router.patch("/", protect, updateOwnerProfile);

module.exports = router;