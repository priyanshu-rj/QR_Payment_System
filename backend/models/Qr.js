const mongoose = require("mongoose");

const qrSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  token: String,
  expireAt: Date,
  used: { type: Boolean, default: false },


  items: [
    {
      name: String,
      price: Number,
      qty: Number
    }
  ],
  amount: Number,
  email: String
});

module.exports = mongoose.model("Qr", qrSchema);
