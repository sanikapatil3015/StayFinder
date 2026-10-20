const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
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

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },

        comment: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

reviewSchema.index(
    { student: 1, hostel: 1 },
    { unique: true }
);

module.exports = mongoose.model("Review", reviewSchema);
module.exports = mongoose.model("Review", reviewSchema);