const express = require("express");

const {
    createReview,
    getHostelReviews,
    getComparisonRatings
} = require("../controllers/reviewController");

const protect =
    require("../middleware/authMiddleware");

const router = express.Router();


// Student submits a review
router.post(
    "/",
    protect,
    createReview
);


// Owner gets reviews for their hostel
router.get(
    "/hostel/:hostelId",
    protect,
    getHostelReviews
);
router.post(
    "/comparison",
    protect,
    getComparisonRatings
);

module.exports = router;