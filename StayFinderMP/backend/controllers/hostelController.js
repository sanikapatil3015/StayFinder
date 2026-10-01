const Hostel = require("../models/Hostel");


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


module.exports = {
    getMyHostels
};