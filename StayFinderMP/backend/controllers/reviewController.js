const Review = require("../models/Review");
const Hostel = require("../models/Hostel");
const mongoose = require("mongoose");

// =====================================================
// CREATE REVIEW
// Student submits a review for a hostel
// =====================================================

async function createReview(req, res) {

    try {

        // ---------------------------------------------
        // CHECK USER ROLE
        // ---------------------------------------------

        if (req.user.role !== "student") {

            return res.status(403).json({
                success: false,
                message: "Only students can submit reviews."
            });

        }


        // ---------------------------------------------
        // GET DATA FROM REQUEST
        // ---------------------------------------------

        const {
            hostelId,
            rating,
            comment
        } = req.body;


        // ---------------------------------------------
        // VALIDATE DATA
        // ---------------------------------------------

        if (!hostelId || !rating || !comment) {

            return res.status(400).json({
                success: false,
                message: "Hostel, rating and comment are required."
            });

        }


        // ---------------------------------------------
        // CHECK RATING
        // ---------------------------------------------

        if (rating < 1 || rating > 5) {

            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5."
            });

        }


        // ---------------------------------------------
        // CHECK HOSTEL
        // ---------------------------------------------

        const hostel = await Hostel.findById(hostelId);

        if (!hostel) {

            return res.status(404).json({
                success: false,
                message: "Hostel not found."
            });

        }


        // ---------------------------------------------
        // CREATE REVIEW
        // ---------------------------------------------

        const review = await Review.findOneAndUpdate(
    {
        student: req.user.id,
        hostel: hostelId
    },
    {
        $set: {
            rating: Number(rating),
            comment: comment.trim()
        },
        $setOnInsert: {
            student: req.user.id,
            hostel: hostelId
        }
    },
    {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
    }
);


        await review.save();


        // ---------------------------------------------
        // SUCCESS
        // ---------------------------------------------

        return res.status(201).json({

            success: true,

            message: "Review submitted successfully.",

            review: review

        });

    }


    catch (error) {

        console.error(
            "Create review error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: "Unable to submit review."

        });

    }

}



// =====================================================
// GET HOSTEL REVIEWS
// Students can read reviews.
// Owners can read reviews only for their own hostels.
// =====================================================

async function getHostelReviews(req, res) {
    try {
        const { hostelId } = req.params;

        // Find the hostel
        const hostel = await Hostel.findById(hostelId);

        if (!hostel) {
            return res.status(404).json({
                success: false,
                message: "Hostel not found."
            });
        }

        // Only students and owners may view reviews
        if (!["student", "owner"].includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to view reviews."
            });
        }

        // Owners can view reviews only for their own hostels
        if (
            req.user.role === "owner" &&
            hostel.owner.toString() !== req.user.id
        ) {
            return res.status(403).json({
                success: false,
                message: "You can only view reviews for your own hostels."
            });
        }

        // Retrieve reviews and student names
        const reviews = await Review.find({
            hostel: hostel._id
        })
            .populate("student", "name")
            .sort({ createdAt: -1 });

        const totalReviews = reviews.length;

        const totalRating = reviews.reduce(
            (sum, review) => sum + review.rating,
            0
        );

        const averageRating =
            totalReviews > 0
                ? Number((totalRating / totalReviews).toFixed(1))
                : 0;

        const positiveReviews = reviews.filter(
            review => review.rating >= 4
        ).length;

        const positivePercentage =
            totalReviews > 0
                ? Math.round((positiveReviews / totalReviews) * 100)
                : 0;

        return res.status(200).json({
            success: true,
            summary: {
                averageRating,
                totalReviews,
                positivePercentage
            },
            reviews
        });

    } catch (error) {
        console.error("Get hostel reviews error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to load reviews."
        });
    }
}
// GET REVIEW SUMMARIES FOR MULTIPLE HOSTELS
async function getComparisonRatings(req, res) {
    try {
        if (req.user.role !== "student") {
            return res.status(403).json({
                success: false,
                message: "Only students can compare hostel ratings."
            });
        }

        const { hostelIds } = req.body;

        if (!Array.isArray(hostelIds) || hostelIds.length < 2 ||
            hostelIds.length > 3) {
            return res.status(400).json({
                success: false,
                message: "Select 2 or 3 hostels to compare."
            });
        }

        const summaries = await Review.aggregate([
            {
                $match: {
                    hostel: {
                        $in: hostelIds
                            .filter(id => mongoose.isValidObjectId(id))
                            .map(id => new mongoose.Types.ObjectId(id))
                    }
                }
            },
            {
                $group: {
                    _id: "$hostel",
                    averageRating: { $avg: "$rating" },
                    totalReviews: { $sum: 1 },
                    positiveReviews: {
                        $sum: {
                            $cond: [{ $gte: ["$rating", 4] }, 1, 0]
                        }
                    }
                }
            }
        ]);

        const ratings = {};

        hostelIds.forEach(id => {
            const summary = summaries.find(
                item => item._id.toString() === id
            );

            const totalReviews = summary?.totalReviews || 0;

            ratings[id] = {
                averageRating: totalReviews
                    ? Number(summary.averageRating.toFixed(1))
                    : null,
                totalReviews,
                positivePercentage: totalReviews
                    ? Math.round(
                        (summary.positiveReviews / totalReviews) * 100
                    )
                    : 0
            };
        });

        return res.status(200).json({
            success: true,
            ratings
        });
    } catch (error) {
        console.error("Comparison ratings error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to load comparison ratings."
        });
    }
}


module.exports = {

    createReview,

    getHostelReviews,
    getComparisonRatings
};