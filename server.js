require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3000;

// ✅ middleware
app.use(express.json());

// ✅ CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

// ✅ health check
app.get("/", (req, res) => {
  res.send("Kontora backend running 🚀");
});

// ✅ transporter (WITH TIMEOUT 🔥)
const transporter = nodemailer.createTransport({
  host: "101.hostinglogin.net",
  port: 465,          // 🔥 use SSL port
  secure: true,       // 🔥 MUST be true with 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false // 🔥 fixes certificate mismatch
  },
  connectionTimeout: 5000,
  greetingTimeout: 5000,
  socketTimeout: 5000
});

// ✅ route
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

    return res.json({ success: true }); // 🔥 ALWAYS RETURN

  } catch (err) {
    console.error("❌ Email failed:", err);

    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Running on port ${PORT}`);
});