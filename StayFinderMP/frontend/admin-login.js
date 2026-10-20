console.log("Admin login JavaScript loaded successfully!");
const API_URL = "http://localhost:5000/api/auth";

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

    // Read the response safely
    const data = await response.json().catch(() => ({}));

    // Handle unsuccessful login
    if (!response.ok) {
        throw new Error(data.message || "Admin login failed.");
    }

    // Confirm that the returned account is an admin
    if (!data.user || data.user.role !== "admin") {
        throw new Error("This account does not have admin access.");
    }

    if (!data.token) {
        throw new Error("Login succeeded, but the server did not return a token.");
    }

    // Store the login session
    localStorage.setItem("stayFinderToken", data.token);
    localStorage.setItem("stayFinderUser", JSON.stringify(data.user));

    showMessage("Admin login successful. Redirecting...", "success");

    // Navigate to the dashboard in the same frontend folder
    window.location.replace(
        new URL("./admin-dashboard.html", window.location.href).href
    );

} catch (error) {
    console.error("Admin login error:", error);
    showMessage(error.message || "Unable to connect to the server.", "error");
}
 finally {
    loginButton.disabled = false;
    loginButton.textContent = "Login as Admin";
}


});
