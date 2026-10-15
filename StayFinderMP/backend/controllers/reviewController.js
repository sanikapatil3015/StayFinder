const Review = require("../models/Review");
const Hostel = require("../models/Hostel");


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

        const review = new Review({

            student: req.user.id,

            hostel: hostelId,

            rating: Number(rating),

            comment: comment.trim()

        });


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
// Owner can see reviews for their hostel
// =====================================================

async function getHostelReviews(req, res) {

    try {

        // ---------------------------------------------
        // CHECK USER ROLE
        // ---------------------------------------------

        if (req.user.role !== "owner") {

            return res.status(403).json({

                success: false,

                message:
                    "Only hostel owners can access reviews."

            });

        }


        // ---------------------------------------------
        // FIND OWNER'S HOSTEL
        // ---------------------------------------------

        const hostel = await Hostel.findOne({

            _id: req.params.hostelId,

            owner: req.user.id

        });


        if (!hostel) {

            return res.status(404).json({

                success: false,

                message:
                    "Hostel not found or you do not own this hostel."

            });

        }


        // ---------------------------------------------
        // GET REVIEWS
        // ---------------------------------------------

        const reviews = await Review.find({

            hostel: hostel._id

        })
        .populate("student", "name")
        .sort({ createdAt: -1 });


        // ---------------------------------------------
        // CALCULATE SUMMARY
        // ---------------------------------------------

        const totalReviews = reviews.length;


        let averageRating = 0;

        if (totalReviews > 0) {

            const totalRating =
                reviews.reduce(
                    function (sum, review) {

                        return sum + review.rating;

                    },
                    0
                );

            averageRating =
                totalRating / totalReviews;

        }


        // ---------------------------------------------
        // POSITIVE REVIEWS
        // Rating 4 or 5 = positive
        // ---------------------------------------------

        const positiveReviews =
            reviews.filter(
                function (review) {

                    return review.rating >= 4;

                }
            ).length;


        let positivePercentage = 0;

        if (totalReviews > 0) {

            positivePercentage =
                Math.round(
                    (positiveReviews / totalReviews) * 100
                );

        }


        // ---------------------------------------------
        // SUCCESS
        // ---------------------------------------------

        return res.status(200).json({

            success: true,

            summary: {

                averageRating:
                    Number(averageRating.toFixed(1)),

                totalReviews:
                    totalReviews,

                positivePercentage:
                    positivePercentage

            },

            reviews:
                reviews

        });

    }


    catch (error) {

        console.error(
            "Get hostel reviews error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to load reviews."

        });

    }

}



module.exports = {

    createReview,

    getHostelReviews

};