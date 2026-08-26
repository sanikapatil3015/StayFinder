// ==========================================
// COLLEGE SEARCH
// ==========================================

function selectCollege(college) {

    document.getElementById("collegeSearch").value = college;

    alert(
        "College selected: " +
        college +
        "\n\nShowing stays near this college."
    );
}


function searchCollege() {

    let college =
        document.getElementById("collegeSearch").value;

    if (college.trim() === "") {

        alert("Please enter your college or location.");

        return;
    }

    alert(
        "Searching stays near:\n" +
        college
    );

    document.getElementById("find-stay")
        .scrollIntoView({
            behavior: "smooth"
        });
}


// ==========================================
// FIND STAY
// ==========================================

function filterStays() {

    let search =
        document.getElementById("findSearch").value;

    if (search.trim() === "") {

        alert("Please enter a college or location.");

        return;
    }

    alert(
        "Finding accommodations near " +
        search
    );
}


// ==========================================
// ADD TO COMPARE
// ==========================================

let compareList = [];


function addToCompare(hostel) {

    if (!compareList.includes(hostel)) {

        compareList.push(hostel);

        alert(
            hostel +
            " added to comparison.\n\n" +
            "Total selected: " +
            compareList.length
        );

    } else {

        alert(
            hostel +
            " is already in comparison."
        );
    }
}


// ==========================================
// LOGIN
// ==========================================

function showPage(page) {

    document.getElementById(page)
        .scrollIntoView({
            behavior: "smooth"
        });
}


// ==========================================
// AUTHENTICATION DEMO
// ==========================================

document.querySelectorAll(".auth-submit")
    .forEach(function(button) {

        button.addEventListener("click", function() {

            if (button.innerText === "Login") {

                alert(
                    "Login functionality will be connected to the backend later."
                );

            } else {

                alert(
                    "Registration functionality will be connected to the backend later."
                );
            }

        });

    });
// ==========================================
// BUDGET RANGE
// ==========================================

function updateBudget() {

    let budget = document.getElementById("budgetRange").value;

    document.getElementById("priceValue").innerText =
        "₹" + Number(budget).toLocaleString("en-IN");

}


// ==========================================
// APPLY FILTERS
// ==========================================

function applyFilters() {

    const cards = document.querySelectorAll(".stay-card");

    const maxBudget =
        Number(document.getElementById("budgetRange").value);

    // Selected room types
    const selectedRooms =
        [...document.querySelectorAll(".room-filter:checked")]
        .map(input => input.value);

    // Selected facilities
    const selectedFacilities =
        [...document.querySelectorAll(".facility-filter:checked")]
        .map(input => input.value);

    // Availability
    const availability =
        document.querySelector(
            'input[name="availability"]:checked'
        )?.value;


    let visibleCount = 0;


    cards.forEach(card => {

        const price =
            Number(card.dataset.price);

        const room =
            card.dataset.room;

        const facilities =
            card.dataset.facilities.split(",");

        const cardAvailability =
            card.dataset.availability;


        // Budget
        const budgetMatch =
            price <= maxBudget;


        // Room
        const roomMatch =
            selectedRooms.length === 0 ||
            selectedRooms.includes(room);


        // Facilities
        const facilityMatch =
            selectedFacilities.length === 0 ||
            selectedFacilities.every(
                facility => facilities.includes(facility)
            );


        // Availability
        const availabilityMatch =
            !availability ||
            cardAvailability === availability;


        // Final result
        if (
            budgetMatch &&
            roomMatch &&
            facilityMatch &&
            availabilityMatch
        ) {

            card.style.display = "block";
            visibleCount++;

        } else {

            card.style.display = "none";

        }

    });


    document.querySelector(
        ".result-header h3"
    ).innerText =
        visibleCount + " Stays Found";
}


// ==========================================
// RESET FILTERS
// ==========================================

function clearFilters() {

    // Budget
    document.getElementById("budgetRange").value = 10000;

    updateBudget();


    // Room
    document
        .querySelectorAll(".room-filter")
        .forEach(input => {
            input.checked = false;
        });


    // Facilities
    document
        .querySelectorAll(".facility-filter")
        .forEach(input => {
            input.checked = false;
        });


    // Availability
    document
        .querySelectorAll(
            'input[name="availability"]'
        )
        .forEach(input => {
            input.checked = false;
        });


    // Show all cards
    document
        .querySelectorAll(".stay-card")
        .forEach(card => {
            card.style.display = "block";
        });


    document.querySelector(
        ".result-header h3"
    ).innerText = "120+ Stays Found";
}

// ==========================================
// STUDENT / OWNER REGISTER SWITCH
// ==========================================

function showRegisterForm(type, button) {

    const studentForm =
        document.getElementById("student-register");

    const ownerForm =
        document.getElementById("owner-register");

    const buttons =
        document.querySelectorAll(".role-btn");

    // Remove active from both buttons
    buttons.forEach(function(btn) {
        btn.classList.remove("active");
    });

    // Add active to clicked button
    button.classList.add("active");

    // Show selected form
    if (type === "student") {

        studentForm.style.display = "block";
        ownerForm.style.display = "none";

    } else {

        studentForm.style.display = "none";
        ownerForm.style.display = "block";

    }
}

// ==========================================
// STUDENT / OWNER LOGIN SWITCH
// ==========================================

function showLoginForm(type, button) {

    const studentForm =
        document.getElementById("student-login");

    const ownerForm =
        document.getElementById("owner-login");

    const buttons =
        document.querySelectorAll(".role-login-btn");

    // Remove active from both buttons
    buttons.forEach(function(btn) {
        btn.classList.remove("active");
    });

    // Activate clicked button
    button.classList.add("active");

    // Show selected login form
    if (type === "student") {

        studentForm.style.display = "block";
        ownerForm.style.display = "none";

    } else {

        studentForm.style.display = "none";
        ownerForm.style.display = "block";

    }
}
/*test */