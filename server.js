require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middleware
app.use(express.json());

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

// ✅ Health check (VERY IMPORTANT for Render)
app.get("/", (req, res) => {
  res.send("Kontora backend running 🚀");
});

// ✅ Init Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ Feedback route
app.post("/feedback", async (req, res) => {
  const { message, version, userAgent } = req.body;

  if (!message) {
    return res.status(400).json({ success: false });
  }

  console.log("📩 Incoming feedback:", message);

  try {
    await resend.emails.send({
      from: "Kontora <onboarding@resend.dev>", // change later after domain verify
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