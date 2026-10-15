
const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        hostel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hostel",
            required: true
        },

        message: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: ["New", "Contacted", "Pending", "Closed"],
            default: "New"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Enquiry", enquirySchema);

