const express = require("express");
const User = require("../models/User");
const router = express.Router();

    
router.post("/add", async (req, res) => {
  try {
    const { email, amount } = req.body;
    if (!email || amount <= 0) {
      return res.status(400).json({ ok: false, message: "Invalid email or amount" });
    }

    let user = await User.findOne({ email });
    if (!user) user = new User({ email, balance: 0 });

    user.balance += amount;
    await user.save();

    res.json({ ok: true, balance: user.balance });
  } catch (err) {
    console.error("Error in POST /api/wallet/add:", err.message);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

  
router.get("/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ ok: false, message: "User not found" });

    res.json({ ok: true, balance: user.balance });
  } catch (err) {
    console.error("Error in GET /api/wallet/:email:", err.message);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

module.exports = router;
