const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const authRoutes = require("./routes/authRoutes");

const hostelRoutes =
    require("./routes/hostelRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const enquiryRoutes = require("./routes/enquiryRoutes");

const profileRoutes = require("./routes/profileRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const savedStayRoutes = require("./routes/savedStayRoutes");
const recentSearchRoutes = require("./routes/recentSearchRoutes");
// =====================================================
// LOAD ENVIRONMENT VARIABLES
// =====================================================

dotenv.config();

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