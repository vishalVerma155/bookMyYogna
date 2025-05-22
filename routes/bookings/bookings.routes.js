
const express = require('express');
const verifyJWT = require('../../middleware/authMiddleware.js');
const { createOrder, getAllOrdersForAdmin, getAllOrdersForUsers, getOrderById, updateOrder } = require('../../controllers/booking/booking.controllers.js');
const { upload } = require('../../utils/multer.js');





const router = express.Router();

// create pandit card
router.post("/createBooking", verifyJWT, createOrder);

router.post("/getAllBookingForAdmin", verifyJWT, getAllOrdersForAdmin);

router.post("/getAllBookingForUser", verifyJWT, getAllOrdersForUsers);

router.get("/getBooking/:id", verifyJWT, getOrderById);

router.patch("/updateBooking/:id", verifyJWT, updateOrder);






module.exports = router;