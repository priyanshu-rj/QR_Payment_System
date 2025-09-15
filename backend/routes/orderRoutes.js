const express = require("express");
const Order = require("../models/Order");
const User = require("../models/User");   
const { calcAmount, createQrForOrder } = require("../utils/qrHelper");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { items = [], email = "", simulatePayment = true, expireHours = 24 } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ ok: false, message: "Add at least one item" });
    }

    const amount = calcAmount(items);

    let status = "pending";
    let paidAt = null;
    let remainingBalance = null;

    // ✅ Payment simulation and wallet deduction
    if (simulatePayment && email) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ ok: false, message: "User not found. Please add balance first." });
      }

      if (Number(user.balance) < Number(amount)) {
        return res.status(400).json({ ok: false, message: "Insufficient wallet balance." });
      }

      user.balance = Number(user.balance) - Number(amount);
      await user.save();

      status = "paid";
      paidAt = new Date();
      remainingBalance = user.balance;
    }

    // ✅ Create the order AFTER wallet deduction
    const order = new Order({ items, amount, email, status, paidAt });
    await order.save();

    // ✅ Generate QR only if paid
    let qrData = null;
    if (status === "paid") {
      qrData = await createQrForOrder(order, expireHours);
    }

    return res.json({
      ok: true,
      message: status === "paid" ? "Order created & QR generated." : "Order pending. Integrate payment provider.",
      orderId: order._id,
      amount,
      remainingBalance,
      ...qrData
    });

  } catch (err) {
    console.error("Error in POST /api/orders:", err.message);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

module.exports = router;
