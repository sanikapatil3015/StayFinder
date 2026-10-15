const Notification = require("../models/Notification");

// Get notifications for the logged-in owner
const getOwnerNotifications = async (req, res) => {
    try {
        if (req.user.role !== "owner") {
            return res.status(403).json({
                success: false,
                message: "Only hostel owners can access notifications."
            });
        }

        const notifications = await Notification.find({
            owner: req.user.id
        }).sort({ createdAt: -1 });

        const unreadCount = await Notification.countDocuments({
            owner: req.user.id,
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
        if (req.user.role !== "owner") {
            return res.status(403).json({
                success: false,
                message: "Only hostel owners can update notifications."
            });
        }

        const notification = await Notification.findOneAndUpdate(
            {
                _id: req.params.notificationId,
                owner: req.user.id
            },
            {
                isRead: true
            },
            {
                new: true
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

// Mark all notifications as read
const markAllNotificationsAsRead = async (req, res) => {
    try {
        if (req.user.role !== "owner") {
            return res.status(403).json({
                success: false,
                message: "Only hostel owners can update notifications."
            });
        }

        await Notification.updateMany(
            {
                owner: req.user.id,
                isRead: false
            },
            {
                isRead: true
            }
        );

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read."
        });
    } catch (error) {
        console.error("Error marking all notifications as read:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to update notifications."
        });
    }
};

module.exports = {
    getOwnerNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
};