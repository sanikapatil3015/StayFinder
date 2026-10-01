const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const authRoutes = require("./routes/authRoutes");

const hostelRoutes =
    require("./routes/hostelRoutes");
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

// =====================================================
// AUTHENTICATION API
// =====================================================

app.use("/api/auth", authRoutes);
app.use("/api/hostels", hostelRoutes);

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