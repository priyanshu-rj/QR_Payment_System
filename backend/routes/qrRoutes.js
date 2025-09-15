const express = require("express");
const jwt = require("jsonwebtoken");
const Qr = require("../models/Qr");
const Order = require("../models/Order");
const { extractTokenFromScanned } = require("../utils/qrHelper");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;


router.get("/validate", async (req, res) => {
  try {
    const raw = req.query.token || req.query.q || req.query.data;
    const token = extractTokenFromScanned(raw);
    if (!token) return res.status(400).json({ ok: false, message: "Missing token" });

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return res.status(400).json({ ok: false, message: "Invalid or expired token" });
    }

    const qr = await Qr.findById(decoded.qrId);
    if (!qr) return res.status(404).json({ ok: false, message: "QR not found" });

    if (qr.expireAt && qr.expireAt < new Date()) {
      return res.status(410).json({ ok: false, message: "QR expired" });
    }

    const order = await Order.findById(qr.orderId);
    return res.json({ ok: true, message: "QR valid", order });
  } catch (err) {
    console.error("Error in GET /api/qr/validate:", err.message);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

module.exports = router;
