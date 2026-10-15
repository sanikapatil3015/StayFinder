function authorizeAdmin(req, res, next) {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin permission required."
        });
    }

    next();
}

module.exports = authorizeAdmin;