const SavedStay = require("../models/SavedStay");
const Hostel = require("../models/Hostel");

// Get saved stays for the logged-in student
exports.getSavedStays = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can view saved stays."
      });
    }

    const savedStays = await SavedStay.find({
      student: req.user.id
    }).populate({
      path: "hostel",
      match: { verificationStatus: "Verified" }
    });

    // Exclude deleted or no-longer-verified hostels
    const validSavedStays = savedStays.filter(
      (savedStay) => savedStay.hostel
    );

    return res.status(200).json({
      success: true,
      savedStays: validSavedStays
    });
  } catch (error) {
    console.error("Get saved stays error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load saved stays."
    });
  }
};


// Save a hostel
exports.saveStay = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can save stays."
      });
    }

    const { hostelId } = req.params;

    const hostel = await Hostel.findOne({
      _id: hostelId,
      verificationStatus: "Verified"
    });

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: "Hostel not found or not verified."
      });
    }

    const existingStay = await SavedStay.findOne({
      student: req.user.id,
      hostel: hostelId
    });

    if (existingStay) {
      return res.status(200).json({
        success: true,
        message: "Hostel is already saved."
      });
    }

    await SavedStay.create({
      student: req.user.id,
      hostel: hostelId
    });

    return res.status(201).json({
      success: true,
      message: "Hostel saved successfully."
    });
  } catch (error) {
    // Handles invalid MongoDB IDs
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid hostel ID."
      });
    }

    // Handles duplicate entries if two save requests happen together
    if (error.code === 11000) {
      return res.status(200).json({
        success: true,
        message: "Hostel is already saved."
      });
    }

    console.error("Save stay error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save hostel."
    });
  }
};


// Remove a saved hostel
exports.removeSavedStay = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can remove saved stays."
      });
    }

    const { hostelId } = req.params;

    const result = await SavedStay.findOneAndDelete({
      student: req.user.id,
      hostel: hostelId
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Saved hostel not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Hostel removed from saved stays."
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid hostel ID."
      });
    }

    console.error("Remove saved stay error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove saved hostel."
    });
  }
};