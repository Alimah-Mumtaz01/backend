const express = require("express");

const router = express.Router();

// Mengimpor controller ongkir
const {
  calculateShipping,
} = require("../controllers/shippingController");

// Endpoint untuk menghitung ongkir berdasarkan alamat
router.post("/calculate", calculateShipping);

module.exports = router;