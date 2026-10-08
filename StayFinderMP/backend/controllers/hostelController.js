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
module.exports = {
    getMyHostels,
    updateMyHostel
};