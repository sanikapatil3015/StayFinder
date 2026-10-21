const nodemailer = require("nodemailer");

const requiredEnv = [
"SMTP_HOST",
"SMTP_PORT",
"SMTP_USER",
"SMTP_PASS",
"EMAIL_FROM"
];

const missingEnv = requiredEnv.filter(
(key) => !process.env[key]?.trim()
);

if (missingEnv.length > 0) {
throw new Error(
`Email configuration missing: ${missingEnv.join(", ")}`
);
}

const smtpPort = Number(process.env.SMTP_PORT);

if (!Number.isInteger(smtpPort) || smtpPort <= 0) {
throw new Error("SMTP_PORT must be a valid port number.");
}

const transporter = nodemailer.createTransport({
host: process.env.SMTP_HOST,
port: smtpPort,
secure: smtpPort === 465,
auth: {
user: process.env.SMTP_USER,
pass: process.env.SMTP_PASS
},
connectionTimeout: 10000,
greetingTimeout: 10000,
socketTimeout: 20000
});

async function sendPasswordResetEmail(email, resetLink) {
if (!email || !resetLink) {
throw new Error("Recipient email and reset link are required.");
}


return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Reset Your Stay Finder Password",
    text: `You requested to reset your Stay Finder password.


Use this link to reset your password:

${resetLink}

This link expires in 15 minutes.

If you did not request this, you can ignore this email.`
});
}

module.exports = { sendPasswordResetEmail };
