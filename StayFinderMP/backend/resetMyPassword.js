const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const readline = require("readline");
require("dotenv").config();

const User = require("./models/user");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(question) {
    return new Promise(resolve => {
        rl.question(question, resolve);
    });
}

async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const email = (await ask("Registered email: "))
            .trim()
            .toLowerCase();

        const newPassword = await ask("New password: ");

        if (
            newPassword.length < 8 ||
            !/[A-Z]/.test(newPassword) ||
            !/[a-z]/.test(newPassword) ||
            !/[0-9]/.test(newPassword) ||
            !/[@$!%*?&#]/.test(newPassword)
        ) {
            throw new Error(
                "Use at least 8 characters with uppercase, lowercase, number and special character."
            );
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            throw new Error("Account not found in this database.");
        }

        const hash = await bcrypt.hash(newPassword, 12);
        const passwordMatches = await bcrypt.compare(newPassword, hash);

        if (!passwordMatches) {
            throw new Error("Password hashing self-test failed.");
        }

        // Update only the password field; do not run save hooks.
        const result = await User.updateOne(
            { _id: user._id },
            { $set: { password: hash } }
        );

        if (result.modifiedCount !== 1) {
            throw new Error("Password was not updated.");
        }

        // Verify the saved password from MongoDB.
        const updatedUser = await User.findById(user._id)
            .select("+password");

        const verified = await bcrypt.compare(
            newPassword,
            updatedUser.password
        );

        console.log("Database:", mongoose.connection.name);
        console.log("Account found:", true);
        console.log("Password saved and verified:", verified);
        console.log("Password reset complete.");
    } catch (error) {
        console.error("Reset failed:", error.message);
        process.exitCode = 1;
    } finally {
        rl.close();
        await mongoose.disconnect().catch(() => {});
    }
}

main();