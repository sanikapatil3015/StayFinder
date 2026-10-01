/* =====================================================
   STAY FINDER AUTHENTICATION
   BACKEND VERSION
   Node.js + Express + MongoDB
===================================================== */


/* =====================================================
   BACKEND API
===================================================== */

const API_URL = "/api/auth";


/* =====================================================
   CURRENT AUTH STATE
===================================================== */

let currentRole = "student";
let currentMode = "register";


/* =====================================================
   SAVE LOGIN INFORMATION
===================================================== */

function saveAuthData(data) {

    if (data.token) {

        localStorage.setItem(
            "stayFinderToken",
            data.token
        );

    }

    if (data.user) {

        localStorage.setItem(
            "stayFinderUser",
            JSON.stringify(data.user)
        );

    }
}


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

        studentButton
            .classList
            .add("active");

        ownerButton
            .classList
            .remove("active");


        document
            .querySelectorAll(".owner-only")
            .forEach(function(element) {

                element.style.display = "none";

            });

    }

    else {

        ownerButton
            .classList
            .add("active");

        studentButton
            .classList
            .remove("active");


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

    const confirmPassword =
        document.getElementById("confirmPassword");

    const propertyGroup =
        document.getElementById("propertyGroup");

    const locationGroup =
        document.getElementById("locationGroup");

    const aadhaarGroup =
        document.getElementById("aadhaarGroup");


    /* =================================================
       LOGIN
    ================================================= */

    if (mode === "login") {

        loginButton
            .classList
            .add("active");

        registerButton
            .classList
            .remove("active");


        nameGroup.style.display = "none";

        phoneGroup.style.display = "none";

        collegeGroup.style.display = "none";

        confirmGroup.style.display = "none";

        /* IMPORTANT:
           Hidden confirm password must not be required
        */

        confirmPassword.required = false;


        propertyGroup.style.display = "none";

        locationGroup.style.display = "none";

        aadhaarGroup.style.display = "none";


        document
            .getElementById("authTitle")
            .textContent =
            "Welcome Back!";


        document
            .getElementById("authSubtitle")
            .textContent =
            "Login to your Stay Finder account.";


        document
            .getElementById("switchText")
            .textContent =
            "Don't have an account?";


        document
            .getElementById("switchButton")
            .textContent =
            "Register";

    }


    /* =================================================
       REGISTER
    ================================================= */

    else {

        loginButton
            .classList
            .remove("active");

        registerButton
            .classList
            .add("active");


        nameGroup.style.display = "block";

        phoneGroup.style.display = "block";


        collegeGroup.style.display =
            currentRole === "student"
                ? "block"
                : "none";


        confirmGroup.style.display = "block";

        /* IMPORTANT:
           Confirm password is required during registration
        */

        confirmPassword.required = true;


        propertyGroup.style.display =
            currentRole === "owner"
                ? "block"
                : "none";


        locationGroup.style.display =
            currentRole === "owner"
                ? "block"
                : "none";


        aadhaarGroup.style.display =
            currentRole === "owner"
                ? "block"
                : "none";


        document
            .getElementById("authTitle")
            .textContent =
            "Create Account";


        document
            .getElementById("authSubtitle")
            .textContent =
            "Join Stay Finder today.";


        document
            .getElementById("switchText")
            .textContent =
            "Already have an account?";


        document
            .getElementById("switchButton")
            .textContent =
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
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            if (currentMode === "register") {

                registerUser();

            }

            else {

                loginUser();

            }

        }
    );


/* =====================================================
   REGISTER USER
===================================================== */

function registerUser() {

    const name =
        document
            .getElementById("name")
            .value
            .trim();


    const email =
        document
            .getElementById("email")
            .value
            .trim()
            .toLowerCase();


    const phone =
        document
            .getElementById("phone")
            .value
            .trim();


    const password =
        document
            .getElementById("password")
            .value;


    const confirmPassword =
        document
            .getElementById("confirmPassword")
            .value;


    /* =================================================
       BASIC VALIDATION
    ================================================= */

    if (
        !name ||
        !email ||
        !phone ||
        !password
    ) {

        showMessage(
            "Please fill in all required fields.",
            "error"
        );

        return;
    }


    /* =================================================
       PASSWORD LENGTH
    ================================================= */

    if (password.length < 8) {

        showMessage(
            "Password must be at least 8 characters long.",
            "error"
        );

        return;
    }


    /* =================================================
       UPPERCASE
    ================================================= */

    if (!/[A-Z]/.test(password)) {

        showMessage(
            "Password must contain at least one uppercase letter.",
            "error"
        );

        return;
    }


    /* =================================================
       LOWERCASE
    ================================================= */

    if (!/[a-z]/.test(password)) {

        showMessage(
            "Password must contain at least one lowercase letter.",
            "error"
        );

        return;
    }


    /* =================================================
       NUMBER
    ================================================= */

    if (!/[0-9]/.test(password)) {

        showMessage(
            "Password must contain at least one number.",
            "error"
        );

        return;
    }


    /* =================================================
       SPECIAL CHARACTER
    ================================================= */

    if (!/[@$!%*?&#]/.test(password)) {

        showMessage(
            "Password must contain at least one special character.",
            "error"
        );

        return;
    }


    /* =================================================
       CONFIRM PASSWORD
    ================================================= */

    console.log(
        "Password:",
        JSON.stringify(password)
    );

    console.log(
        "Confirm Password:",
        JSON.stringify(confirmPassword)
    );


    if (password !== confirmPassword) {

        showMessage(
            "Passwords do not match.",
            "error"
        );

        return;
    }


    /* =================================================
       PHONE
    ================================================= */

    if (!/^[0-9]{10}$/.test(phone)) {

        showMessage(
            "Please enter a valid 10-digit phone number.",
            "error"
        );

        return;
    }


    /* =================================================
       STUDENT
    ================================================= */

    if (currentRole === "student") {

        registerStudent(
            name,
            email,
            phone,
            password,
            confirmPassword
        );

    }


    /* =================================================
       OWNER
    ================================================= */

    else {

        registerOwner(
            name,
            email,
            phone,
            password,
            confirmPassword
        );

    }
}


/* =====================================================
   REGISTER STUDENT
===================================================== */

async function registerStudent(
    name,
    email,
    phone,
    password,
    confirmPassword
) {

    const college =
        document
            .getElementById("college")
            .value
            .trim();


    /* =================================================
       COLLEGE VALIDATION
    ================================================= */

    if (!college) {

        showMessage(
            "Please enter your college name.",
            "error"
        );

        return;
    }


    /* =================================================
       SHOW LOADING
    ================================================= */

    showMessage(
        "Creating your student account...",
        "success"
    );


    try {

        /* =================================================
           SEND DATA TO BACKEND
        ================================================= */

        const response =
            await fetch(
                `${API_URL}/register`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        role: "student",

                        name: name,

                        email: email,

                        phone: phone,

                        password: password,

                        confirmPassword:
                            confirmPassword,

                        college: college

                    })

                }
            );


        const data =
            await response.json();


        /* =================================================
           HANDLE ERROR
        ================================================= */

        if (!response.ok) {

            showMessage(
                data.message ||
                "Registration failed.",
                "error"
            );

            return;
        }


        /* =================================================
           SAVE AUTHENTICATION DATA
        ================================================= */

        saveAuthData(data);


        /* =================================================
           SUCCESS
        ================================================= */

        showMessage(
            "Registration successful! Redirecting...",
            "success"
        );


        setTimeout(function() {

            window.location.href =
                "student.html";

        }, 800);

    }


    catch (error) {

        console.error(
            "Student registration error:",
            error
        );


        showMessage(
            "Cannot connect to the server. Please make sure the backend is running.",
            "error"
        );

    }
}


/* =====================================================
   REGISTER OWNER
===================================================== */

async function registerOwner(
    name,
    email,
    phone,
    password,
    confirmPassword
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


    /* =================================================
       OWNER DETAILS VALIDATION
    ================================================= */

    if (
        !propertyName ||
        !propertyLocation ||
        !aadhaar
    ) {

        showMessage(
            "Please fill in all owner details.",
            "error"
        );

        return;
    }


    /* =================================================
       AADHAAR LAST 4 DIGITS
    ================================================= */

    if (!/^[0-9]{4}$/.test(aadhaar)) {

        showMessage(
            "Please enter the last 4 digits of your Aadhaar number.",
            "error"
        );

        return;
    }


    /* =================================================
       SHOW LOADING
    ================================================= */

    showMessage(
        "Creating your owner account...",
        "success"
    );


    try {

        /* =================================================
           SEND DATA TO BACKEND
        ================================================= */

        const response =
            await fetch(
                `${API_URL}/register`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        role: "owner",

                        name: name,

                        email: email,

                        phone: phone,

                        password: password,

                        confirmPassword:
                            confirmPassword,

                        propertyName:
                            propertyName,

                        propertyLocation:
                            propertyLocation,

                        aadhaar:
                            aadhaar

                    })

                }
            );


        const data =
            await response.json();


        /* =================================================
           HANDLE ERROR
        ================================================= */

        if (!response.ok) {

            showMessage(
                data.message ||
                "Registration failed.",
                "error"
            );

            return;
        }


        /* =================================================
           SAVE AUTHENTICATION DATA
        ================================================= */

        saveAuthData(data);


        /* =================================================
           SUCCESS
        ================================================= */

        showMessage(
            "Owner registration successful! Redirecting...",
            "success"
        );


        setTimeout(function() {

            window.location.href =
                "owner.html";

        }, 800);

    }


    catch (error) {

        console.error(
            "Owner registration error:",
            error
        );


        showMessage(
            "Cannot connect to the server. Please make sure the backend is running.",
            "error"
        );

    }
}


/* =====================================================
   LOGIN
===================================================== */

async function loginUser() {

    const email =
        document
            .getElementById("email")
            .value
            .trim()
            .toLowerCase();


    const password =
        document
            .getElementById("password")
            .value;


    /* =================================================
       VALIDATION
    ================================================= */

    if (!email || !password) {

        showMessage(
            "Please enter email and password.",
            "error"
        );

        return;
    }


    /* =================================================
       SHOW LOADING
    ================================================= */

    showMessage(
        "Logging in...",
        "success"
    );


    try {

        /* =================================================
           SEND LOGIN REQUEST
        ================================================= */

        const response =
            await fetch(
                `${API_URL}/login`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        role:
                            currentRole,

                        email:
                            email,

                        password:
                            password

                    })

                }
            );


        const data =
            await response.json();


        /* =================================================
           HANDLE ERROR
        ================================================= */

        if (!response.ok) {

            showMessage(
                data.message ||
                "Login failed.",
                "error"
            );

            return;
        }


        /* =================================================
           SUCCESS
        ================================================= */

        showMessage(
            "Login successful! Redirecting...",
            "success"
        );


        /* =================================================
           SAVE AUTHENTICATION DATA
        ================================================= */

        saveAuthData(data);


        /* =================================================
           ROLE-BASED REDIRECT
        ================================================= */

        setTimeout(function() {

            if (
                data.user.role ===
                "student"
            ) {

                window.location.href =
                    "student.html";

            }

            else {

                window.location.href =
                    "owner.html";

            }

        }, 700);

    }


    catch (error) {

        console.error(
            "Login error:",
            error
        );


        showMessage(
            "Cannot connect to the server. Please make sure the backend is running.",
            "error"
        );

    }
}


/* =====================================================
   MESSAGE
===================================================== */

function showMessage(
    message,
    type
) {

    const messageBox =
        document.getElementById(
            "authMessage"
        );


    messageBox.textContent =
        message;


    messageBox.className =
        "auth-message " +
        type;
}


function clearMessage() {

    const messageBox =
        document.getElementById(
            "authMessage"
        );


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
    .addEventListener(
        "click",
        function(event) {

            if (event.target === this) {

                closeAuth();

            }

        }
    );


/* =====================================================
   PASSWORD VISIBILITY TOGGLE
===================================================== */

function togglePassword(
    inputId,
    button
) {

    const passwordInput =
        document.getElementById(
            inputId
        );


    /* =================================================
       SHOW PASSWORD
    ================================================= */

    if (
        passwordInput.type ===
        "password"
    ) {

        passwordInput.type =
            "text";


        button.innerHTML = `

            <svg
                class="eye-icon"
                viewBox="0 0 24 24"
                fill="none"
            >

                <path
                    d="M3 3l18 18"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                />

                <path
                    d="M10.6 10.6a2 2 0 0 0 2.8 2.8"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                />

                <path
                    d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a18.6 18.6 0 0 1-3.1 3.8"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />

                <path
                    d="M6.1 6.1C3.5 8.1 2 12 2 12s3.5 7 10 7c1.4 0 2.7-.3 3.8-.8"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />

            </svg>

        `;


        button.setAttribute(
            "aria-label",
            "Hide password"
        );

    }


    /* =================================================
       HIDE PASSWORD
    ================================================= */

    else {

        passwordInput.type =
            "password";


        button.innerHTML = `

            <svg
                class="eye-icon"
                viewBox="0 0 24 24"
                fill="none"
            >

                <path
                    d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />

                <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    stroke-width="2"
                />

            </svg>

        `;


        button.setAttribute(
            "aria-label",
            "Show password"
        );

    }

}