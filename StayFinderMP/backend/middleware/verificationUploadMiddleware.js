const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

// Store verification documents outside the public hostel-photo folder.
const uploadDirectory = path.join(
  __dirname,
  "..",
  "private_uploads",
  "verification-documents"
);

// Create the private directory if it does not exist.
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },

  filename: function (req, file, cb) {
    const randomName = crypto.randomBytes(16).toString("hex");
    const extension = path.extname(file.originalname).toLowerCase();

    cb(null, `${randomName}${extension}`);
  }
});

// Accept only PDF, JPEG, and PNG files.
const allowedMimeTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png"
];

const fileFilter = function (req, file, cb) {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new Error("Only PDF, JPG, and PNG verification documents are allowed.")
    );
  }

  cb(null, true);
};

const verificationUpload = multer({
  storage: storage,
  fileFilter: fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB per file
    files: 5,
    fields: 5,
    parts: 10
  }
});

// Each document must be sent using the field name "documents".
module.exports = verificationUpload.array("documents", 5);