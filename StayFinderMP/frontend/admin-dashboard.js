const API_URL = "https://stay-finder-backend-t2ch.onrender.com/api/hostels";

const token = localStorage.getItem("stayFinderToken");


const applicationsContainer = document.getElementById("applications");
const pendingCount = document.getElementById("pendingCount");
const message = document.getElementById("message");
const refreshButton = document.getElementById("refreshButton");
const logoutButton = document.getElementById("logoutButton");

function getSavedUser() {
    try {
        return JSON.parse(localStorage.getItem("stayFinderUser"));
    } catch {
        return null;
    }
}

const savedUser = getSavedUser();

function showMessage(text, type = "info") {
    message.textContent = text;

    message.style.color =
        type === "error" ? "#b91c1c" :
        type === "success" ? "#15803d" :
        "#475569";
}

function logout() {
    localStorage.removeItem("stayFinderToken");
    localStorage.removeItem("stayFinderUser");

    window.location.replace("admin-login.html");
}

logoutButton.addEventListener("click", logout);

if (!token || !savedUser || savedUser.role !== "admin") {
    logout();
} else {
    refreshButton.addEventListener("click", loadPendingHostels);

    loadPendingHostels();
}

async function apiRequest(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${token}`
        }
    });

    const data = await response.json().catch(() => ({}));

    if (response.status === 401 || response.status === 403) {
        throw new Error(
            data.message || "Your session is invalid or access is denied."
        );
    }

    if (!response.ok) {
        throw new Error(
            data.message || `Request failed with status ${response.status}.`
        );
    }

    return data;
}

async function loadPendingHostels() {
    refreshButton.disabled = true;
    applicationsContainer.replaceChildren();
    pendingCount.textContent = "—";

    showMessage("Loading pending applications...");

    try {
        const data = await apiRequest(`${API_URL}/admin/pending`);

        if (!data.success || !Array.isArray(data.hostels)) {
            throw new Error("The server returned an unexpected response.");
        }

        pendingCount.textContent = data.hostels.length;

        if (data.hostels.length === 0) {
            showMessage("There are no pending hostel applications.", "success");

            const emptyState = document.createElement("div");
            emptyState.className = "empty-state";
            emptyState.textContent = "All caught up! No pending applications.";
            applicationsContainer.appendChild(emptyState);

            return;
        }

        showMessage("Pending applications loaded successfully.", "success");

        data.hostels.forEach(hostel => {
            applicationsContainer.appendChild(createHostelCard(hostel));
        });

    } catch (error) {
        console.error("Loading pending hostels failed:", error);
        showMessage(error.message || "Unable to load applications.", "error");

        if (/session|access denied|authorization|token/i.test(error.message)) {
            logout();
        }
    } finally {
        refreshButton.disabled = false;
    }
}

function createDetail(label, value) {
    const detail = document.createElement("div");
    detail.className = "detail";

    const title = document.createElement("strong");
    title.textContent = label;

    const content = document.createElement("span");

    if (Array.isArray(value)) {
        content.textContent = value.length ? value.join(", ") : "Not provided";
    } else {
        content.textContent =
            value !== undefined && value !== null && value !== ""
                ? String(value)
                : "Not provided";
    }

    detail.append(title, content);

    return detail;
}

function createHostelCard(hostel) {
    const card = document.createElement("article");
    card.className = "hostel-card";

    const title = document.createElement("h3");
    title.textContent = hostel.name || "Unnamed Hostel";

    const details = document.createElement("div");
    details.className = "hostel-details";

    const owner = hostel.owner || {};

    details.append(
        createDetail("Location", hostel.location),
        createDetail("Monthly Rent", hostel.rent === undefined ? "" : `₹${hostel.rent}`),
        createDetail("Security Deposit", hostel.securityDeposit === undefined ? "" : `₹${hostel.securityDeposit}`),
        createDetail("Total Rooms", hostel.totalRooms),
        createDetail("Available Rooms", hostel.availableRooms),
        createDetail("Facilities", hostel.facilities),
        createDetail("Owner Name", owner.name),
        createDetail("Owner Email", owner.email),
        createDetail("Owner Phone", owner.phone),
        createDetail("Submitted On", hostel.createdAt
            ? new Date(hostel.createdAt).toLocaleString()
            : "Not provided")
    );

    const documentsSection = document.createElement("div");
    documentsSection.className = "documents";

    const documentsTitle = document.createElement("h4");
    documentsTitle.textContent = "Verification Documents";

    documentsSection.appendChild(documentsTitle);

    const documents = Array.isArray(hostel.verificationDocuments)
        ? hostel.verificationDocuments
        : [];

    if (documents.length === 0) {
        const noDocuments = document.createElement("p");
        noDocuments.textContent = "No verification documents were found.";
        documentsSection.appendChild(noDocuments);
    } else {
        documents.forEach(documentItem => {
            const downloadButton = document.createElement("button");
            downloadButton.type = "button";
            downloadButton.className = "refresh-button";

            downloadButton.textContent =
                `Download ${documentItem.documentType || "Document"}: ` +
                `${documentItem.originalName || "file"}`;

            downloadButton.style.margin = "5px";
            downloadButton.addEventListener("click", async () => {
                await downloadDocument(hostel._id, documentItem, downloadButton);
            });

            documentsSection.appendChild(downloadButton);
        });
    }

    const actions = document.createElement("div");
    actions.className = "actions";

    const approveButton = document.createElement("button");
    approveButton.className = "approve-button";
    approveButton.textContent = "Approve Hostel";

    approveButton.addEventListener("click", async () => {
        const confirmed = window.confirm(
            `Approve "${hostel.name || "this hostel"}"?`
        );

        if (confirmed) {
            await reviewHostel(hostel._id, "Verified", "", actions);
        }
    });

    const rejectButton = document.createElement("button");
    rejectButton.className = "reject-button";
    rejectButton.textContent = "Reject Hostel";

    rejectButton.addEventListener("click", async () => {
        const reason = window.prompt(
            "Enter the reason for rejecting this hostel:"
        );

        if (reason === null) {
            return;
        }

        if (!reason.trim()) {
            window.alert("A rejection reason is required.");
            return;
        }

        await reviewHostel(hostel._id, "Rejected", reason.trim(), actions);
    });

    actions.append(approveButton, rejectButton);

    card.append(title, details, documentsSection, actions);

    return card;
}

async function downloadDocument(hostelId, documentItem, button) {
    button.disabled = true;

    try {
        const url =
            `${API_URL}/admin/${encodeURIComponent(hostelId)}` +
            `/verification-documents/${encodeURIComponent(documentItem._id)}`;

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            let errorMessage = "Unable to download the document.";

            try {
                const data = await response.json();
                errorMessage = data.message || errorMessage;
            } catch {
                // The response may not contain JSON.
            }

            throw new Error(errorMessage);
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = objectUrl;
        link.download = documentItem.originalName || "verification-document";

        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);

    } catch (error) {
        console.error("Document download failed:", error);
        window.alert(error.message || "Unable to download the document.");
    } finally {
        button.disabled = false;
    }
}

async function reviewHostel(hostelId, verificationStatus, rejectionReason, actions) {
    const buttons = actions.querySelectorAll("button");
    buttons.forEach(button => button.disabled = true);

    showMessage(
        verificationStatus === "Verified"
            ? "Approving hostel..."
            : "Rejecting hostel..."
    );

    try {
        const data = await apiRequest(
            `${API_URL}/admin/${encodeURIComponent(hostelId)}/review`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    verificationStatus,
                    rejectionReason
                })
            }
        );

        showMessage(data.message || "Review completed successfully.", "success");

        await loadPendingHostels();

    } catch (error) {
        console.error("Hostel review failed:", error);
        showMessage(error.message || "Unable to review this hostel.", "error");

        buttons.forEach(button => button.disabled = false);

        if (/session|access denied|authorization|token/i.test(error.message)) {
            logout();
        }
    }
}