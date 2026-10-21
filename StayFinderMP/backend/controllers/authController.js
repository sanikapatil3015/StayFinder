const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Hostel = require("../models/Hostel");
const crypto = require("crypto");
const { sendPasswordResetEmail } = require("../utils/mailer");

// =====================================================
// PASSWORD VALIDATION
// =====================================================

function isStrongPassword(password) {

    return (
        typeof password === "string" &&
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[@$!%*?&#]/.test(password)
    );

}


// =====================================================
// CREATE JWT TOKEN
// =====================================================

function createToken(user) {

    return jwt.sign(
        {
            id: user._id,
            role: user.role,
            email: user.email
        },

        process.env.JWT_SECRET,

        {
            expiresIn: "1d"
        }
    );

}


// =====================================================
// USER RESPONSE
// IMPORTANT: PASSWORD IS NOT SENT TO FRONTEND
// =====================================================

function userResponse(user) {
    return {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        phone: user.phone,
        college: user.college,
        propertyName: user.propertyName,
        propertyLocation: user.propertyLocation
    };
}


// =====================================================
// REGISTER USER
// =====================================================

const register = async (req, res) => {

    try {

        const {
            role,
            name,
            email,
            phone,
            password,
            confirmPassword,
            college,
            propertyName,
            propertyLocation,
            aadhaar
        } = req.body;


        // ---------------------------------------------
        // REQUIRED FIELDS
        // ---------------------------------------------

        if (
            !role ||
            !name ||
            !email ||
            !phone ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message: "Please fill all required fields."

            });

        }


        // ---------------------------------------------
        // ROLE
        // ---------------------------------------------

        if (
            role !== "student" &&
            role !== "owner"
        ) {

            return res.status(400).json({

                success: false,

                message: "Invalid account type."

            });

        }


        // ---------------------------------------------
        // EMAIL
        // ---------------------------------------------

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailRegex.test(email)) {

            return res.status(400).json({

                success: false,

                message: "Please enter a valid email address."

            });

        }


        // ---------------------------------------------
        // PHONE
        // ---------------------------------------------

        if (!/^[0-9]{10}$/.test(phone)) {

            return res.status(400).json({

                success: false,

                message: "Please enter a valid 10-digit phone number."

            });

        }


        // ---------------------------------------------
        // PASSWORD
        // ---------------------------------------------

        if (!isStrongPassword(password)) {

            return res.status(400).json({

                success: false,

                message:
                    "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."

            });

        }


        // ---------------------------------------------
        // CONFIRM PASSWORD
        // ---------------------------------------------

        if (password !== confirmPassword) {

            return res.status(400).json({

                success: false,

                message: "Passwords do not match."

            });

        }


        // =================================================
        // STUDENT VALIDATION
        // =================================================

        if (role === "student") {

            if (
                !college ||
                college.trim() === ""
            ) {

                return res.status(400).json({

                    success: false,

                    message: "Please enter your college name."

                });

            }

        }


        // =================================================
        // OWNER VALIDATION
        // =================================================

        if (role === "owner") {

            if (
                !propertyName ||
                propertyName.trim() === ""
            ) {

                return res.status(400).json({

                    success: false,

                    message: "Please enter your property name."

                });

            }


            if (
                !propertyLocation ||
                propertyLocation.trim() === ""
            ) {

                return res.status(400).json({

                    success: false,

                    message: "Please enter your property location."

                });

            }


            if (
                !aadhaar ||
                !/^[0-9]{4}$/.test(aadhaar)
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Please enter the last 4 digits of your Aadhaar number."

                });

            }

        }


        // =================================================
        // CHECK EXISTING USER
        // =================================================

        const existingUser = await User.findOne({

            email: email.toLowerCase().trim()

        });


        if (existingUser) {

            return res.status(409).json({

                success: false,

                message:
                    "An account with this email already exists."

            });

        }


        // =================================================
        // HASH PASSWORD
        // =================================================

        const hashedPassword = password;


        // =================================================
        // CREATE USER
        // =================================================

        const user = new User({

            role: role,

            name: name.trim(),

            email: email.toLowerCase().trim(),

            phone: phone.trim(),

            password: hashedPassword,

            college:
                role === "student"
                    ? college.trim()
                    : "",

            propertyName:
                role === "owner"
                    ? propertyName.trim()
                    : "",

            propertyLocation:
                role === "owner"
                    ? propertyLocation.trim()
                    : "",

            aadhaar:
                role === "owner"
                    ? aadhaar
                    : ""

        });


        // =================================================
        // SAVE USER
        // =================================================

        await user.save();
        if (role === "owner") {
    const hostel = new Hostel({
        owner: user._id,
        name: propertyName,
        location: propertyLocation,
        totalRooms: 0,
        availableRooms: 0,
        rent: 0,
        securityDeposit: 0,
        facilities: [],
        status: "Available"
    });

    await hostel.save();
}

        // =================================================
        // CREATE JWT
        // =================================================

        const token = createToken(user);


        // =================================================
        // SUCCESS RESPONSE
        // =================================================

        return res.status(201).json({

            success: true,

            message: "Registration successful.",

            token: token,

            user: userResponse(user)

        });


    } catch (error) {

        console.error(
            "Registration error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error during registration."

        });

    }

};


// =====================================================
// LOGIN
// =====================================================

const login = async (req, res) => {
    try {
        const { role, email, password } = req.body;

        if (!role || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter email and password."
            });
        }
          console.log("Login database:", User.db.name);
console.log("Login email received:", email.trim().toLowerCase());
console.log("Login role received:", role);
        const normalizedEmail = email.trim().toLowerCase();

        // Check whether an account exists for this email.
        const userByEmail = await User.findOne({
            email: normalizedEmail
        }).select("+password");

        // Check whether the account also matches the selected role.
        const user = await User.findOne({
            email: normalizedEmail,
            role: role
        }).select("+password");

        console.log("===== STAY FINDER LOGIN CHECK =====");
        console.log("Selected role:", role);
        console.log("Account exists:", Boolean(userByEmail));
        console.log("Role matches:", Boolean(user));
        console.log(
            "Password field available:",
            Boolean(user?.password)
        );
        console.log(
            "Stored value looks like bcrypt hash:",
            /^\$2[aby]\$\d{2}\$/.test(user?.password || "")
        );

        if (!user) {
            console.log("Login result: email or role did not match.");

            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        console.log("Password matches stored hash:", passwordMatch);
        console.log("===================================");

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const token = createToken(user);

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user: userResponse(user)
        });

    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error during login."
        });
    }
};

// =====================================================
// CHANGE PASSWORD
// =====================================================

const changePassword = async (req, res) => {
    try {
        const {
            currentPassword,
            newPassword,
            confirmPassword
        } = req.body;

        // Validate required fields
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all password fields."
            });
        }

        // Check new password length
        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "New password must contain at least 8 characters."
            });
        }

        // Confirm new password
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "New passwords do not match."
            });
        }

        // Find the logged-in user
        const user = await User.findById(req.user.id).select("+password");
       

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User account not found."
            });
        }

        // Verify current password
        const passwordMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );
            

        if (!passwordMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect."
            });
        }

        // Prevent reusing the current password
        const samePassword = await bcrypt.compare(
            newPassword,
            user.password
        );

        if (samePassword) {
            return res.status(400).json({
                success: false,
                message: "New password must differ from your current password."
            });
        }

        // Hash the new password before saving
       user.password = newPassword;
await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully."
        });

    } catch (error) {
        console.error("Change password error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to change password."
        });
    }
};

// =====================================================
// FORGOT PASSWORD
// POST /api/auth/forgot-password
// =====================================================
const forgotPassword = async (req, res) => {
    try {
        const email =
            typeof req.body.email === "string"
                ? req.body.email.trim().toLowerCase()
                : "";

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please enter your email address."
            });
        }

        // Only student and owner accounts use this recovery flow.
        const user = await User.findOne({
            email,
            role: { $in: ["student", "owner"] }
        });

        // Use the same response whether the account exists or not.
        const genericMessage =
            "If an eligible account exists for this email, a password-reset link will be sent.";

        if (!user) {
            return res.status(200).json({
                success: true,
                message: genericMessage
            });
        }

        // Generate a secure random token.
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Store only the SHA-256 hash, never the raw token.
        user.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // Link expires after 15 minutes.
        user.resetPasswordExpires =
            new Date(Date.now() + 15 * 60 * 1000);

        await user.save();

        const frontendUrl = process.env.FRONTEND_URL;

        if (!frontendUrl) {
            throw new Error("FRONTEND_URL is missing from .env");
        }

        const resetLink =
    `${frontendUrl.replace(/\/$/, "")}/reset-password.html?token=${resetToken}`;

        try {
            await sendPasswordResetEmail(user.email, resetLink);
        } catch (emailError) {
            // Invalidate the token if sending the email fails.
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();

            throw emailError;
        }

        return res.status(200).json({
            success: true,
            message: genericMessage
        });
    }  catch (error) {
    console.error("===== FORGOT PASSWORD ERROR =====");
    console.error(error);

    if (error instanceof Error) {
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
    } else {
        console.error("Error value:", String(error));
    }

    return res.status(500).json({
        success: false,
        message: "Unable to process the password-reset request right now."
    });
}
};


// =====================================================
// RESET PASSWORD
// POST /api/auth/reset-password
// =====================================================
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword, confirmPassword } = req.body;

        if (
            typeof token !== "string" ||
            !/^[a-f0-9]{64}$/i.test(token)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset link."
            });
        }

        if (!isStrongPassword(newPassword)) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match."
            });
        }

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: new Date() },
            role: { $in: ["student", "owner"] }
        }).select("+resetPasswordToken +resetPasswordExpires +password");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset link."
            });
        }

        // Assign the plain password. Your existing User model's
        // pre-save hook will hash it automatically.
        user.password = newPassword;

        // Make the reset token unusable after successful reset.
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully. You can now log in."
        });
    } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
        success: false,
        message: "Unable to reset the password right now."
    });
}

};


// =====================================================
// EXPORT CONTROLLERS
// =====================================================
module.exports = {
    register,
    login,
    changePassword,
    forgotPassword,
    resetPassword
};