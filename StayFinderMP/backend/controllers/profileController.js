const User = require("../models/User");

// =====================================================
// GET OWNER PROFILE
// GET /api/owner/profile
// =====================================================

async function getOwnerProfile(req, res) {
    try {
        const user = await User.findOne({
            _id: req.user.id,
            role: "owner"
        }).select("name email phone role");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Owner profile not found."
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error("Get owner profile error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to load owner profile."
        });
    }
}

// =====================================================
// UPDATE OWNER PROFILE
// PATCH /api/owner/profile
// =====================================================

async function updateOwnerProfile(req, res) {
    try {
        const { name, email, phone } = req.body;

        // Validate name
        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Name is required."
            });
        }

        // Validate email
        const cleanEmail = String(email || "").trim().toLowerCase();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(cleanEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });
        }

        // Validate phone
        const cleanPhone = String(phone || "").trim();

        if (!/^\d{10}$/.test(cleanPhone)) {
            return res.status(400).json({
                success: false,
                message: "Phone number must contain exactly 10 digits."
            });
        }

        // Check whether another account uses this email
        const existingUser = await User.findOne({
            email: cleanEmail,
            _id: { $ne: req.user.id }
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "This email is already registered."
            });
        }

        // Update only the logged-in owner's permitted fields
        const updatedUser = await User.findOneAndUpdate(
            {
                _id: req.user.id,
                role: "owner"
            },
            {
                $set: {
                    name: name.trim(),
                    email: cleanEmail,
                    phone: cleanPhone
                }
            },
            {
                new: true,
                runValidators: true
            }
        ).select("name email phone role");

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "Owner profile not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            user: updatedUser
        });

    } catch (error) {
        console.error("Update owner profile error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to update owner profile."
        });
    }
}

module.exports = {
    getOwnerProfile,
    updateOwnerProfile
};