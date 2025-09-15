require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const orderRoutes = require("./routes/orderRoutes");
console.log("orderRoutes =", orderRoutes);

const qrRoutes = require("./routes/qrRoutes");
console.log("qrRoutes =", qrRoutes);

const walletRoutes = require("./routes/walletRoutes");
console.log("walletRoutes =", walletRoutes);


const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/orders", orderRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/wallet", walletRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`running http://localhost:${PORT}`));
