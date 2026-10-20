const mongoose = require("mongoose");
const Notification = require("../models/Notification");

// Get notifications for the logged-in student or owner
const getOwnerNotifications = async (req, res) => {
try {
const userId = req.user.id;
const userRole = req.user.role;


    if (!userId || !["owner", "student"].includes(userRole)) {
        return res.status(403).json({
            success: false,
            message: "Access denied."
        });
    }

    const notifications = await Notification.find({
        recipient: userId,
        recipientRole: userRole
    }).sort({ createdAt: -1 });

    const unreadCount = await Notification.countDocuments({
        recipient: userId,
        recipientRole: userRole,
        isRead: false
    });

    return res.status(200).json({
        success: true,
        notifications,
        unreadCount
    });
} catch (error) {
    console.error("Error fetching notifications:", error);

    return res.status(500).json({
        success: false,
        message: "Unable to fetch notifications."
    });
}


};

// Mark one notification as read
const markNotificationAsRead = async (req, res) => {
try {
const userId = req.user.id;
const userRole = req.user.role;
const { notificationId } = req.params;


    if (!userId || !["owner", "student"].includes(userRole)) {
        return res.status(403).json({
            success: false,
            message: "Access denied."
        });
    }

    if (!mongoose.isValidObjectId(notificationId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid notification ID."
        });
    }

    const notification = await Notification.findOneAndUpdate(
        {
            _id: notificationId,
            recipient: userId,
            recipientRole: userRole
        },
        {
            $set: { isRead: true }
        },
        {
            new: true,
            runValidators: true
        }
    );

    if (!notification) {
        return res.status(404).json({
            success: false,
            message: "Notification not found."
        });
    }

    return res.status(200).json({
        success: true,
        message: "Notification marked as read.",
        notification
    });
} catch (error) {
    console.error("Error updating notification:", error);

    return res.status(500).json({
        success: false,
        message: "Unable to update notification."
    });
}


};

// Mark all notifications as read for the logged-in user
const markAllNotificationsAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            {
                recipient: req.user.id,
                recipientRole: req.user.role,
                isRead: false
            },
            {
                $set: { isRead: true }
            }
        );

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read"
        });
    } catch (error) {
        console.error("Mark all notifications as read error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to mark notifications as read"
        });
    }
};

module.exports = {
getOwnerNotifications,
markNotificationAsRead,
markAllNotificationsAsRead
};
