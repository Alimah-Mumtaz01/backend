const express = require("express");

const orderController = require("../controllers/orderController");
const paymentController = require("../controllers/paymentController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const { uploadPayment } = require("../middleware/uploadMiddleware");

const validate = require("../middleware/validateMiddleware");

const {
    createOrderSchema,
    updateShippingSchema,
    updateOrderStatusSchema,
} = require("../validations/orderValidation");

const {
    uploadPaymentSchema,
    verifyPaymentSchema,
} = require("../validations/paymentValidation");

const router = express.Router();

// Membuat pesanan.
router.post(
    "/",
    authMiddleware,
    validate(createOrderSchema),
    orderController.createOrder
);

// Mengambil seluruh pesanan milik customer.
router.get(
    "/my-orders",
    authMiddleware,
    orderController.getMyOrders
);

// Mengambil detail pesanan milik customer.
router.get(
    "/my-orders/:id_order",
    authMiddleware,
    orderController.getMyOrderById
);

// Memperbarui alamat pengiriman.
router.put(
    "/my-orders/:id_order/shipping",
    authMiddleware,
    validate(updateShippingSchema),
    orderController.updateShipping
);

// Mengambil status pesanan customer.
router.get(
    "/my-orders/:id_order/status",
    authMiddleware,
    orderController.getMyOrderStatus
);

router.post(
    "/:id_order/payment",
    authMiddleware,
    uploadPayment.single("bukti_pembayaran"),
    validate(uploadPaymentSchema),
    paymentController.uploadPayment
);

// Mengambil seluruh pesanan.
router.get(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    orderController.getAllOrders
);

// Mengambil riwayat pesanan customer.
router.get(
    "/customers/:id_user/orders",
    authMiddleware,
    roleMiddleware("admin"),
    orderController.getCustomerOrderHistoryAdmin
);

// Mengambil detail pesanan admin.
router.get(
    "/:id_order",
    authMiddleware,
    roleMiddleware("admin"),
    orderController.getAdminOrderById
);

router.put(
    "/:id_order/payment/verify",
    authMiddleware,
    roleMiddleware("admin"),
    validate(verifyPaymentSchema),
    paymentController.verifyPayment
);

router.put(
    "/:id_order/status",
    authMiddleware,
    roleMiddleware("admin"),
    validate(updateOrderStatusSchema),
    orderController.updateOrderStatus
);

module.exports = router;