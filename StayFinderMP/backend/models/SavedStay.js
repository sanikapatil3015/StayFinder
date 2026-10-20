const mongoose = require("mongoose");

const savedStaySchema = new mongoose.Schema(
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
    }
  },
  {
    timestamps: true
  }
);

// Prevent the same student from saving the same hostel twice
savedStaySchema.index(
  { student: 1, hostel: 1 },
  { unique: true }
);

module.exports = mongoose.model("SavedStay", savedStaySchema);