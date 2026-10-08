// =====================================================
// OWNER DASHBOARD
// CONNECT FRONTEND TO BACKEND
// =====================================================

const API_URL = "/api/hostels";
let currentHostel = null;

// =====================================================
// LOAD OWNER HOSTEL
// =====================================================

async function loadOwnerHostel() {

    const token = localStorage.getItem("stayFinderToken");

    // -------------------------------------------------
    // CHECK LOGIN
    // -------------------------------------------------

    if (!token) {

        alert("Please login as an owner first.");

        window.location.href = "index.html";

        return;
    }


    try {

        // -------------------------------------------------
        // REQUEST OWNER'S HOSTELS
        // -------------------------------------------------

        const response = await fetch(
            `${API_URL}/my`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        const data = await response.json();


        // -------------------------------------------------
        // HANDLE ERROR
        // -------------------------------------------------

        if (!response.ok) {

            console.error(
                "Failed to load hostel:",
                data.message
            );

            alert(
                data.message ||
                "Unable to load hostel information."
            );

            return;
        }


        // -------------------------------------------------
        // CHECK WHETHER OWNER HAS A HOSTEL
        // -------------------------------------------------

        if (!data.hostels || data.hostels.length === 0) {

            console.log(
                "This owner has not registered a hostel yet."
            );

            showNoHostelMessage();

            return;
        }


        // -------------------------------------------------
        // GET FIRST HOSTEL
        // -------------------------------------------------

        const hostel = data.hostels[0];


        // -------------------------------------------------
        // DISPLAY HOSTEL
        // -------------------------------------------------

        displayHostel(hostel);

    }

    catch (error) {

        console.error(
            "Owner dashboard error:",
            error
        );

        alert(
            "Cannot connect to the server. Please make sure the backend is running."
        );
    }
}


// =====================================================
// DISPLAY HOSTEL DATA
// =====================================================

function displayHostel(hostel) {

    console.log(
        "Hostel received from backend:",
        hostel
    );
        currentHostel = hostel;

    // -------------------------------------------------
    // PROPERTY NAME
    // -------------------------------------------------

    const propertyName =
        document.getElementById("propertyName");

    if (propertyName) {

        propertyName.textContent =
            hostel.name;
    }


    // -------------------------------------------------
    // LOCATION
    // -------------------------------------------------

    const locationElement =
        document.querySelector(".property-location");

    if (locationElement) {

        locationElement.textContent =
            `📍 ${hostel.location}`;
    }


    // -------------------------------------------------
    // TOTAL ROOMS
    // -------------------------------------------------

    const totalRooms =
        Number(hostel.totalRooms);


    // -------------------------------------------------
    // AVAILABLE ROOMS
    // -------------------------------------------------

    const availableRooms =
        Number(hostel.availableRooms);


    // -------------------------------------------------
    // OCCUPIED ROOMS
    // -------------------------------------------------

    const occupiedRooms =
        totalRooms - availableRooms;


    // -------------------------------------------------
    // TOTAL ROOMS DISPLAY
    // -------------------------------------------------

    const totalRoomsDisplay =
        document.getElementById(
            "totalRoomsDisplay"
        );

    if (totalRoomsDisplay) {

        totalRoomsDisplay.textContent =
            totalRooms;
    }


    // -------------------------------------------------
    // CHART TOTAL ROOMS
    // -------------------------------------------------

    const chartTotalRooms =
        document.getElementById(
            "chartTotalRooms"
        );

    if (chartTotalRooms) {

        chartTotalRooms.textContent =
            totalRooms;
    }


    // -------------------------------------------------
    // OCCUPIED ROOMS
    // -------------------------------------------------

    const occupiedRoomsDisplay =
        document.getElementById(
            "occupiedRoomsDisplay"
        );

    if (occupiedRoomsDisplay) {

        occupiedRoomsDisplay.textContent =
            occupiedRooms;
    }


    // -------------------------------------------------
    // OCCUPANCY %
    // -------------------------------------------------

    let occupancy = 0;

    if (totalRooms > 0) {

        occupancy =
            Math.round(
                (occupiedRooms / totalRooms) * 100
            );
    }


    const occupancyDisplay =
        document.getElementById(
            "occupancyDisplay"
        );

    if (occupancyDisplay) {

        occupancyDisplay.textContent =
            `${occupancy}%`;
    }


    // -------------------------------------------------
    // RENT
    // -------------------------------------------------

    const rentDisplay =
        document.getElementById(
            "rentDisplay"
        );

    if (rentDisplay) {

        rentDisplay.textContent =
            `₹${Number(hostel.rent).toLocaleString("en-IN")}`;
    }


    const pricingRent =
        document.getElementById(
            "pricingRent"
        );

    if (pricingRent) {

        pricingRent.textContent =
            `₹${Number(hostel.rent).toLocaleString("en-IN")}`;
    }


    // -------------------------------------------------
    // AVAILABLE ROOMS TEXT
    // -------------------------------------------------

    const roomStatusElements =
        document.querySelectorAll(
            ".room-status"
        );


    if (roomStatusElements.length >= 2) {

        // Available
        const availableSmall =
            roomStatusElements[0]
                .querySelector("small");

        if (availableSmall) {

            availableSmall.textContent =
                `${availableRooms} Rooms`;
        }


        // Occupied
        const occupiedSmall =
            roomStatusElements[1]
                .querySelector("small");

        if (occupiedSmall) {

            occupiedSmall.textContent =
                `${occupiedRooms} Rooms`;
        }


        // Available percentage
        const availablePercentage =
            totalRooms > 0
                ? Math.round(
                    (availableRooms / totalRooms) * 100
                )
                : 0;


        const availablePercent =
            roomStatusElements[0]
                .querySelector("b");

        if (availablePercent) {

            availablePercent.textContent =
                `${availablePercentage}%`;
        }


        // Occupied percentage
        const occupiedPercent =
            roomStatusElements[1]
                .querySelector("b");

        if (occupiedPercent) {

            occupiedPercent.textContent =
                `${occupancy}%`;
        }
    }


    // -------------------------------------------------
    // FACILITIES
    // -------------------------------------------------

    displayFacilities(
        hostel.facilities || []
    );


    // -------------------------------------------------
    // STATUS
    // -------------------------------------------------

    displayHostelStatus(
        hostel.status
    );
}


// =====================================================
// DISPLAY FACILITIES
// =====================================================

function displayFacilities(facilities) {

    const facilitiesGrid =
        document.querySelector(
            ".facilities-grid"
        );

    if (!facilitiesGrid) {
        return;
    }


    facilitiesGrid.innerHTML = "";


    if (facilities.length === 0) {

        facilitiesGrid.innerHTML =
            "<p>No facilities added yet.</p>";

        return;
    }


    facilities.forEach(function (facility) {

        const div =
            document.createElement("div");

        div.className =
            "facility-item";

        div.innerHTML = `
            <span>✓</span>
            ${facility}
        `;

        facilitiesGrid.appendChild(div);
    });
}


// =====================================================
// DISPLAY HOSTEL STATUS
// =====================================================

function displayHostelStatus(status) {

    const statusElement =
        document.querySelector(
            ".property-status"
        );

    if (!statusElement) {
        return;
    }


    let icon = "●";


    if (status === "Full") {

        icon = "●";

    }
    else if (status === "Few Rooms Left") {

        icon = "●";

    }
    else {

        icon = "●";
    }


    statusElement.textContent =
        `${icon} ${status}`;
}


// =====================================================
// NO HOSTEL MESSAGE
// =====================================================

function showNoHostelMessage() {

    const propertyName =
        document.getElementById(
            "propertyName"
        );

    if (propertyName) {

        propertyName.textContent =
            "No Hostel Registered";
    }


    const location =
        document.querySelector(
            ".property-location"
        );

    if (location) {

        location.textContent =
            "📍 Please register your hostel.";
    }
}


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadOwnerHostel();

    }
);
// =====================================================
// EDIT PROPERTY
// =====================================================

function openEditPropertyForm() {

    if (!currentHostel) {
        alert("Hostel information is not loaded yet.");
        return;
    }


    const editSection =
        document.getElementById(
            "editPropertySection"
        );

    if (editSection) {
        editSection.style.display = "block";
    }


    document.getElementById(
        "editHostelName"
    ).value =
        currentHostel.name || "";


    document.getElementById(
        "editHostelLocation"
    ).value =
        currentHostel.location || "";


    document.getElementById(
        "editTotalRooms"
    ).value =
        currentHostel.totalRooms || 0;


    document.getElementById(
        "editAvailableRooms"
    ).value =
        currentHostel.availableRooms || 0;


    document.getElementById(
        "editRent"
    ).value =
        currentHostel.rent || 0;


    document.getElementById(
        "editSecurityDeposit"
    ).value =
        currentHostel.securityDeposit || 0;


    // Clear all facility checkboxes first

    const facilityCheckboxes =
        document.querySelectorAll(
            'input[name="facility"]'
        );

    facilityCheckboxes.forEach(
        function (checkbox) {

            checkbox.checked = false;

        }
    );


    // Select existing facilities

    const facilities =
        currentHostel.facilities || [];

    facilityCheckboxes.forEach(
        function (checkbox) {

            if (
                facilities.includes(
                    checkbox.value
                )
            ) {
                checkbox.checked = true;
            }

        }
    );


    editSection.scrollIntoView({
        behavior: "smooth"
    });
}
const editPropertyButton =
    document.getElementById(
        "editPropertyButton"
    );

if (editPropertyButton) {

    editPropertyButton.addEventListener(
        "click",
        openEditPropertyForm
    );

}
// =====================================================
// SAVE PROPERTY CHANGES
// =====================================================

const editPropertyForm =
    document.getElementById(
        "editPropertyForm"
    );

if (editPropertyForm) {

    editPropertyForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            if (!currentHostel) {

                alert(
                    "Hostel information is not loaded."
                );

                return;
            }


            const token =
                localStorage.getItem(
                    "stayFinderToken"
                );


            if (!token) {

                alert(
                    "Please login again."
                );

                return;
            }


            const facilities = [];


            document
                .querySelectorAll(
                    'input[name="facility"]:checked'
                )
                .forEach(
                    function (checkbox) {

                        facilities.push(
                            checkbox.value
                        );

                    }
                );


            const updatedData = {

                name:
                    document.getElementById(
                        "editHostelName"
                    ).value,

                location:
                    document.getElementById(
                        "editHostelLocation"
                    ).value,

                totalRooms:
                    Number(
                        document.getElementById(
                            "editTotalRooms"
                        ).value
                    ),

                availableRooms:
                    Number(
                        document.getElementById(
                            "editAvailableRooms"
                        ).value
                    ),

                rent:
                    Number(
                        document.getElementById(
                            "editRent"
                        ).value
                    ),

                securityDeposit:
                    Number(
                        document.getElementById(
                            "editSecurityDeposit"
                        ).value
                    ),

                facilities:
                    facilities
            };


            if (
                updatedData.availableRooms >
                updatedData.totalRooms
            ) {

                alert(
                    "Available rooms cannot be greater than total rooms."
                );

                return;
            }


            try {

                const response =
                    await fetch(
                        `${API_URL}/${currentHostel._id}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${token}`
                            },

                            body:
                                JSON.stringify(
                                    updatedData
                                )
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    alert(
                        data.message ||
                        "Unable to update property."
                    );

                    return;
                }


                alert(
                    "Property updated successfully!"
                );


                currentHostel =
                    data.hostel;


                displayHostel(
                    data.hostel
                );


                const editSection =
                    document.getElementById(
                        "editPropertySection"
                    );

                if (editSection) {

                    editSection.style.display =
                        "none";

                }

            }
            catch (error) {

                console.error(
                    "Update property error:",
                    error
                );

                alert(
                    "Cannot connect to the server."
                );

            }

        }
    );

}
const cancelEditProperty =
    document.getElementById(
        "cancelEditProperty"
    );

if (cancelEditProperty) {

    cancelEditProperty.addEventListener(
        "click",
        function () {

            const editSection =
                document.getElementById(
                    "editPropertySection"
                );

            if (editSection) {

                editSection.style.display =
                    "none";

            }

        }
    );

}