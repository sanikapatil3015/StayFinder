const express = require("express");

const {
    getMyHostels,
    updateMyHostel
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
router.put(
    "/:id",
    protect,
    updateMyHostel
);


module.exports = router;