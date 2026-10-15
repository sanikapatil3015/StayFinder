const Hostel = require("../models/Hostel");
const path = require("path");
const fs = require("fs");


// =====================================================
// GET LOGGED-IN OWNER'S HOSTELS
// =====================================================

async function getMyHostels(req, res) {

    try {

        // Only owners can access this route
        if (req.user.role !== "owner") {

            return res.status(403).json({
                success: false,
                message:
                    "Only hostel owners can access this information."
            });

        }


        // Find hostels belonging to
        // the logged-in owner
        const hostels =
            await Hostel.find({
                owner: req.user.id
            });


        return res.status(200).json({

            success: true,

            hostels: hostels

        });

    }

    catch (error) {

        console.error(
            "Get owner hostels error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to load hostel information."

        });

    }
}

    async function updateMyHostel(req, res) {
    try {

        if (req.user.role !== "owner") {
            return res.status(403).json({
                success: false,
                message:
                    "Only hostel owners can update hostel information."
            });
        }


        const {
            name,
            location,
            totalRooms,
            availableRooms,
            rent,
            securityDeposit,
            facilities
        } = req.body;


        // Basic validation

        if (!name || !location) {
            return res.status(400).json({
                success: false,
                message:
                    "Hostel name and location are required."
            });
        }


        if (
            Number(totalRooms) < 0 ||
            Number(availableRooms) < 0 ||
            Number(rent) < 0 ||
            Number(securityDeposit) < 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Values cannot be negative."
            });
        }


        if (Number(availableRooms) > Number(totalRooms)) {
            return res.status(400).json({
                success: false,
                message:
                    "Available rooms cannot be greater than total rooms."
            });
        }


        // Find hostel belonging to this logged-in owner

        const hostel =
            await Hostel.findOne({
                _id: req.params.id,
                owner: req.user.id
            });


        if (!hostel) {
            return res.status(404).json({
                success: false,
                message:
                    "Hostel not found or you do not own this hostel."
            });
        }


        // Update hostel information

        hostel.name = name.trim();
        hostel.location = location.trim();

        hostel.totalRooms =
            Number(totalRooms);

        hostel.availableRooms =
            Number(availableRooms);

        hostel.rent =
            Number(rent);

        hostel.securityDeposit =
            Number(securityDeposit);

        hostel.facilities =
            Array.isArray(facilities)
                ? facilities
                : [];


        // Automatically calculate availability status

        if (hostel.totalRooms === 0) {

            hostel.status = "Available";

        }
        else if (hostel.availableRooms === 0) {

            hostel.status = "Full";

        }
        else if (
            hostel.availableRooms <=
            Math.ceil(hostel.totalRooms * 0.2)
        ) {

            hostel.status = "Few Rooms Left";

        }
        else {

            hostel.status = "Available";

        }


        await hostel.save();


        return res.status(200).json({
            success: true,
            message:
                "Hostel information updated successfully.",
            hostel: hostel
        });

    }
    

    catch (error) {

        console.error(
            "Update hostel error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to update hostel information."
        });
    }
}
    
// =====================================================
// GET ALL HOSTELS FOR STUDENTS
// =====================================================

async function getAllHostels(req, res) {
    try {
        const hostels = await Hostel.find({
            verificationStatus: "Verified"
            })
            .select(
                "name location rent securityDeposit facilities totalRooms availableRooms status"
            )
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            hostels
        });

    } catch (error) {
        console.error("Get all hostels error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to load hostels."
        });
    }
}
// Upload main hostel photo and additional photos
async function uploadHostelPhotos(req, res) {
    try {
        if (req.user.role !== "owner") {
            return res.status(403).json({
                success: false,
                message: "Only hostel owners can upload photos."
            });
        }

        const hostel = await Hostel.findOne({
            _id: req.params.id,
            owner: req.user.id
        });

        if (!hostel) {
            return res.status(404).json({
                success: false,
                message: "Hostel not found or you do not own this hostel."
            });
        }

        const files = req.files || {};

        // Update the main photo if a new one was uploaded
        if (files.mainPhoto && files.mainPhoto.length > 0) {
            hostel.mainPhoto =
                "/uploads/hostels/" + files.mainPhoto[0].filename;
        }

        // Add newly uploaded photos to the existing gallery
        if (files.photos && files.photos.length > 0) {
            const newPhotos = files.photos.map(
                file => "/uploads/hostels/" + file.filename
            );

            hostel.photos = [
                ...hostel.photos,
                ...newPhotos
            ];
        }

        await hostel.save();

        return res.status(200).json({
            success: true,
            message: "Hostel photos uploaded successfully.",
            hostel: hostel
        });

    } catch (error) {
        console.error("Upload hostel photos error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to upload hostel photos."
        });
    }
}
// =====================================================
// GET HOSTELS PENDING ADMIN VERIFICATION
// =====================================================

async function getPendingHostels(req, res) {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admins can access this information."
            });
        }

        const hostels = await Hostel.find({
            verificationStatus: "Pending"
        })
            .populate("owner", "name email phone")
            .sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            hostels
        });

    } catch (error) {
        console.error("Get pending hostels error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to load pending hostels."
        });
    }
}


// =====================================================
// APPROVE OR REJECT A HOSTEL
// =====================================================

async function reviewHostel(req, res) {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admins can review hostels."
            });
        }

        const { verificationStatus, rejectionReason } = req.body;

        if (!["Verified", "Rejected"].includes(verificationStatus)) {
    return res.status(400).json({
        success: false,
        message: "Choose Verified or Rejected."
    });
}

if (
    verificationStatus === "Rejected" &&
    (!rejectionReason || !rejectionReason.trim())
) {
    return res.status(400).json({
        success: false,
        message: "Please provide a reason for rejecting the hostel."
    });
}

        const hostel = await Hostel.findById(req.params.id);

        if (!hostel) {
            return res.status(404).json({
                success: false,
                message: "Hostel not found."
            });
        }

       hostel.verificationStatus = verificationStatus;

hostel.verifiedAt =
    verificationStatus === "Verified"
        ? new Date()
        : null;

hostel.rejectionReason =
    verificationStatus === "Rejected"
        ? rejectionReason.trim()
        : "";

        await hostel.save();

        return res.status(200).json({
            success: true,
            message:
                verificationStatus === "Verified"
                    ? "Hostel verified successfully."
                    : "Hostel rejected successfully.",
            hostel
        });

    } catch (error) {
        console.error("Review hostel error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to review hostel."
        });
    }
}

async function uploadVerificationDocuments(req, res) {
try {
// Only hostel owners can upload verification documents.
if (req.user.role !== "owner") {
return res.status(403).json({
success: false,
message: "Only hostel owners can upload verification documents."
});
}


    const hostel = await Hostel.findOne({
        _id: req.params.id,
        owner: req.user.id
    });

    if (!hostel) {
        // Remove newly uploaded files if the hostel is not owned by this user.
        for (const file of req.files || []) {
            fs.unlink(file.path, () => {});
        }

        return res.status(404).json({
            success: false,
            message: "Hostel not found or you do not own this hostel."
        });
    }

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Please upload at least one verification document."
        });
    }

    const allowedTypes = [
        "Property Proof",
        "Owner Identity",
        "Business Registration",
        "Other"
    ];

    const documents = [];

    for (const file of req.files) {
        const documentType = req.body.documentType;

        if (!allowedTypes.includes(documentType)) {
            // Remove files that were uploaded with invalid document metadata.
            for (const uploadedFile of req.files) {
                fs.unlink(uploadedFile.path, () => {});
            }

            return res.status(400).json({
                success: false,
                message: "Select a valid document type."
            });
        }

        documents.push({
            documentType,
            filename: file.filename,
            originalName: path.basename(file.originalname),
            mimeType: file.mimetype,
            uploadedAt: new Date()
        });
    }

    hostel.verificationDocuments.push(...documents);
    hostel.verificationStatus = "Pending";
    hostel.verifiedAt = null;
    hostel.rejectionReason = "";

    await hostel.save();

    return res.status(200).json({
        success: true,
        message: "Verification documents uploaded successfully. Your hostel is now pending review.",
        verificationStatus: hostel.verificationStatus,
        documents: hostel.verificationDocuments.map(document => ({
            _id: document._id,
            documentType: document.documentType,
            originalName: document.originalName,
            uploadedAt: document.uploadedAt
        }))
    });
} catch (error) {
    console.error("Upload verification documents error:", error);

    return res.status(500).json({
        success: false,
        message: "Unable to upload verification documents."
    });
}


}
async function downloadVerificationDocument(req, res) {
try {
// Only administrators may access verification documents.
if (req.user.role !== "admin") {
return res.status(403).json({
success: false,
message: "Only administrators can access verification documents."
});
}


    const { id, documentId } = req.params;

    const hostel = await Hostel.findById(id);

    if (!hostel) {
        return res.status(404).json({
            success: false,
            message: "Hostel not found."
        });
    }

    const document = hostel.verificationDocuments.id(documentId);

    if (!document) {
        return res.status(404).json({
            success: false,
            message: "Verification document not found."
        });
    }

    // The filename comes from trusted server-side database metadata.
    const privateDirectory = path.resolve(
        __dirname,
        "..",
        "private_uploads",
        "verification-documents"
    );

    const safeFilename = path.basename(document.filename);

    if (safeFilename !== document.filename) {
        return res.status(400).json({
            success: false,
            message: "Invalid document reference."
        });
    }

    const filePath = path.join(privateDirectory, safeFilename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({
            success: false,
            message: "Stored document file not found."
        });
    }

    res.setHeader("Cache-Control", "private, no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");

    return res.download(
        filePath,
        path.basename(document.originalName),
        {
            dotfiles: "deny"
        },
        (error) => {
            if (error && !res.headersSent) {
                console.error("Document download error:", error);

                res.status(500).json({
                    success: false,
                    message: "Unable to download the document."
                });
            }
        }
    );
} catch (error) {
    console.error("Download verification document error:", error);

    return res.status(500).json({
        success: false,
        message: "Unable to access the verification document."
    });
}


}



module.exports = {
    getMyHostels,
    updateMyHostel,
    getAllHostels,
     uploadHostelPhotos,
     getPendingHostels,
    reviewHostel,
    uploadVerificationDocuments,
    downloadVerificationDocument
};
