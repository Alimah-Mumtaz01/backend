require("dotenv").config();

module.exports = {
    port: process.env.PORT || 7000,
    database: {
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 3306,
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    },
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
    deliveryFee: Number(process.env.DELIVERY_FEE) || 10000,
};