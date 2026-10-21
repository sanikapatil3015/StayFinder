require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user");

async function createAdmin() {
try {
const { MONGO_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;


    if (!MONGO_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
        throw new Error(
            "MONGO_URI, ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env"
        );
    }

    await mongoose.connect(MONGO_URI);

    const email = ADMIN_EMAIL.toLowerCase().trim();

    // Find an existing admin by role or configured email.
    let admin = await User.findOne({
        $or: [
            { email, role: "admin" },
            { role: "admin" }
        ]
    });

    if (admin) {
        admin.email = email;
        admin.password = ADMIN_PASSWORD;
        admin.role = "admin";
        admin.name = "Stay Finder Admin";
        await admin.save();

        console.log("Existing admin account updated successfully.");
        console.log("Admin email:", email);
    } else {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new Error(
                "This email belongs to a non-admin account. Choose a different ADMIN_EMAIL."
            );
        }

        await User.create({
            role: "admin",
            name: "Stay Finder Admin",
            email,
            phone: "0000000000",
            password: ADMIN_PASSWORD
        });

        console.log("Admin account created successfully.");
        console.log("Admin email:", email);
    }
} catch (error) {
    console.error("Admin setup failed:", error.message);
    process.exitCode = 1;
} finally {
    await mongoose.disconnect();
}


}

createAdmin();
