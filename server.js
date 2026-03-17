require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express(); // ✅ MUST COME BEFORE USING app

const PORT = process.env.PORT || 3000;

// ✅ middleware
app.use(express.json());

// ✅ CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));
app.options("/feedback", cors());

// ✅ TEST ROUTE (NOW SAFE)
app.get("/", (req, res) => {
  res.send("Kontora backend running 🚀");
});

// ✅ transporter (your hosting SMTP)
const transporter = nodemailer.createTransport({
  host: "101.hostinglogin.net",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ✅ test SMTP
transporter.verify((err) => {
  if (err) console.error("❌ SMTP ERROR:", err);
  else console.log("✅ SMTP READY");
});

// ✅ route
app.post("/feedback", async (req, res) => {
  const { message, version, userAgent } = req.body;

  if (!message) {
    return res.status(400).json({ success: false });
  }

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
    res.json({ success: true });

  } catch (err) {
    console.error("❌ Email failed:", err);
    res.status(500).json({ success: false });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Running on port ${PORT}`);
});