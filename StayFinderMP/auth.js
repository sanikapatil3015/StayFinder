/* =====================================================
   STAY FINDER AUTHENTICATION
===================================================== */


/* CURRENT AUTH STATE */

let currentRole = "student";
let currentMode = "register";


/* =====================================================
   OPEN AUTH
===================================================== */

function openAuth(mode = "register") {

    currentMode = mode;

    document
        .getElementById("authModal")
        .classList.add("show");

    selectRole("student");

    switchAuthMode(mode);

    clearMessage();
}


/* =====================================================
   CLOSE AUTH
===================================================== */

function closeAuth() {

    document
        .getElementById("authModal")
        .classList.remove("show");

    document
        .getElementById("authForm")
        .reset();

    clearMessage();
}


/* =====================================================
   SELECT STUDENT / OWNER
===================================================== */

function selectRole(role) {

    currentRole = role;

    const studentButton =
        document.getElementById("studentRoleBtn");

    const ownerButton =
        document.getElementById("ownerRoleBtn");


    if (role === "student") {

        studentButton.classList.add("active");

        ownerButton.classList.remove("active");

        document
            .querySelectorAll(".owner-only")
            .forEach(function(element) {

                element.style.display = "none";

            });

    }


    else {

        ownerButton.classList.add("active");

        studentButton.classList.remove("active");

        document
            .querySelectorAll(".owner-only")
            .forEach(function(element) {

                element.style.display = "block";

            });

    }


    updateSubmitButton();

    clearMessage();
}


/* =====================================================
   LOGIN / REGISTER MODE
===================================================== */

function switchAuthMode(mode) {

    currentMode = mode;

    const loginButton =
        document.getElementById("loginModeBtn");

    const registerButton =
        document.getElementById("registerModeBtn");

    const nameGroup =
        document.getElementById("nameGroup");

    const phoneGroup =
        document.getElementById("phoneGroup");

    const collegeGroup =
        document.getElementById("collegeGroup");

    const confirmGroup =
        document.getElementById("confirmPasswordGroup");

    const propertyGroup =
        document.getElementById("propertyGroup");

    const locationGroup =
        document.getElementById("locationGroup");

    const aadhaarGroup =
        document.getElementById("aadhaarGroup");


    if (mode === "login") {

        loginButton.classList.add("active");

        registerButton.classList.remove("active");

        nameGroup.style.display = "none";

        phoneGroup.style.display = "none";

        collegeGroup.style.display = "none";

        confirmGroup.style.display = "none";

        propertyGroup.style.display = "none";

        locationGroup.style.display = "none";

        aadhaarGroup.style.display = "none";

        document.getElementById("authTitle").textContent =
            "Welcome Back!";

        document.getElementById("authSubtitle").textContent =
            "Login to your Stay Finder account.";

        document.getElementById("switchText").textContent =
            "Don't have an account?";

        document.getElementById("switchButton").textContent =
            "Register";

    }


    else {

        loginButton.classList.remove("active");

        registerButton.classList.add("active");

        nameGroup.style.display = "block";

        phoneGroup.style.display = "block";

        collegeGroup.style.display =
            currentRole === "student" ? "block" : "none";

        confirmGroup.style.display = "block";

        propertyGroup.style.display =
            currentRole === "owner" ? "block" : "none";

        locationGroup.style.display =
            currentRole === "owner" ? "block" : "none";

        aadhaarGroup.style.display =
            currentRole === "owner" ? "block" : "none";

        document.getElementById("authTitle").textContent =
            "Create Account";

        document.getElementById("authSubtitle").textContent =
            "Join Stay Finder today.";

        document.getElementById("switchText").textContent =
            "Already have an account?";

        document.getElementById("switchButton").textContent =
            "Login";

    }


    updateSubmitButton();

    clearMessage();
}


/* =====================================================
   UPDATE SUBMIT BUTTON
===================================================== */

function updateSubmitButton() {

    const button =
        document.getElementById("authSubmit");


    if (currentMode === "login") {

        button.textContent =
            currentRole === "student"
                ? "Login as Student"
                : "Login as Owner";

    }

    else {

        button.textContent =
            currentRole === "student"
                ? "Register as Student"
                : "Register as Owner";

    }
}


/* =====================================================
   FORM SUBMIT
===================================================== */

document
    .getElementById("authForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        if (currentMode === "register") {

            registerUser();

        }

        else {

            loginUser();

        }

    });


/* =====================================================
   REGISTER USER
===================================================== */

function registerUser() {

    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim().toLowerCase();

    const phone =
        document.getElementById("phone").value.trim();

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;


    /* BASIC VALIDATION */

    if (!name || !email || !phone || !password) {

        showMessage(
            "Please fill in all required fields.",
            "error"
        );

        return;
    }


    /* PASSWORD */

  /* STRONG PASSWORD VALIDATION */

if (password.length < 8) {
    showMessage(
        "Password must be at least 8 characters long.",
        "error"
    );
    return;
}

if (!/[A-Z]/.test(password)) {
    showMessage(
        "Password must contain at least one uppercase letter.",
        "error"
    );
    return;
}

if (!/[a-z]/.test(password)) {
    showMessage(
        "Password must contain at least one lowercase letter.",
        "error"
    );
    return;
}

if (!/[0-9]/.test(password)) {
    showMessage(
        "Password must contain at least one number.",
        "error"
    );
    return;
}

if (!/[@$!%*?&#]/.test(password)) {
    showMessage(
        "Password must contain at least one special character.",
        "error"
    );
    return;
}


    if (password !== confirmPassword) {

        showMessage(
            "Passwords do not match.",
            "error"
        );

        return;
    }


    /* PHONE */

    if (!/^[0-9]{10}$/.test(phone)) {

        showMessage(
            "Please enter a valid 10-digit phone number.",
            "error"
        );

        return;
    }


    /* STUDENT */

    if (currentRole === "student") {

        registerStudent(
            name,
            email,
            phone,
            password
        );

    }


    /* OWNER */

    else {

        registerOwner(
            name,
            email,
            phone,
            password
        );

    }

}


/* =====================================================
   REGISTER STUDENT
===================================================== */

function registerStudent(
    name,
    email,
    phone,
    password
) {

    const college =
        document.getElementById("college").value.trim();


    if (!college) {

        showMessage(
            "Please enter your college name.",
            "error"
        );

        return;
    }


    const existingUser =
        localStorage.getItem("student_" + email);


    if (existingUser) {

        showMessage(
            "A student account with this email already exists.",
            "error"
        );

        return;
    }


    const student = {

        role: "student",

        name: name,

        email: email,

        phone: phone,

        password: password,

        college: college

    };


    localStorage.setItem(
        "student_" + email,
        JSON.stringify(student)
    );


    localStorage.setItem(
        "loggedInUser",
        JSON.stringify(student)
    );


    showMessage(
        "Registration successful! Redirecting...",
        "success"
    );


    setTimeout(function() {

        window.location.href = "student.html";

    }, 800);
}


/* =====================================================
   REGISTER OWNER
===================================================== */

function registerOwner(
    name,
    email,
    phone,
    password
) {

    const propertyName =
        document
            .getElementById("propertyName")
            .value
            .trim();

    const propertyLocation =
        document
            .getElementById("propertyLocation")
            .value
            .trim();

    const aadhaar =
        document
            .getElementById("aadhaar")
            .value
            .trim();


    if (!propertyName || !propertyLocation || !aadhaar) {

        showMessage(
            "Please fill in all owner details.",
            "error"
        );

        return;
    }


    if (!/^[0-9]{4}$/.test(aadhaar)) {

    showMessage(
        "Please enter the last 4 digits of your Aadhaar number.",
        "error"
    );

    return;
}


    const existingUser =
        localStorage.getItem("owner_" + email);


    if (existingUser) {

        showMessage(
            "An owner account with this email already exists.",
            "error"
        );

        return;
    }


    const owner = {

        role: "owner",

        name: name,

        email: email,

        phone: phone,

        password: password,

        propertyName: propertyName,

        propertyLocation: propertyLocation,

        aadhaar: aadhaar

    };


    localStorage.setItem(
        "owner_" + email,
        JSON.stringify(owner)
    );


    localStorage.setItem(
        "loggedInUser",
        JSON.stringify(owner)
    );


    showMessage(
        "Owner registration successful! Redirecting...",
        "success"
    );


    setTimeout(function() {

        window.location.href = "owner.html";

    }, 800);
}


/* =====================================================
   LOGIN
===================================================== */

function loginUser() {

    const email =
        document
            .getElementById("email")
            .value
            .trim()
            .toLowerCase();

    const password =
        document.getElementById("password").value;


    if (!email || !password) {

        showMessage(
            "Please enter email and password.",
            "error"
        );

        return;
    }


    const storageKey =
        currentRole + "_" + email;


    const savedUser =
        localStorage.getItem(storageKey);


    if (!savedUser) {

        showMessage(
            "No account found. Please register first.",
            "error"
        );

        return;
    }


    const user =
        JSON.parse(savedUser);


    if (user.password !== password) {

        showMessage(
            "Incorrect password.",
            "error"
        );

        return;
    }


    localStorage.setItem(
        "loggedInUser",
        JSON.stringify(user)
    );


    showMessage(
        "Login successful! Redirecting...",
        "success"
    );


    setTimeout(function() {

        if (user.role === "student") {

            window.location.href =
                "student.html";

        }

        else {

            window.location.href =
                "owner.html";

        }

    }, 700);
}


/* =====================================================
   MESSAGE
===================================================== */

function showMessage(message, type) {

    const messageBox =
        document.getElementById("authMessage");

    messageBox.textContent = message;

    messageBox.className =
        "auth-message " + type;
}


function clearMessage() {

    const messageBox =
        document.getElementById("authMessage");

    messageBox.textContent = "";

    messageBox.className =
        "auth-message";
}


/* =====================================================
   FOOTER OWNER REGISTER
===================================================== */

function openOwnerRegister(event) {

    event.preventDefault();

    openAuth("register");

    selectRole("owner");
}


/* =====================================================
   FOOTER OWNER LOGIN
===================================================== */

function openOwnerLogin(event) {

    event.preventDefault();

    openAuth("login");

    selectRole("owner");
}


/* =====================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
===================================================== */

document
    .getElementById("authModal")
    .addEventListener("click", function(event) {

        if (event.target === this) {

            closeAuth();

        }

    });
// =====================================================
// PASSWORD VISIBILITY TOGGLE
// =====================================================

function togglePassword(inputId, button) {

    const passwordInput = document.getElementById(inputId);

    if (passwordInput.type === "password") {

        // Show password
        passwordInput.type = "text";

        button.innerHTML = `
            <svg class="eye-icon" viewBox="0 0 24 24" fill="none">
                <path
                    d="M3 3l18 18"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"/>

                <path
                    d="M10.6 10.6a2 2 0 0 0 2.8 2.8"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"/>

                <path
                    d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a18.6 18.6 0 0 1-3.1 3.8"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"/>

                <path
                    d="M6.1 6.1C3.5 8.1 2 12 2 12s3.5 7 10 7c1.4 0 2.7-.3 3.8-.8"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"/>
            </svg>
        `;

        button.setAttribute("aria-label", "Hide password");

    } else {

        // Hide password
        passwordInput.type = "password";

        button.innerHTML = `
            <svg class="eye-icon" viewBox="0 0 24 24" fill="none">
                <path
                    d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"/>

                <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    stroke-width="2"/>
            </svg>
        `;

        button.setAttribute("aria-label", "Show password");
    }
}