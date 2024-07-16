const express = require("express");
const router = express.Router();
const http = require("http");
const nodemailer = require("nodemailer");
const keys = require("../config/keys");

// Dummy storage for OTPs (for demonstration, replace with a secure storage solution in production)
let otpStorage = {};

// Send OTP to user's email
router.post("/send-otp", (req, res) => {
  const { email } = req.body;

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save OTP in memory (for demo purposes, replace with a secure storage solution)
  otpStorage[email] = otp;

  // Send OTP via email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
      user: keys.email.user,
      pass: keys.email.pass,
    },
  });

  const mailOptions = {
    from: keys.email.email2,
    to: email,
    subject: "OTP for Verification",
    text: `Your OTP for registration is ${otp}. It is valid for 2 minutes.`,
  };
  console.log(mailOptions);

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to send OTP" });
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).json({ message: "OTP sent successfully" });
    }
  });
});

// Verify OTP
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  // Retrieve OTP from storage
  const storedOTP = otpStorage[email];

  // Check if OTP matches
  if (otp && storedOTP && otp === storedOTP) {
    // Clear OTP from storage after successful verification
    delete otpStorage[email];
    res.status(200).json({ message: "OTP verified successfully" });
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
});

module.exports = router;
