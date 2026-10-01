const jwt = require("jsonwebtoken");

function protect(req, res, next) {

    try {

        const authHeader =
            req.headers.authorization;

        // Check whether Authorization header exists
        if (!authHeader) {

            return res.status(401).json({
                success: false,
                message: "No authorization token provided."
            });

        }

        // Expected format:
        // Bearer YOUR_TOKEN
        const token =
            authHeader.startsWith("Bearer ")
                ? authHeader.split(" ")[1]
                : null;

        if (!token) {

            return res.status(401).json({
                success: false,
                message: "Invalid authorization format."
            });

        }

        // Verify JWT
        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        // Store decoded user information
        // so controllers can access it
        req.user = decoded;

        next();

    }
    catch (error) {

        console.error(
            "Authentication error:",
            error.message
        );

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });

    }
}

module.exports = protect;