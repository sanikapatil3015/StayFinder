const express = require("express");

const {
    getMyHostels
} = require("../controllers/hostelController");

const protect =
    require("../middleware/authMiddleware");


const router = express.Router();


// =====================================================
// GET LOGGED-IN OWNER'S HOSTELS
// =====================================================

router.get(
    "/my",
    protect,
    getMyHostels
);


module.exports = router;