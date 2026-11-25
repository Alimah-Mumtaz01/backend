const express = require("express");
const router = express.Router();

const paymentMethodController = require("../controllers/paymentMethodController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const validate = require("../middleware/validateMiddleware");

const {
    createPaymentMethodSchema,
    updatePaymentMethodSchema,
    updatePaymentMethodStatusSchema,
} = require("../validations/paymentValidation");

/**
 * CUSTOMER
 * Mengambil daftar metode pembayaran yang aktif.
 */
router.get(
    "/active",
    authMiddleware,
    paymentMethodController.getActivePaymentMethods
);

/**
 * ADMIN
 * Mengambil seluruh metode pembayaran.
 */
router.get(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    paymentMethodController.getAllPaymentMethods
);

/**
 * ADMIN
 * Menambahkan metode pembayaran.
 */
router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    validate(createPaymentMethodSchema),
    paymentMethodController.createPaymentMethod
);

/**
 * ADMIN
 * Memperbarui data metode pembayaran.
 */
router.put(
    "/:id_metode_pembayaran",
    authMiddleware,
    roleMiddleware("admin"),
    validate(updatePaymentMethodSchema),
    paymentMethodController.updatePaymentMethod
);

/**
 * ADMIN
 * Mengubah status aktif/nonaktif.
 */
router.patch(
    "/:id_metode_pembayaran/status",
    authMiddleware,
    roleMiddleware("admin"),
    validate(updatePaymentMethodStatusSchema),
    paymentMethodController.updatePaymentMethodStatus
);

/**
 * ADMIN
 * Menghapus metode pembayaran.
 */
router.delete(
    "/:id_metode_pembayaran",
    authMiddleware,
    roleMiddleware("admin"),
    paymentMethodController.deletePaymentMethod
);

module.exports = router;