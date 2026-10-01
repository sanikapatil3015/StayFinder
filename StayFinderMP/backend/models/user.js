const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        // ============================================
        // ACCOUNT ROLE
        // ============================================

        role: {
            type: String,
            enum: ["student", "owner"],
            required: true
        },


        // ============================================
        // COMMON USER INFORMATION
        // ============================================

        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },


        // ============================================
        // STUDENT INFORMATION
        // ============================================

        college: {
            type: String,
            default: ""
        },


        // ============================================
        // OWNER INFORMATION
        // ============================================

        propertyName: {
            type: String,
            default: ""
        },

        propertyLocation: {
            type: String,
            default: ""
        },

        // Only last 4 digits of Aadhaar
        aadhaar: {
            type: String,
            default: ""
        }
    },

    {
        timestamps: true
    }
);


module.exports = mongoose.model("User", userSchema);