const express = require("express");
const authorizeAdmin = require("../middleware/authorizeAdmin");

const {
getMyHostels,
updateMyHostel,
getAllHostels,
uploadHostelPhotos,
getPendingHostels,
reviewHostel,
uploadVerificationDocuments,
downloadVerificationDocument
} = require("../controllers/hostelController");

const protect = require("../middleware/authMiddleware");
const hostelPhotoUpload = require("../middleware/uploadMiddleware");
const verificationUpload = require("../middleware/verificationUploadMiddleware");

const router = express.Router();

// GET ALL VERIFIED HOSTELS FOR STUDENTS
router.get("/", getAllHostels);

// GET LOGGED-IN OWNER'S HOSTELS
router.get("/my", protect, getMyHostels);

// ADMIN: GET HOSTELS AWAITING VERIFICATION
router.get(
    "/admin/pending",
    protect,
    authorizeAdmin,
    getPendingHostels
);

// ADMIN: APPROVE OR REJECT A HOSTEL
router.patch(
    "/admin/:id/review",
    protect,
    authorizeAdmin,
    reviewHostel
);

// ADMIN: DOWNLOAD A HOSTEL VERIFICATION DOCUMENT
router.get(
    "/admin/:id/verification-documents/:documentId",
    protect,
    authorizeAdmin,
    downloadVerificationDocument
);
// OWNER: UPLOAD VERIFICATION DOCUMENTS
router.post(
"/:id/verification-documents",
protect,
verificationUpload,
uploadVerificationDocuments
);

// OWNER: UPDATE HOSTEL DETAILS
router.put("/:id", protect, updateMyHostel);

// OWNER: UPLOAD HOSTEL PHOTOS
router.post(
"/:id/photos",
protect,
hostelPhotoUpload,
uploadHostelPhotos
);

module.exports = router;
