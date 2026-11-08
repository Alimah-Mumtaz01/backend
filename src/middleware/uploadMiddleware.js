const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const paymentPath = path.join(__dirname, "../uploads/payments");
const productPath = path.join(__dirname, "../uploads/products");

[paymentPath, productPath].forEach((folder) => {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }
});

const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp"
];

const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Gambar harus berupa JPEG, JPG, PNG, atau WEBP"
            ),
            false
        );
    }
};

const paymentStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, paymentPath);
    },

    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const filename = `payment-${req.params.id_order}-${Date.now()}${extension}`;

        cb(null, filename);
    }
});

const uploadPayment = multer({
    storage: paymentStorage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

const productStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, productPath);
    },

    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();

        const filename = `product-${Date.now()}-${crypto.randomBytes(6).toString("hex")}${extension}`;

        cb(null, filename);
    }
});

const uploadProduct = multer({
    storage: productStorage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = {
    uploadPayment,
    uploadProduct
};