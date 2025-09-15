import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ValidatePage.css";

export default function ValidatePage() {
  const { token } = useParams();
  const [status, setStatus] = useState("Checking...");
  const [order, setOrder] = useState(null);
  const backend = "http://localhost:5000";

  useEffect(() => {
    async function run() {
      if (!token) {
        setStatus("No token provided");
        return;
      }
      try {
        const res = await axios.get(`${backend}/api/qr/validate`, {
          params: { token },
        });
        setStatus(res.data.message || "Valid");
        setOrder(res.data.order);
      } catch (err) {
        setStatus(err?.response?.data?.message || "Validation failed");
      }
    }
    run();
  }, [token]);

  return (
    <div className="validate-container">
      <h3 className="validate-title">QR Validation</h3>
      <p
        className={`validate-status ${
          status.includes("Valid") ? "success" : "error"
        }`}
      >
        {status}
      </p>

      {order && (
        <div className="order-card">
          <h4>Order Details</h4>
          <p>
            <strong>Amount:</strong> ₹{order.amount}
          </p>
          <p>
            <strong>Email:</strong> {order.email}
          </p>
          <ul>
            {order.items.map((it, i) => (
              <li key={i}>
                {it.qty} × {it.name} @ ₹{it.price}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
