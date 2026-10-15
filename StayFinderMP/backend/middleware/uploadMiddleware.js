const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create the uploads folder if it doesn't exist
const uploadDirectory = path.join(__dirname, "..", "uploads", "hostels");

fs.mkdirSync(uploadDirectory, { recursive: true });

// Configure where photos will be saved
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDirectory);
    },

    filename: function (req, file, cb) {
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1e9);

        cb(null, uniqueName + path.extname(file.originalname).toLowerCase());
    }
});

// Accept image files only
function imageFileFilter(req, file, cb) {
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPG, PNG, and WEBP images are allowed."));
    }
}

// Configure upload limits
const upload = multer({
    storage: storage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 9
    }
});

// Main photo + additional photos
const hostelPhotoUpload = upload.fields([
    { name: "mainPhoto", maxCount: 1 },
    { name: "photos", maxCount: 8 }
]);

module.exports = hostelPhotoUpload;