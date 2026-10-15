const express = require("express");

const {
    register,
    login,
    changePassword
} = require("../controllers/authController");


const router = express.Router();


// =====================================================
// REGISTER
// POST /api/auth/register
// =====================================================

router.post(
    "/register",
    register
);


// =====================================================
// LOGIN
// POST /api/auth/login
// =====================================================

router.post(
    "/login",
    login
);
// Change password for the authenticated user
const protect = require("../middleware/authMiddleware");

router.patch("/change-password", protect, changePassword);

module.exports = router;