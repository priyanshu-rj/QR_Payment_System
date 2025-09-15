import React, { useState } from "react";
import axios from "axios";
import "./Generator.css";

export default function Generator() {
  const [items, setItems] = useState([{ name: "", price: 0, qty: 1 }]);
  const [email, setEmail] = useState("");
  const [qrImage, setQrImage] = useState("");
  const [message, setMessage] = useState("");
  const [remainingBalance, setRemainingBalance] = useState(null);

  const backend = "http://localhost:5000";

  function updateItem(idx, field, value) {
    const copy = items.map((i) => ({ ...i }));
    copy[idx][field] = value;
    setItems(copy);
  }

  function addItem() {
    setItems([...items, { name: "", price: 0, qty: 1 }]);
  }

  async function handleBuy() {
    setMessage("Processing...");
    setQrImage("");
    setRemainingBalance(null);

    try {
      if (!email) {
        setMessage("Please enter your email for wallet payment.");
        return;
      }

      const res = await axios.post(`${backend}/api/orders`, {
        items,
        email,
        simulatePayment: true, 
        expireHours: 24,
      });

      if (res.data && res.data.qrImageDataUrl) {
        setQrImage(res.data.qrImageDataUrl);
        setRemainingBalance(res.data.remainingBalance);
        setMessage(
          `Payment successful! QR generated. Remaining balance: ₹${res.data.remainingBalance}`
        );
      } else {
        setMessage(res.data.message || "Order created, but QR not generated.");
      }
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        "Error creating order. Please check wallet or items.";
      setMessage(msg);
    }
  }

  return (
    <div className="generator-container">
      <h2 className="generator-heading">Generate QR & Pay via Wallet</h2>

      <div className="field-group">
        <label className="field-label">Email (Wallet Account)</label>
        <input
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your wallet email"
        />
      </div>

      <div className="items-section">
        <h3 className="generator-subheading">Items</h3>
        {items.map((it, idx) => (
          <div key={idx} className="item-row">
            <input
              className="input"
              style={{ flex: 2 }}
              placeholder="Item name"
              value={it.name}
              onChange={(e) => updateItem(idx, "name", e.target.value)}
            />
            <input
              className="input"
              style={{ flex: 1, marginLeft: 8 }}
              placeholder="Price"
              type="number"
              value={it.price}
              onChange={(e) => updateItem(idx, "price", e.target.value)}
            />
            <input
              className="input"
              style={{ flex: 1, marginLeft: 8 }}
              placeholder="Qty"
              type="number"
              value={it.qty}
              onChange={(e) => updateItem(idx, "qty", e.target.value)}
            />
          </div>
        ))}
        <button className="add-btn" onClick={addItem}>
          + Add Item
        </button>
      </div>

      <button className="buy-btn" onClick={handleBuy}>
        Pay & Generate QR
      </button>

      <div>
        <p className="message">{message}</p>

        {remainingBalance !== null && (
          <p className="balance">Remaining Balance: ₹{remainingBalance}</p>
        )}

        {qrImage && (
          <div style={{ textAlign: "center" }}>
            <img src={qrImage} alt="QR" className="qr-image" />
            <div>
              <a href={qrImage} download="qr.png" className="download-link">
                Download QR
              </a>
            </div>
            <p className="note">Scan this QR to validate your order</p>
          </div>
        )}
      </div>
    </div>
  );
}
