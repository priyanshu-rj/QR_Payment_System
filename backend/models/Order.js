const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  items: [{ name: String, price: Number, qty: { type: Number, default: 1 } }],
  amount: Number,
  email: String,
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
  paidAt: Date,
});

module.exports = mongoose.model("Order", OrderSchema);
