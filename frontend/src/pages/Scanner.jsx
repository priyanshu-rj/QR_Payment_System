// import React, { useState } from 'react';
// import { QrReader } from 'react-qr-reader';
// import axios from 'axios';

// export default function Scanner() {
//   const [resMsg, setResMsg] = useState('');
//   const [order, setOrder] = useState(null);
//   const backend = 'http://localhost:5000';

//   async function handleScan(data) {
//     if (!data) return;
//     setResMsg('Scanned. validating...');

//     let token = data;
//     try {
//       if (data.includes('token=')) {
//         const u = new URL(data);
//         token = u.searchParams.get('token');
//       }
//     } catch (e) {
      
//     }

//     try {
//       const r = await axios.get(`${backend}/api/qr/validate`, { params: { token } });
//       setResMsg(r.data.message || 'Valid');
//       setOrder(r.data.order);
//     } catch (err) {
//       const msg = err?.response?.data?.message || 'Validation failed';
//       setResMsg(msg);
//       setOrder(null);
//     }
//   }

//   return (
//     <div>
//       <h3>Scanner</h3>
//       <div style={{ width: 320 }}>
//         <QrReader
//           onResult={(result, error) => {
//             if (!!result) handleScan(result?.text);
//             if (!!error) {
//               /* ignore errors */
//             }
//           }}
//           constraints={{ facingMode: 'environment' }}
//           style={{ width: '100%' }}
//         />
//       </div>

//       <div style={{ marginTop: 12 }}>
//         <p><strong>Status:</strong> {resMsg}</p>
//         {order && (
//           <div>
//             <h4>Order Details</h4>
//             <p>Amount: {order.amount}</p>
//             <p>Email: {order.email}</p>
//             <ul>
//               {order.items.map((it, i) => (
//                 <li key={i}>
//                   {it.qty} x {it.name} @ {it.price}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import React from "react";
import { QrReader } from "react-qr-reader";
import { useNavigate } from "react-router-dom";
import jsQR from "jsqr";
import "./Scanner.css";

export default function Scanner() {
  const navigate = useNavigate();

  function handleScan(data) {
    if (!data) return;

    let token = data;
    try {
      if (data.includes("token=")) {
        const u = new URL(data);
        token = u.searchParams.get("token");
      }
    } catch (e) {
      // ignore
    }

    // ✅ redirect to validate page with token
    navigate(`/validate/${encodeURIComponent(token)}`);
  }

  async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

        if (qrCode) {
          handleScan(qrCode.data);
        } else {
          alert("No QR code detected in image");
        }
      };
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="scanner-container">
      <h2 className="scanner-title">QR Code Scanner</h2>

      <div className="scanner-camera">
        <QrReader
          onResult={(result, error) => {
            if (!!result) handleScan(result?.text);
          }}
          constraints={{ facingMode: "environment" }}
          style={{ width: "100%" }}
        />
      </div>

      <div className="scanner-upload">
        <label className="upload-label">Or Upload QR Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="upload-input"
        />
      </div>
    </div>
  );
}
