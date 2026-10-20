const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["student", "owner", "admin"],
      required: true
    },

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
      required: true,
      select: false
    },

    college: {
      type: String,
      default: ""
    },

    propertyName: {
      type: String,
      default: ""
    },

    propertyLocation: {
      type: String,
      default: ""
    },

    aadhaar: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

// Automatically hash a password when it is new or changed.
userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 12);
});

module.exports =
  mongoose.models.User || mongoose.model("User", userSchema);