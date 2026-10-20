
const Enquiry = require("../models/Enquiry");
const Hostel = require("../models/Hostel");
const Notification = require("../models/Notification");
const User = require("../models/user");

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
// Get enquiries sent by the logged-in student
const getStudentEnquiries = async (req, res) => {
    try {
        // Only students can view their own enquiries
        if (req.user.role !== "student") {
            return res.status(403).json({
                success: false,
                message: "Only students can view their enquiries."
            });
        }

        // Find enquiries belonging to this student
        const enquiries = await Enquiry.find({
            student: req.user.id
        })
            .populate("hostel", "name location collegeName rent status mainPhoto")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            enquiries
        });

    } catch (error) {
        console.error("Error fetching student enquiries:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch your enquiries."
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
    recipient: hostel.owner,
    recipientRole: "owner",
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

const replyToEnquiry = async (req, res) => {
    try {
        const { enquiryId } = req.params;
        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Reply message is required"
            });
        }

        if (req.user.role !== "owner") {
            return res.status(403).json({
                success: false,
                message: "Only hostel owners can reply"
            });
        }

        const enquiry = await Enquiry.findById(enquiryId);

        if (!enquiry) {
            return res.status(404).json({
                success: false,
                message: "Enquiry not found"
            });
        }

        const hostel = await Hostel.findOne({
            _id: enquiry.hostel,
            owner: req.user.id
        });

        if (!hostel) {
            return res.status(403).json({
                success: false,
                message: "You cannot reply to this enquiry"
            });
        }

        enquiry.replies.push({
            message: message.trim(),
            repliedAt: new Date(),
            isRead: false
        });

        await enquiry.save();

        await Notification.create({
            recipient: enquiry.student,
            recipientRole: "student",
            type: "message",
            title: "New Reply from Hostel Owner",
            message: message.trim()
        });

        return res.status(200).json({
            success: true,
            message: "Reply sent successfully",
            enquiry
        });
    } catch (error) {
        console.error("Reply to enquiry error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to send reply"
        });
    }
};
module.exports = {
getOwnerEnquiries,
getStudentEnquiries,
createEnquiry,
updateEnquiryStatus,
replyToEnquiry
};

