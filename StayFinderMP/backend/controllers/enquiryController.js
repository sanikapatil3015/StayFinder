
const Enquiry = require("../models/Enquiry");
const Hostel = require("../models/Hostel");
const Notification = require("../models/Notification");
const User = require("../models/User");

// Get enquiries for the logged-in owner's hostel
const getOwnerEnquiries = async (req, res) => {
    try {
        // Find the hostel belonging to this owner
        const hostel = await Hostel.findOne({
            owner: req.user.id
        });

        if (!hostel) {
            return res.status(404).json({
                success: false,
                message: "No hostel found for this owner."
            });
        }

        // Find enquiries for this hostel
        const enquiries = await Enquiry.find({
            hostel: hostel._id
        })
            .populate("student", "name")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            enquiries
        });

    } catch (error) {
        console.error("Error fetching enquiries:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch enquiries."
        });
    }
};


const createEnquiry = async (req, res) => {
try {
const { hostelId, message } = req.body;


    if (!hostelId || !message || !message.trim()) {
        return res.status(400).json({
            success: false,
            message: "Hostel and enquiry message are required."
        });
    }

    const hostel = await Hostel.findById(hostelId);

    if (!hostel) {
        return res.status(404).json({
            success: false,
            message: "Hostel not found."
        });
    }

    if (req.user.role !== "student") {
        return res.status(403).json({
            success: false,
            message: "Only students can send enquiries."
        });
    }

    const enquiry = await Enquiry.create({
        student: req.user.id,
        hostel: hostel._id,
        message: message.trim()
    });
     
const student = await User.findById(req.user.id).select("name");

await Notification.create({
    owner: hostel.owner,
    type: "enquiry",
    title: "New Student Enquiry",
    message: `${student ? student.name : "A student"} sent an enquiry: ${enquiry.message}`
});



    return res.status(201).json({
        success: true,
        message: "Enquiry sent successfully.",
        enquiry
    });

} catch (error) {
    console.error("Error creating enquiry:", error);

    return res.status(500).json({
        success: false,
        message: "Unable to send enquiry."
    });
}


};
async function updateEnquiryStatus(req, res) {
try {
const { status } = req.body;
const { enquiryId } = req.params;


    const allowedStatuses = [
        "New",
        "Contacted",
        "Pending",
        "Closed"
    ];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid enquiry status."
        });
    }

    if (req.user.role !== "owner") {
        return res.status(403).json({
            success: false,
            message: "Only hostel owners can update enquiry status."
        });
    }

    const Hostel = require("../models/Hostel");

    const hostel = await Hostel.findOne({
        owner: req.user.id
    });

    if (!hostel) {
        return res.status(404).json({
            success: false,
            message: "Hostel not found."
        });
    }

    const enquiry = await Enquiry.findOne({
        _id: enquiryId,
        hostel: hostel._id
    });

    if (!enquiry) {
        return res.status(404).json({
            success: false,
            message: "Enquiry not found for your hostel."
        });
    }

    enquiry.status = status;
    await enquiry.save();

    return res.status(200).json({
        success: true,
        message: "Enquiry status updated successfully.",
        enquiry
    });

} catch (error) {
    console.error("Update enquiry status error:", error);

    return res.status(500).json({
        success: false,
        message: "Server error while updating enquiry status."
    });
}


}


module.exports = {
getOwnerEnquiries,
createEnquiry,
updateEnquiryStatus
};

