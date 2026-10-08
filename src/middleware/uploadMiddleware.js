const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadPath = path.join(__dirname, "../uploads/payments");
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const filename = `payment-${req.params.id_order}-${Date.now()}${extension}`;
        cb(null, filename);
    }
});
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Bukti pembayaran harus berupa gambar (JPEG, PNG, JPG, WEBP)"), false);
    }
};
const uploadPayment = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = { uploadPayment };