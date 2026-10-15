console.log("Admin login JavaScript loaded successfully!");
const API_URL = "/api/auth";

const adminLoginForm = document.getElementById("adminLoginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const message = document.getElementById("message");

function showMessage(text, type = "error") {
message.textContent = text;
message.style.color = type === "success" ? "green" : "red";
}

adminLoginForm.addEventListener("submit", async function (event) {
event.preventDefault();


const email = emailInput.value.trim().toLowerCase();
const password = passwordInput.value;

if (!email || !password) {
    showMessage("Please enter your admin email and password.");
    return;
}

loginButton.disabled = true;
loginButton.textContent = "Logging in...";
showMessage("Verifying admin credentials...", "success");

try {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            role: "admin",
            email: email,
            password: password
        })
    });

    const data = await response.json();

    if (!response.ok) {
        showMessage(data.message || "Admin login failed.");
        return;
    }

    // Never allow student or owner accounts into the admin panel.
    if (!data.user || data.user.role !== "admin") {
        showMessage("Access denied. This account is not an administrator.");
        return;
    }

    // Save the existing authentication format.
    if (data.token) {
        localStorage.setItem("stayFinderToken", data.token);
    }

    localStorage.setItem(
        "stayFinderUser",
        JSON.stringify(data.user)
    );

    showMessage("Admin login successful. Redirecting...", "success");

    setTimeout(function () {
        window.location.href = "admin-dashboard.html";
    }, 700);

} catch (error) {
    console.error("Admin login error:", error);
    showMessage(
        "Cannot connect to the server. Please check that the backend is running."
    );

} finally {
    loginButton.disabled = false;
    loginButton.textContent = "Login as Admin";
}


});
