const jwt = require("jsonwebtoken");
const QRCode = require("qrcode");
const Qr = require("../models/Qr");

const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_VALIDATE_URL = process.env.FRONTEND_VALIDATE_URL;
const DEFAULT_EXPIRE_HOURS = parseInt(process.env.QR_EXPIRE_HOURS || "24", 10);


function calcAmount(items = []) {
  return items.reduce((s, it) => s + (Number(it.price || 0) * Number(it.qty || 1)), 0);
}


function extractTokenFromScanned(raw) {
  try {
    if (!raw) return null;
    if (raw.includes("token=")) {
      const url = new URL(raw);
      return url.searchParams.get("token");
    }
  } catch (e) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Invalid QR content:", raw);
    }
  }
  return raw;
}


async function createQrForOrder(order, expireHours = DEFAULT_EXPIRE_HOURS) {
  const expireAt = new Date(Date.now() + expireHours * 60 * 60 * 1000);

  const qrDoc = new Qr({ orderId: order._id, expireAt });
  await qrDoc.save();

  const token = jwt.sign(
    { qrId: qrDoc._id.toString(), orderId: order._id.toString() },
    JWT_SECRET,
    { expiresIn: `${expireHours}h` }
  );

  qrDoc.token = token;
  await qrDoc.save();

  const qrContent = `${FRONTEND_VALIDATE_URL}?token=${encodeURIComponent(token)}`;
  const qrImageDataUrl = await QRCode.toDataURL(qrContent);

  return { qrId: qrDoc._id, token, qrImageDataUrl, expireAt };
}

module.exports = { calcAmount, extractTokenFromScanned, createQrForOrder };
