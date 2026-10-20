const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
    {
        message: {
            type: String,
            required: true,
            trim: true
        },
        repliedAt: {
            type: Date,
            default: Date.now
        },
        isRead: {
            type: Boolean,
            default: false
        }
    }
);

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
        },
        replies: {
            type: [replySchema],
            default: []
        },
        replies: [
            {
                message: {
                    type: String,
                    required: true,
                    trim: true
                },
                repliedAt: {
                    type: Date,
                    default: Date.now
                },
                isRead: {
                    type: Boolean,
                    default: false
                }
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model("Enquiry", enquirySchema);