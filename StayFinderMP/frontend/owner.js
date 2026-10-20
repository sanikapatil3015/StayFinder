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

console.log(
    "Verification status:",
    hostel.verificationStatus
);

console.log(
    "Rejection reason:",
    hostel.rejectionReason
);

// DISPLAY HOSTEL

displayHostel(hostel);
loadHostelReviews();

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
// DISPLAY ADMIN VERIFICATION STATUS
// =====================================================

function displayVerificationStatus(hostel) {
    if (!hostel) {
        return;
    }

    // Get the verification status from the backend
    const status = (
        hostel.verificationStatus || "Pending"
    ).trim();

    const normalizedStatus = status.toLowerCase();

    const rejectionReason = hostel.rejectionReason || "";

    // Elements in the Hostel Verification section
    const statusText = document.getElementById(
        "verificationStatusText"
    );

    const messageText = document.getElementById(
        "verificationMessage"
    );

    const rejectionContainer = document.getElementById(
        "rejectionReasonContainer"
    );

    const rejectionText = document.getElementById(
        "rejectionReasonText"
    );

    // Element in the main hostel card
    const hostelBadge = document.getElementById(
        "hostelVerificationBadge"
    );

    // Update the main hostel card badge
    if (hostelBadge) {
        if (normalizedStatus === "verified") {
            hostelBadge.textContent = "✓ Verified";
        } else if (normalizedStatus === "rejected") {
            hostelBadge.textContent = "✕ Rejected";
        } else {
            hostelBadge.textContent = "⏳ Pending Verification";
        }

        // Update badge styling
        hostelBadge.classList.remove(
            "verified",
            "pending",
            "rejected"
        );

        if (normalizedStatus === "verified") {
            hostelBadge.classList.add("verified");
        } else if (normalizedStatus === "rejected") {
            hostelBadge.classList.add("rejected");
        } else {
            hostelBadge.classList.add("pending");
        }
    }

    // Update the separate Hostel Verification section
    if (statusText) {
        statusText.textContent = status;
    }

    if (messageText) {
        if (normalizedStatus === "verified") {
            messageText.textContent =
                "Your hostel has been verified and can be displayed to students.";
        } else if (normalizedStatus === "rejected") {
            messageText.textContent =
                "Your hostel verification was rejected. Please review the reason below.";
        } else {
            messageText.textContent =
                "Your hostel is awaiting verification by the Stay Finder admin.";
        }
    }

    // Show or hide the rejection reason
    if (rejectionContainer) {
        rejectionContainer.hidden =
            normalizedStatus !== "rejected";
    }

    if (rejectionText) {
        rejectionText.textContent = rejectionReason;
    }
}
// =====================================================
// DISPLAY HOSTEL DATA
// =====================================================

function displayHostel(hostel) {
    
// Display the saved main hostel photo
const propertyImage = document.querySelector(".property-image");

if (propertyImage) {
    let mainPhotoElement = propertyImage.querySelector(".main-hostel-photo");
    const placeholder = propertyImage.querySelector(".property-placeholder");

    if (hostel.mainPhoto) {
        if (!mainPhotoElement) {
            mainPhotoElement = document.createElement("img");
            mainPhotoElement.className = "main-hostel-photo";
            mainPhotoElement.alt = hostel.name + " main photo";
            propertyImage.appendChild(mainPhotoElement);
        }

        mainPhotoElement.src = hostel.mainPhoto.startsWith("http")
            ? hostel.mainPhoto
            : "http://localhost:5000" + hostel.mainPhoto;

        mainPhotoElement.style.display = "block";

        if (placeholder) {
            placeholder.style.display = "none";
        }
    } else {
        if (mainPhotoElement) {
            mainPhotoElement.style.display = "none";
        }

        if (placeholder) {
            placeholder.style.display = "flex";
        }
    }
}


    console.log(
    "Hostel received from backend:",
    hostel
);

currentHostel = hostel;

// Update verification status in both places
displayVerificationStatus(hostel);

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
    // SECURITY DEPOSIT
const depositElement =
    document.getElementById("pricingSecurityDeposit");

if (depositElement) {
    depositElement.textContent =
        `₹${Number(hostel.securityDeposit || 0).toLocaleString("en-IN")}`;
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


    // DISPLAY ROOM AVAILABILITY STATUS
displayHostelStatus(hostel.status);

// DISPLAY ADMIN VERIFICATION STATUS
displayVerificationStatus(hostel);

updateHostelAnalytics(hostel);
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
// LOAD HOSTEL REVIEWS
// =====================================================

async function loadHostelReviews() {

    try {

        const token =
            localStorage.getItem("stayFinderToken");

        if (!token || !currentHostel?._id) {
            console.log(
                "Token or hostel information is missing."
            );
            return;
        }

        const response = await fetch(
            `/api/reviews/hostel/${currentHostel._id}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            console.error(
                "Unable to load reviews:",
                data.message
            );
            return;
        }

        // Update the review summary

        const average =
            data.summary.averageRating;
        // Update the Average Rating card on the dashboard
        const dashboardRating = document.getElementById(
        "dashboardAverageRating"
        );
        const dashboardStars = document.getElementById("dashboardRatingStars");

if (dashboardRating) {
    dashboardRating.textContent = average.toFixed(1);
}
if (dashboardStars) {
    const fullStars = Math.round(average);
    dashboardStars.textContent =
        "★ ".repeat(fullStars) + "☆ ".repeat(5 - fullStars);
    dashboardStars.textContent = dashboardStars.textContent.trim();
}

        document.getElementById(
            "overallRating"
        ).textContent = average.toFixed(1);

        document.getElementById(
            "averageRating"
        ).textContent = `${average.toFixed(1)} / 5`;

        document.getElementById(
            "totalReviews"
        ).textContent = data.summary.totalReviews;

        document.getElementById(
            "positivePercentage"
        ).textContent =
            `${data.summary.positivePercentage}%`;

        // Display stars

        const fullStars = Math.round(average);

        document.getElementById(
            "overallStars"
        ).textContent =
            "★".repeat(fullStars) +
            "☆".repeat(5 - fullStars);

        // Display individual reviews

        const reviewsList =
            document.getElementById("reviewsList");

        reviewsList.replaceChildren();

        if (data.reviews.length === 0) {

            const message =
                document.createElement("p");

            message.textContent =
                "No reviews have been submitted yet.";

            reviewsList.appendChild(message);

            return;
        }

        data.reviews.forEach(function (review) {

            const card =
                document.createElement("div");

            card.className = "student-review";

            const name =
                document.createElement("h3");

            name.textContent =
                review.student?.name || "Student";

            const stars =
                document.createElement("p");

            stars.textContent =
                "★".repeat(review.rating) +
                "☆".repeat(5 - review.rating);

            const comment =
                document.createElement("p");

            comment.textContent = review.comment;

            const date =
                document.createElement("small");

            date.textContent =
                new Date(
                    review.createdAt
                ).toLocaleDateString();

            card.append(name, stars, comment, date);

            reviewsList.appendChild(card);

        });

    } catch (error) {

        console.error(
            "Error loading hostel reviews:",
            error
        );

    }

}
/* =========================================
   LOAD OWNER ENQUIRIES
========================================= */
async function loadOwnerEnquiries() {
    const token = localStorage.getItem("stayFinderToken");
    const enquiryList = document.getElementById("enquiryList");
    const viewAllButton = document.getElementById("viewAllEnquiriesBtn");

    let allEnquiries = [];
    let showAllEnquiries = false;

    if (!enquiryList) {
        console.error("Enquiry list container was not found.");
        return;
    }

    if (!token) {
        enquiryList.textContent = "Please log in to view enquiries.";
        return;
    }

    try {
        const response = await fetch("/api/enquiries/my", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            enquiryList.textContent =
                data.message || "Unable to load enquiries.";
            return;
        }

        allEnquiries = data.enquiries || [];
        // Update Student Enquiries in Analytics
const enquiriesCountElement = document.getElementById(
    "analyticsStudentEnquiries"
);

if (enquiriesCountElement) {
    enquiriesCountElement.textContent = allEnquiries.length;
}

        if (allEnquiries.length === 0) {
            enquiryList.textContent = "No enquiries received yet.";

            if (viewAllButton) {
                viewAllButton.style.display = "none";
            }

            return;
        }

        function renderEnquiries() {
            enquiryList.replaceChildren();

            const enquiriesToDisplay = showAllEnquiries
                ? allEnquiries
                : allEnquiries.slice(0, 4);

            enquiriesToDisplay.forEach(function (enquiry) {
                const card = document.createElement("div");
                card.className = "enquiry";

                const studentName =
                    enquiry.student && enquiry.student.name
                        ? enquiry.student.name
                        : "Student";

                // Student avatar
                const avatar = document.createElement("div");
                avatar.className = "enquiry-avatar";

                avatar.textContent = studentName
                    .split(/\s+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map(function (part) {
                        return part.charAt(0).toUpperCase();
                    })
                    .join("");

                // Student name and enquiry message
                const info = document.createElement("div");
                info.className = "enquiry-info";

                const name = document.createElement("strong");
                name.textContent = studentName;

                const message = document.createElement("span");
                message.textContent =
                    enquiry.message || "No message provided.";

                info.append(name, message);

                // Date and status
                const right = document.createElement("div");
                right.className = "enquiry-right";

                const date = document.createElement("small");

                date.textContent = enquiry.createdAt
                    ? new Date(enquiry.createdAt).toLocaleDateString(
                        "en-IN",
                        {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                        }
                    )
                    : "";

                // Enquiry status dropdown
                const statusSelect = document.createElement("select");
                statusSelect.className = "enquiry-status-select";

                const allowedStatuses = [
                    "New",
                    "Contacted",
                    "Pending",
                    "Closed"
                ];

                const originalStatus = enquiry.status || "New";

                allowedStatuses.forEach(function (statusOption) {
                    const option = document.createElement("option");

                    option.value = statusOption;
                    option.textContent = statusOption;

                    if (statusOption === originalStatus) {
                        option.selected = true;
                    }

                    statusSelect.appendChild(option);
                });

                // Save status changes to the backend
                statusSelect.addEventListener(
                    "change",
                    async function () {
                        const newStatus = statusSelect.value;

                        statusSelect.disabled = true;

                        try {
                            const updateResponse = await fetch(
                                `/api/enquiries/${enquiry._id}/status`,
                                {
                                    method: "PATCH",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${token}`
                                    },
                                    body: JSON.stringify({
                                        status: newStatus
                                    })
                                }
                            );

                            const updateData =
                                await updateResponse.json();

                            if (
                                !updateResponse.ok ||
                                !updateData.success
                            ) {
                                throw new Error(
                                    updateData.message ||
                                    "Unable to update enquiry status."
                                );
                            }

                            // Remember the successfully saved status
                            enquiry.status = newStatus;

                            alert(
                                "Enquiry status updated to " +
                                newStatus +
                                "!"
                            );
                        } catch (error) {
                            alert(
                                error.message ||
                                "Could not update enquiry status."
                            );

                            statusSelect.value = enquiry.status || "New";
                        } finally {
                            statusSelect.disabled = false;
                        }
                    }
                );

                right.append(date, statusSelect);
                // Owner reply input
const replyInput = document.createElement("textarea");
replyInput.className = "owner-reply-input";
replyInput.placeholder = "Write a reply to the student...";

// Send reply button
const replyButton = document.createElement("button");
replyButton.type = "button";
replyButton.textContent = "Send Reply";
replyButton.className = "send-reply-btn";

// Reply status/message
const replyStatus = document.createElement("small");
replyStatus.className = "reply-status";

// Display existing replies
const repliesContainer = document.createElement("div");
repliesContainer.className = "owner-replies";

(enquiry.replies || []).forEach(function (reply) {
    const replyText = document.createElement("p");
    replyText.textContent = "Owner reply: " + reply.message;
    repliesContainer.appendChild(replyText);
});
replyButton.addEventListener("click", async function () {
    const replyMessage = replyInput.value.trim();

    if (!replyMessage) {
        alert("Please write a reply first.");
        return;
    }

    replyButton.disabled = true;
    replyStatus.textContent = "Sending...";

    try {
        const response = await fetch(
            `/api/enquiries/${enquiry._id}/reply`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    message: replyMessage
                })
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Failed to send reply.");
        }

        replyStatus.textContent = "Reply sent successfully!";
        replyInput.value = "";

        // Reload enquiries to display the saved reply
        await loadOwnerEnquiries();

    } catch (error) {
        console.error("Reply error:", error);
        replyStatus.textContent = error.message || "Could not send reply.";
    } finally {
        replyButton.disabled = false;
    }
});
                // Main enquiry row
const enquiryRow = document.createElement("div");
enquiryRow.className = "enquiry-row";

enquiryRow.append(avatar, info, right);

// Reply section underneath the enquiry
const replySection = document.createElement("div");
replySection.className = "owner-reply-section";

const replyHeading = document.createElement("strong");
replyHeading.textContent = "Reply to student";

replySection.append(
    replyHeading,
    replyInput,
    replyButton,
    replyStatus,
    repliesContainer
);

card.append(enquiryRow, replySection);
enquiryList.appendChild(card);
               
            });

           
           // Update the View All button
if (viewAllButton) {
    viewAllButton.style.display = "inline-block";

    viewAllButton.textContent = showAllEnquiries
        ? "Show Less"
        : "View All";
}


        }

        // Toggle between four enquiries and all enquiries
        
// Toggle between four enquiries and all enquiries
if (viewAllButton) {
    viewAllButton.onclick = function () {
        console.count("View All click count");

showAllEnquiries = !showAllEnquiries;

console.log("Show all enquiries:", showAllEnquiries);

renderEnquiries();

console.log("Enquiry list rendered:", enquiryList.children.length);
    };
}



        // Display the initial four enquiries
        renderEnquiries();

    } catch (error) {
        console.error("Error loading owner enquiries:", error);

        enquiryList.textContent =
            "Could not load enquiries. Please try again.";
    }
}




// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadOwnerHostel();
        loadOwnerEnquiries();

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
    const collegeNameInput = document.getElementById("editCollegeName");

if (collegeNameInput) {
    collegeNameInput.value = currentHostel.collegeName || "";
}


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

                    collegeName:
        document.getElementById(
            "editCollegeName"
        ).value.trim(),

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
// =====================================================
// DASHBOARD UPDATE BUTTONS
// Reuse the existing Edit Property form and save handler.
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    // Update Availability button
    const updateAvailabilityButton =
        document.getElementById("updateAvailabilityButton");

    if (updateAvailabilityButton) {
        updateAvailabilityButton.addEventListener("click", function () {
            openEditPropertyForm();
        });
    }

    // Update Pricing button
    // Finds the button using its existing visible text.
    const dashboardButtons =
        document.querySelectorAll("button.primary-dashboard-button");

    dashboardButtons.forEach(function (button) {

        if (button.textContent.trim() === "Update Pricing") {

            button.addEventListener("click", function () {
                openEditPropertyForm();
            });

        }

    });

});
// ================= HOSTEL PHOTO MANAGEMENT =================

document.addEventListener("DOMContentLoaded", function () {
const mainPhotoInput = document.getElementById("mainPhotoInput");
const additionalPhotosInput = document.getElementById("additionalPhotosInput");
const mainPhotoPreview = document.getElementById("mainPhotoPreview");
const additionalPhotosPreview = document.getElementById("additionalPhotosPreview");
const uploadButton = document.getElementById("uploadHostelPhotosButton");
const uploadMessage = document.getElementById("photoUploadMessage");
const savedPhotosContainer = document.getElementById("savedHostelPhotos");


if (
    !mainPhotoInput ||
    !additionalPhotosInput ||
    !mainPhotoPreview ||
    !additionalPhotosPreview ||
    !uploadButton ||
    !uploadMessage ||
    !savedPhotosContainer
) {
    return;
}

// Display an image from a URL
function createPhotoImage(src, alt) {
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.loading = "lazy";
    img.onerror = function () {
        img.alt = "Unable to load photo";
    };
    return img;
}

// Preview the selected main photo
mainPhotoInput.addEventListener("change", function () {
    mainPhotoPreview.replaceChildren();

    const file = mainPhotoInput.files[0];

    if (!file) {
        mainPhotoPreview.textContent = "No main photo selected.";
        return;
    }

    if (!file.type.startsWith("image/")) {
        mainPhotoPreview.textContent = "Please select an image.";
        mainPhotoInput.value = "";
        return;
    }

    mainPhotoPreview.appendChild(
        createPhotoImage(URL.createObjectURL(file), "Main hostel photo preview")
    );
});

// Preview additional photos
additionalPhotosInput.addEventListener("change", function () {
    additionalPhotosPreview.replaceChildren();

    const files = Array.from(additionalPhotosInput.files);

    if (files.length > 8) {
        uploadMessage.textContent = "Please select no more than 8 additional photos.";
        uploadMessage.className = "error";
        additionalPhotosInput.value = "";
        return;
    }

    uploadMessage.textContent = "";
    uploadMessage.className = "";

    files.forEach(function (file) {
        if (!file.type.startsWith("image/")) {
            uploadMessage.textContent = "Please select image files only.";
            uploadMessage.className = "error";
            return;
        }

        additionalPhotosPreview.appendChild(
            createPhotoImage(
                URL.createObjectURL(file),
                "Additional hostel photo preview"
            )
        );
    });
});

// Display saved photos from the database
function displaySavedPhotos(hostel) {
    savedPhotosContainer.replaceChildren();

    if (hostel.mainPhoto) {
        savedPhotosContainer.appendChild(
            createPhotoImage(hostel.mainPhoto, "Main hostel photo")
        );
    }

    if (Array.isArray(hostel.photos)) {
        hostel.photos.forEach(function (photo, index) {
            savedPhotosContainer.appendChild(
                createPhotoImage(photo, "Hostel gallery photo " + (index + 1))
            );
        });
    }

    if (!hostel.mainPhoto && (!hostel.photos || hostel.photos.length === 0)) {
        savedPhotosContainer.textContent = "No saved photos yet.";
    }
}

// Upload selected photos
uploadButton.addEventListener("click", async function () {
    if (!currentHostel || !currentHostel._id) {
        uploadMessage.textContent = "Please register your hostel before uploading photos.";
        uploadMessage.className = "error";
        return;
    }

    const mainFile = mainPhotoInput.files[0];
    const additionalFiles = Array.from(additionalPhotosInput.files);

    if (!mainFile && additionalFiles.length === 0) {
        uploadMessage.textContent = "Please select at least one photo.";
        uploadMessage.className = "error";
        return;
    }

    const allFiles = [
        ...(mainFile ? [mainFile] : []),
        ...additionalFiles
    ];

    const invalidFile = allFiles.some(function (file) {
        return !["image/jpeg", "image/png", "image/webp"].includes(file.type);
    });

    if (invalidFile) {
        uploadMessage.textContent = "Only JPG, PNG, and WEBP images are allowed.";
        uploadMessage.className = "error";
        return;
    }

    const oversizedFile = allFiles.some(function (file) {
        return file.size > 5 * 1024 * 1024;
    });

    if (oversizedFile) {
        uploadMessage.textContent = "Each photo must be 5 MB or smaller.";
        uploadMessage.className = "error";
        return;
    }

    const token = localStorage.getItem("stayFinderToken");

    if (!token) {
        uploadMessage.textContent = "Please log in again.";
        uploadMessage.className = "error";
        return;
    }

    const formData = new FormData();

    if (mainFile) {
        formData.append("mainPhoto", mainFile);
    }

    additionalFiles.forEach(function (file) {
        formData.append("photos", file);
    });

    try {
        uploadButton.disabled = true;
        uploadButton.textContent = "Uploading...";
        uploadMessage.textContent = "";

        const response = await fetch(
            API_URL + "/" + currentHostel._id + "/photos",
            {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + token
                },
                body: formData
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Photo upload failed.");
        }

        currentHostel = data.hostel;
        updateMainHostelPhoto(currentHostel);

        displaySavedPhotos(currentHostel);

        mainPhotoInput.value = "";
        additionalPhotosInput.value = "";

        mainPhotoPreview.textContent = "No new main photo selected.";
        additionalPhotosPreview.replaceChildren();

        uploadMessage.textContent = "Photos uploaded successfully!";
        uploadMessage.className = "success";
    } catch (error) {
        console.error("Hostel photo upload error:", error);
        uploadMessage.textContent = error.message || "Unable to upload photos.";
        uploadMessage.className = "error";
    } finally {
        uploadButton.disabled = false;
        uploadButton.textContent = "Upload Photos";
    }
});

// Load saved photos when the hostel information is loaded
const originalLoadOwnerHostel = loadOwnerHostel;

loadOwnerHostel = async function () {
    await originalLoadOwnerHostel();

    if (currentHostel) {
        displaySavedPhotos(currentHostel);
    }
};

if (currentHostel) {
    displaySavedPhotos(currentHostel);
}


});
function updateMainHostelPhoto(hostel) {
const propertyImage = document.querySelector(".property-image");


if (!propertyImage) return;

let photo = propertyImage.querySelector(".main-hostel-photo");
const placeholder = propertyImage.querySelector(".property-placeholder");

if (!hostel.mainPhoto) return;

if (!photo) {
    photo = document.createElement("img");
    photo.className = "main-hostel-photo";
    photo.alt = (hostel.name || "Hostel") + " photo";
    propertyImage.appendChild(photo);
}

photo.src = hostel.mainPhoto.startsWith("http")
    ? hostel.mainPhoto
    : "http://localhost:5000" + hostel.mainPhoto;

photo.style.display = "block";

if (placeholder) {
    placeholder.style.display = "none";
}


}

// Update Analytics using the current hostel data
function updateHostelAnalytics(hostel) {
    if (!hostel) {
        return;
    }

    const totalRooms = Number(hostel.totalRooms) || 0;
    const availableRooms = Number(hostel.availableRooms) || 0;

    // Prevent occupied rooms from becoming negative
    const occupiedRooms = Math.max(
        0,
        totalRooms - availableRooms
    );

    // Calculate occupancy percentage
    const occupancyRate = totalRooms > 0
        ? Math.round((occupiedRooms / totalRooms) * 100)
        : 0;

    // Find the Analytics HTML elements
    const totalRoomsElement =
        document.getElementById("analyticsTotalRooms");

    const availableRoomsElement =
        document.getElementById("analyticsAvailableRooms");

    const occupiedRoomsElement =
        document.getElementById("analyticsOccupiedRooms");

    const occupancyRateElement =
        document.getElementById("analyticsOccupancyRate");

    // Display the values
    if (totalRoomsElement) {
        totalRoomsElement.textContent = totalRooms;
    }

    if (availableRoomsElement) {
        availableRoomsElement.textContent = availableRooms;
    }

    if (occupiedRoomsElement) {
        occupiedRoomsElement.textContent = occupiedRooms;
    }

    if (occupancyRateElement) {
        occupancyRateElement.textContent = occupancyRate + "%";
    }
}
// =====================================================
// OWNER PROFILE & SETTINGS
// =====================================================

const OWNER_PROFILE_API = "/api/owner/profile";

// Load the owner's profile from the backend
async function loadOwnerProfile() {
    const token = localStorage.getItem("stayFinderToken");

    if (!token) {
        return;
    }

    const messageElement = document.getElementById(
        "ownerProfileMessage"
    );

    try {
        const response = await fetch(OWNER_PROFILE_API, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Unable to load profile."
            );
        }

        const user = data.user;

        // Display saved profile details
        document.getElementById("profileOwnerName").textContent =
            user.name || "Owner";

        document.getElementById("profileOwnerEmail").textContent =
            user.email || "Not available";

        document.getElementById("profileOwnerPhone").textContent =
            user.phone || "Not available";

        // Fill the editable form
        document.getElementById("editOwnerName").value =
            user.name || "";

        document.getElementById("editOwnerEmail").value =
            user.email || "";

        document.getElementById("editOwnerPhone").value =
            user.phone || "";

    } catch (error) {
        console.error("Profile loading error:", error);

        if (messageElement) {
            messageElement.textContent = error.message;
        }
    }
}


// Save updated owner details
async function updateOwnerProfile(event) {
    event.preventDefault();

    const token = localStorage.getItem("stayFinderToken");

    if (!token) {
        return;
    }

    const name = document.getElementById("editOwnerName").value.trim();
    const email = document.getElementById("editOwnerEmail").value.trim();
    const phone = document.getElementById("editOwnerPhone").value.trim();

    const messageElement = document.getElementById(
        "ownerProfileMessage"
    );

    const saveButton = document.getElementById(
        "saveOwnerProfileBtn"
    );

    messageElement.textContent = "";

    saveButton.disabled = true;
    saveButton.textContent = "Saving...";

    try {
        const response = await fetch(OWNER_PROFILE_API, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                name,
                email,
                phone
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Unable to update profile."
            );
        }

        const user = data.user;

        // Update the displayed profile details
        document.getElementById("profileOwnerName").textContent =
            user.name;

        document.getElementById("profileOwnerEmail").textContent =
            user.email;

        document.getElementById("profileOwnerPhone").textContent =
            user.phone;

        // Keep the form synchronised with the saved data
        document.getElementById("editOwnerName").value =
            user.name;

        document.getElementById("editOwnerEmail").value =
            user.email;

        document.getElementById("editOwnerPhone").value =
            user.phone;

        messageElement.textContent =
            data.message || "Profile updated successfully.";

        // Close the edit form after a successful save
const editContainer = document.getElementById(
    "ownerProfileEditContainer"
);

const editButton = document.getElementById(
    "editOwnerProfileBtn"
);

if (editContainer) {
    editContainer.hidden = true;
}

if (editButton) {
    editButton.textContent = "Edit Profile"
    ;
}

    } catch (error) {
        console.error("Profile update error:", error);

        messageElement.textContent = error.message;

    } finally {
        saveButton.disabled = false;
        saveButton.textContent = "Save Changes";
    }
}


// Connect the profile form after the page loads
document.addEventListener("DOMContentLoaded", () => {
    loadOwnerProfile();

    const profileForm = document.getElementById(
        "ownerProfileForm"
    );

    const editButton = document.getElementById(
        "editOwnerProfileBtn"
    );

    const editContainer = document.getElementById(
        "ownerProfileEditContainer"
    );

    if (profileForm) {
        profileForm.addEventListener(
            "submit",
            updateOwnerProfile
        );
    }

    if (editButton && editContainer) {
        editButton.addEventListener("click", () => {
            editContainer.hidden = !editContainer.hidden;

            editButton.textContent = editContainer.hidden
                ? "Edit Profile"
                : "Cancel Editing";
        });
    }
});

// =====================================================
// CHANGE OWNER PASSWORD
// =====================================================

async function handleChangePassword(event) {
    event.preventDefault();

    const token = localStorage.getItem("stayFinderToken");

    const currentPassword =
        document.getElementById("currentPassword").value;

    const newPassword =
        document.getElementById("newPassword").value;

    const confirmPassword =
        document.getElementById("confirmNewPassword").value;

    const messageElement =
        document.getElementById("changePasswordMessage");

    const button =
    document.getElementById("saveNewPasswordBtn");

    messageElement.textContent = "";

    if (!token) {
        messageElement.textContent =
            "Please log in again to change your password.";
        return;
    }

    if (newPassword.length < 8) {
        messageElement.textContent =
            "Your new password must contain at least 8 characters.";
        return;
    }

    if (newPassword !== confirmPassword) {
        messageElement.textContent =
            "New passwords do not match.";
        return;
    }

    button.disabled = true;
    button.textContent = "Updating...";

    try {
        const response = await fetch("/api/auth/change-password", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                currentPassword,
                newPassword,
                confirmPassword
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Unable to change password."
            );
        }

        // Show success message
        messageElement.textContent =
            data.message || "Password changed successfully.";

        // Clear all three password fields
        document.getElementById("currentPassword").value = "";
        document.getElementById("newPassword").value = "";
        document.getElementById("confirmNewPassword").value = "";
        document.getElementById("changePasswordContainer").hidden = true;
document.getElementById("togglePasswordFormBtn").textContent = "Change Password";

    } catch (error) {
        console.error("Change password error:", error);

        messageElement.textContent = error.message;

    } finally {
        button.disabled = false;
            button.textContent = "Save New Password";

    }
}

function setupPasswordForm() {
const toggleButton = document.getElementById("togglePasswordFormBtn");
const cancelButton = document.getElementById("cancelPasswordFormBtn");
const passwordContainer = document.getElementById("changePasswordContainer");
const passwordForm = document.getElementById("changePasswordForm");


if (!toggleButton || !passwordContainer) {
    console.error("Change Password button or container was not found.");
    return;
}

toggleButton.addEventListener("click", function () {
    passwordContainer.hidden = !passwordContainer.hidden;

    toggleButton.textContent = passwordContainer.hidden
        ? "Change Password"
        : "Cancel Editing";
});

if (cancelButton && passwordForm) {
    cancelButton.addEventListener("click", function () {
        passwordContainer.hidden = true;
        passwordForm.reset();

        document.getElementById("changePasswordMessage").textContent = "";
        toggleButton.textContent = "Change Password";
    });
}

if (passwordForm) {
    passwordForm.addEventListener("submit", handleChangePassword);
}


}

if (document.readyState === "loading") {
document.addEventListener("DOMContentLoaded", setupPasswordForm);
} else {
setupPasswordForm();
}

// =====================================================
// OWNER NOTIFICATIONS
// =====================================================

const NOTIFICATIONS_API = "/api/notifications";

// Load notifications from the backend
async function loadOwnerNotifications() {
    const token = localStorage.getItem("stayFinderToken");

    const countElement = document.getElementById(
        "ownerNotificationCount"
    );

    const listElement = document.getElementById(
        "ownerNotificationList"
    );

    if (!countElement || !listElement) {
        return;
    }

    if (!token) {
        listElement.textContent = "Please log in to view notifications.";
        return;
    }

    try {
        const response = await fetch(NOTIFICATIONS_API, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(
                data.message || "Unable to load notifications."
            );
        }

        // Update unread notification count
        const unreadCount = Number(data.unreadCount) || 0;

        countElement.textContent = unreadCount;
        countElement.hidden = unreadCount === 0;

        // Display notification list
        listElement.replaceChildren();

        if (!data.notifications || data.notifications.length === 0) {
            const emptyMessage = document.createElement("p");
            emptyMessage.textContent = "No notifications yet.";
            listElement.appendChild(emptyMessage);
            return;
        }

        data.notifications.forEach(function (notification) {
            const item = document.createElement("div");
            item.className = "notification-item";

            if (!notification.isRead) {
                item.classList.add("unread");
            }

            const title = document.createElement("strong");
            title.textContent = notification.title;

            const message = document.createElement("p");
            message.textContent = notification.message;

            const date = document.createElement("small");
            date.textContent = notification.createdAt
                ? new Date(notification.createdAt).toLocaleString("en-IN")
                : "";

            item.append(title, message, date);

            if (!notification.isRead) {
                const readButton = document.createElement("button");
                readButton.type = "button";
                readButton.textContent = "Mark as read";

                readButton.addEventListener("click", async function () {
                    await markNotificationAsRead(notification._id);
                });

                item.appendChild(readButton);
            }

            listElement.appendChild(item);
        });
    } catch (error) {
        console.error("Notification loading error:", error);
        listElement.textContent = "Unable to load notifications.";
    }
}

// Mark one notification as read
async function markNotificationAsRead(notificationId) {
    const token = localStorage.getItem("stayFinderToken");

    if (!token) {
        return;
    }

    try {
        const response = await fetch(
            `${NOTIFICATIONS_API}/${notificationId}/read`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(
                data.message || "Unable to mark notification as read."
            );
        }

        await loadOwnerNotifications();
    } catch (error) {
        console.error("Mark notification as read error:", error);
        alert(error.message || "Unable to update notification.");
    }
}

// Mark all notifications as read
async function markAllOwnerNotificationsAsRead() {
    const token = localStorage.getItem("stayFinderToken");

    if (!token) {
        return;
    }

    try {
        const response = await fetch(
            `${NOTIFICATIONS_API}/read-all`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(
                data.message || "Unable to mark notifications as read."
            );
        }

        await loadOwnerNotifications();
    } catch (error) {
        console.error("Mark all notifications as read error:", error);
        alert(error.message || "Unable to update notifications.");
    }
}

// Connect the notification bell and buttons
document.addEventListener("DOMContentLoaded", function () {
    const notificationButton = document.getElementById(
        "ownerNotificationButton"
    );

    const notificationPanel = document.getElementById(
        "ownerNotificationPanel"
    );

    const markAllButton = document.getElementById(
        "markAllNotificationsRead"
    );

    
if (notificationButton && notificationPanel) {
    // Open or close the panel when the bell is clicked
    notificationButton.addEventListener("click", function () {
        const isOpening = notificationPanel.hidden;

        notificationPanel.hidden = !isOpening;

        notificationButton.setAttribute(
            "aria-expanded",
            String(isOpening)
        );

        if (isOpening) {
            loadOwnerNotifications();
        }
    });

    // Close the panel when clicking anywhere outside it
    document.addEventListener("click", function (event) {
        const notificationWrapper = notificationButton.closest(
            ".notification-wrapper"
        );

        if (
            !notificationWrapper ||
            !notificationWrapper.contains(event.target)
        ) {
            notificationPanel.hidden = true;

            notificationButton.setAttribute(
                "aria-expanded",
                "false"
            );
        }
    });

    // Close the panel when Escape is pressed
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && !notificationPanel.hidden) {
            notificationPanel.hidden = true;

            notificationButton.setAttribute(
                "aria-expanded",
                "false"
            );

            notificationButton.focus();
        }
    });
}



    if (markAllButton) {
        markAllButton.addEventListener(
            "click",
            markAllOwnerNotificationsAsRead
        );
    }

    // Load the unread count when the dashboard opens
    loadOwnerNotifications();

    // Refresh the count periodically while the dashboard is open
    setInterval(loadOwnerNotifications, 30000);
});
// =====================================================
// HOSTEL VERIFICATION - OWNER DASHBOARD
// =====================================================

document.addEventListener("DOMContentLoaded", function () {
    const verificationForm = document.getElementById(
        "verificationDocumentForm"
    );

   

    

    

    

    const uploadMessage = document.getElementById(
        "verificationUploadMessage"
    );

    const uploadButton = document.getElementById(
        "uploadVerificationButton"
    );

    const documentsInput = document.getElementById(
        "verificationDocuments"
    );

  


    // Upload verification documents.
    if (verificationForm) {
        verificationForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const token = localStorage.getItem("stayFinderToken");

            if (!token) {
                if (uploadMessage) {
                    uploadMessage.textContent =
                        "Please log in before uploading documents.";
                }
                return;
            }

            if (!currentHostel || !currentHostel._id) {
                if (uploadMessage) {
                    uploadMessage.textContent =
                        "Your hostel information has not loaded yet. Please refresh the page and try again.";
                }
                return;
            }

            const documentType = document.getElementById(
                "documentType"
            ).value;

            const files = documentsInput.files;

            if (!documentType) {
                uploadMessage.textContent =
                    "Please select a document type.";
                return;
            }

            if (!files || files.length === 0) {
                uploadMessage.textContent =
                    "Please select at least one document.";
                return;
            }

            if (files.length > 5) {
                uploadMessage.textContent =
                    "You can upload a maximum of 5 documents per submission.";
                return;
            }

            const allowedTypes = [
                "application/pdf",
                "image/jpeg",
                "image/png"
            ];

            for (const file of files) {
                if (!allowedTypes.includes(file.type)) {
                    uploadMessage.textContent =
                        "Only PDF, JPG, JPEG and PNG files are allowed.";
                    return;
                }

                if (file.size > 5 * 1024 * 1024) {
                    uploadMessage.textContent =
                        `${file.name} exceeds the 5 MB file-size limit.`;
                    return;
                }
            }

            const formData = new FormData();

            formData.append("documentType", documentType);

            for (const file of files) {
                formData.append("documents", file);
            }

            try {
                if (uploadButton) {
                    uploadButton.disabled = true;
                    uploadButton.textContent = "Uploading...";
                }

                uploadMessage.textContent =
                    "Uploading your verification documents...";

                const response = await fetch(
                    `${API_URL}/${currentHostel._id}/verification-documents`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        body: formData
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Unable to upload verification documents."
                    );
                }

                uploadMessage.textContent =
                    data.message ||
                    "Documents uploaded successfully.";

                verificationForm.reset();

                // Reload the hostel to display the latest saved status.
                await loadOwnerHostel();

            } catch (error) {
                console.error(
                    "Verification document upload error:",
                    error
                );

                uploadMessage.textContent =
                    error.message ||
                    "Something went wrong while uploading documents.";
            } finally {
                if (uploadButton) {
                    uploadButton.disabled = false;
                    uploadButton.textContent = "Upload Documents";
                }
            }
        });
    }
});