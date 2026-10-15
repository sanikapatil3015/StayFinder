const mongoose = require("mongoose");

const verificationDocumentSchema = new mongoose.Schema(
  {
    documentType: {
      type: String,
      enum: [
        "Property Proof",
        "Owner Identity",
        "Business Registration",
        "Other"
      ],
      required: true
    },

    // Random server-generated filename used internally.
    // Never expose this as a public document URL.
    filename: {
      type: String,
      required: true
    },

    // Original name is displayed to the admin for identification.
    originalName: {
      type: String,
      required: true
    },

    mimeType: {
      type: String,
      required: true
    },

    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

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
      min: 0
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

    // Existing public hostel photos — keep these fields unchanged.
    mainPhoto: {
      type: String,
      default: ""
    },

    photos: {
      type: [String],
      default: []
    },

    status: {
      type: String,
      enum: ["Available", "Few Rooms Left", "Full"],
      default: "Available"
    },

    // Existing admin verification workflow.
    verificationStatus: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"],
      default: "Pending"
    },

    verifiedAt: {
      type: Date,
      default: null
    },

    // New: metadata for privately stored verification documents.
    verificationDocuments: {
      type: [verificationDocumentSchema],
      default: []
    },

    // New: explanation provided by the admin when rejecting a hostel.
    rejectionReason: {
      type: String,
      default: "",
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Hostel", hostelSchema);