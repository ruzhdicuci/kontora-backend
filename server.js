require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");

const app = express();
const PORT = process.env.PORT || 3000;

const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(express.json());

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

// Health check
app.get("/", (req, res) => {
  res.send("Kontora backend running 🚀");
});

// Feedback route
app.post("/feedback", async (req, res) => {
  const { message, version, userAgent } = req.body;

  if (!message) {
    return res.status(400).json({ success: false });
  }

  try {
    await resend.emails.send({
      from: "Kontora <onboarding@resend.dev>",
      to: "ruzhdicuci@gmail.com", // 🔥 your inbox
      subject: "📩 Kontora Feedback",
      text: `
${message}

Version: ${version}
User: ${userAgent}
      `
    });

    return res.json({ success: true });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});