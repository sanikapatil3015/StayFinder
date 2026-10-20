const mongoose = require("mongoose");

const recentSearchSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    searchedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("RecentSearch", recentSearchSchema);