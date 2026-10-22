async function sendPasswordResetEmail(email, resetLink) {
if (!email || !resetLink) {
throw new Error("Recipient email and reset link are required.");
}


const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
    throw new Error("RESEND_API_KEY is missing from environment variables.");
}

const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        from: process.env.EMAIL_FROM || "onboarding@resend.dev",
        to: [email],
        subject: "Reset Your Stay Finder Password",
        text: `You requested to reset your Stay Finder password.


Use this link to reset your password:
${resetLink}

This link expires in 15 minutes.

If you did not request this, you can ignore this email.`
})
});


const result = await response.json().catch(() => ({}));

if (!response.ok) {
    console.error("Resend email error:", result);
    throw new Error(
        result.message || result.error || "Unable to send password-reset email."
    );
}

return result;


}

module.exports = { sendPasswordResetEmail };
