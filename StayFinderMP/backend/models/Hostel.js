const mongoose = require("mongoose");

const hostelSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        location: {
            type: String,
            required: true,
            trim: true
        },

        totalRooms: {
            type: Number,
            default: 0,
            min: 0
        },

        availableRooms: {
            type: Number,
            default: 0,
            min: 0
        },

        rent: {
            type: Number,
            default: 0,
            min:0
        },

        securityDeposit: {
            type: Number,
            default: 0,
            min: 0
        },

        facilities: {
            type: [String],
            default: []
        },

        status: {
            type: String,
            enum: [
                "Available",
                "Few Rooms Left",
                "Full"
            ],
            default: "Available"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Hostel", hostelSchema);