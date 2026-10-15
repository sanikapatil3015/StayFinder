const express = require("express");

const {
    getOwnerNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
} = require("../controllers/notificationController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get notifications and unread count
router.get("/", protect, getOwnerNotifications);

// Mark all notifications as read
router.patch("/read-all", protect, markAllNotificationsAsRead);

// Mark one notification as read
router.patch("/:notificationId/read", protect, markNotificationAsRead);

module.exports = router;