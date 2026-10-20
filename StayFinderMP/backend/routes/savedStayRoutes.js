const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getSavedStays,
  saveStay,
  removeSavedStay
} = require("../controllers/savedStayController");

// Get all saved stays for the logged-in student
router.get("/", protect, getSavedStays);

// Save a hostel
router.post("/:hostelId", protect, saveStay);

// Remove a saved hostel
router.delete("/:hostelId", protect, removeSavedStay);

module.exports = router;