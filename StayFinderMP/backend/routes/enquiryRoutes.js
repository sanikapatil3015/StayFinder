const express = require("express");

const {
getOwnerEnquiries,
getStudentEnquiries,
createEnquiry,
updateEnquiryStatus,
replyToEnquiry
} = require("../controllers/enquiryController");

const protect = require("../middleware/authMiddleware");
const router = express.Router();

// Student sends an enquiry
router.post("/", protect, createEnquiry);

// Owner retrieves enquiries for their hostel
router.get("/my", protect, getOwnerEnquiries);

// Get enquiries sent by the logged-in student
router.get("/student", protect, getStudentEnquiries);

// Owner updates an enquiry's status
router.patch("/:enquiryId/status", protect, updateEnquiryStatus);

router.post("/:enquiryId/reply", protect, replyToEnquiry);

module.exports = router;
