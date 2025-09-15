import React, { useState } from "react";
import axios from "axios";
import "./Wallet.css"; 

export default function Wallet() {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const backend = "http://localhost:5000";

  async function handleAddMoney() {
    try {
      const res = await axios.post(`${backend}/api/wallet/add`, {
        email,
        amount: Number(amount),
      });
      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.message || "Error adding money");
    }
  }

  async function handleCheckBalance() {
    try {
      const res = await axios.get(`${backend}/api/wallet/${email}`);
      setMessage(`Balance: ₹${res.data.balance}`);
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.message || "Error checking balance");
    }
  }

  return (
    <div className="wallet-container">
      <h2 className="wallet-title">Wallet</h2>

      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="wallet-input"
      />
      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="wallet-input"
      />

      <div className="wallet-buttons">
        <button onClick={handleAddMoney} className="wallet-btn add">
          Add Money
        </button>
        <button onClick={handleCheckBalance} className="wallet-btn check">
          Check Balance
        </button>
      </div>

      {message && <p className="wallet-message">{message}</p>}
    </div>
  );
}
