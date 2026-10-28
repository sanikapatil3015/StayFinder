const multer = require("multer");

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
        cb(
            new Error(
                "Only JPG, PNG, and WEBP images are allowed."
            )
        );
    }
}

// Store uploaded images in memory temporarily.
// The controller will upload them to Supabase Storage.
const upload = multer({
    storage: multer.memoryStorage(),
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