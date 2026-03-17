require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middleware
app.use(express.json());

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

// ✅ Health check
app.get("/", (req, res) => {
  res.send("Kontora backend running 🚀");
});

// ✅ SMTP (GMAIL or your mail server)
const transporter = nodemailer.createTransport({
  service: "gmail", // 🔥 easiest
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // app password
  }
});

// ✅ Feedback route
app.post("/feedback", async (req, res) => {
  const { message, version, userAgent } = req.body;

  if (!message) {
    return res.status(400).json({ success: false });
  }

  console.log("📩 Incoming feedback:", message);

  try {
    await transporter.sendMail({
      from: `"Kontora Feedback" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "📩 New Kontora Feedback",
      text: `
New Feedback:

${message}

App Version: ${version}
User: ${userAgent}
      `
    });

    console.log("✅ Email sent");

    return res.json({ success: true });

  } catch (err) {
    console.error("❌ Email failed:", err);

    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});