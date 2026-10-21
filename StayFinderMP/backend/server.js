require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const hostelRoutes = require("./routes/hostelRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const profileRoutes = require("./routes/profileRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const savedStayRoutes = require("./routes/savedStayRoutes");
const recentSearchRoutes = require("./routes/recentSearchRoutes");


// =====================================================
// CREATE EXPRESS APPLICATION
// =====================================================

const app = express();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
    cors({
        origin: true,
        credentials: true
    })
);

app.use(express.json());
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);
app.post("/api/admin-setup", async (req, res) => {
    try {
        const crypto = require("crypto");
        const bcrypt = require("bcryptjs");
        const User = require("./models/user");

        const setupKey = process.env.ADMIN_SETUP_KEY;

        if (!setupKey || req.headers["x-setup-key"] !== setupKey) {
            return res.status(403).json({
                success: false,
                message: "Forbidden"
            });
        }

        const { email, password } = req.body;

        if (!email || !password || password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Valid email and password are required."
            });
        }

        let admin = await User.findOne({ role: "admin" });

        if (!admin) {
            admin = new User({
                role: "admin",
                name: "Stay Finder Admin",
                email: email.trim().toLowerCase(),
                phone: "0000000000",
                password
            });
        } else {
            admin.email = email.trim().toLowerCase();
            admin.password = password;
        }

        await admin.save();

        return res.json({
            success: true,
            message: "Admin account created or reset successfully."
        });
    } catch (error) {
        console.error("Admin setup error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Admin setup failed."
        });
    }
});
// =====================================================
// AUTHENTICATION API
// =====================================================

app.use("/api/auth", authRoutes);
app.use("/api/hostels", hostelRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/owner/profile", profileRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/saved-stays", savedStayRoutes);
app.use("/api/recent-searches", recentSearchRoutes);
// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Stay Finder backend is running."
    });
});

// =====================================================
// FRONTEND
// =====================================================

const frontendPath = path.join(__dirname, "..", "frontend");

app.use(express.static(frontendPath));

// =====================================================
// HOMEPAGE
// =====================================================

app.get("/", (req, res) => {
    res.sendFile(
        path.join(frontendPath, "index.html")
    );
});

// =====================================================
// MONGODB CONNECTION
// =====================================================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully.");

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(
                `Stay Finder server running at http://localhost:${PORT}`
            );
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:");
        console.error(error.message);
        process.exit(1);
    });