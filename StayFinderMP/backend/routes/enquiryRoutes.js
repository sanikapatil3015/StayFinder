const express = require("express");

const {
getOwnerEnquiries,
createEnquiry,
updateEnquiryStatus
} = require("../controllers/enquiryController");

const protect = require("../middleware/authMiddleware");
const router = express.Router();

// Student sends an enquiry
router.post("/", protect, createEnquiry);

// Owner retrieves enquiries for their hostel
router.get("/my", protect, getOwnerEnquiries);

// Owner updates an enquiry's status
router.patch("/:enquiryId/status", protect, updateEnquiryStatus);

module.exports = router;
