const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Admin } = require("../models");

const router = express.Router();

router.post("/login", async (req, res) => {
  const email = String(req.body.email || "").toLowerCase().trim();
  const password = String(req.body.password || "");
  if (!email || !password) {
    return res.status(400).json({ message: "Enter your email and password" });
  }
  const admin = await Admin.findOne({ email });
  const ok = admin && (await bcrypt.compare(password, admin.passwordHash));
  if (!ok) {
    return res.status(401).json({ message: "Those details are not recognised" });
  }
  const token = jwt.sign({ id: String(admin._id), email: admin.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return res.json({ token, email: admin.email });
});

router.get("/me", (req, res) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return res.status(401).json({ message: "Sign in required" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ email: payload.email });
  } catch {
    return res.status(401).json({ message: "Sign in required" });
  }
});

module.exports = router;
