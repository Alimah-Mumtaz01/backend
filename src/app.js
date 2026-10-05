const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const varianRoutes = require("./routes/varianRoutes");
const orderRoutes = require("./routes/orderRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const env = require("./config/env");

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/varian", varianRoutes);
app.use(helmet());
app.use(
    cors({
        origin: env.frontendUrl,
    })
);
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "SoeSweet API berhasil dijalankan",
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Endpoint tidak ditemukan",
    });
});

module.exports = app;