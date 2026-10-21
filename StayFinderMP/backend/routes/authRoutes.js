const express = require("express");

const {
    register,
    login,
    changePassword,
    forgotPassword,
    resetPassword
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

// Forgot password: request a reset email
router.post("/forgot-password", forgotPassword);

// Reset password: save the new password
router.post("/reset-password", resetPassword);

module.exports = router;