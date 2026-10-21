require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user");

async function createAdmin() {
    try {
        if (
            !process.env.MONGO_URI ||
            !process.env.ADMIN_EMAIL ||
            !process.env.ADMIN_PASSWORD
        ) {
            throw new Error(
                "MONGO_URI, ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env"
            );
        }

        await mongoose.connect(process.env.MONGO_URI);

        const existingAdmin = await User.findOne({
            role: "admin"
        });

        if (existingAdmin) {
            console.log(
                "An admin account already exists. No new account created."
            );
            return;
        }

        const email = process.env.ADMIN_EMAIL.toLowerCase().trim();
        const password = process.env.ADMIN_PASSWORD;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new Error(
                "This email already belongs to another account. Choose a different admin email."
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await User.create({
            role: "admin",
            name: "Stay Finder Admin",
            email,
            phone: "0000000000",
            password: hashedPassword
        });

        console.log("Admin account created successfully.");
        console.log("Admin email:", email);

    } catch (error) {
        console.error("Admin creation failed:", error.message);
        process.exitCode = 1;

    } finally {
        await mongoose.disconnect();
    }
}

createAdmin();