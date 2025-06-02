const Order = require('../../models/booking/booking.model.js');
const { PoojaPlans, Pooja } = require('../../models/poojaModel/pooja.model.js');
const mongoose = require('mongoose');
const axios = require('axios');
const Admin = require("../../models/admin/admin.model.js")

// Create Order
const createOrder = async (req, res) => {
    try {

        const userId = req.user._id;

        const {
            poojaId,
            planId,
            name,
            phoneNumber,
            address,
            amount,
            dateOfDelivery,
            poojaMode
        } = req.body;

        if (!userId || !poojaId || !planId || !name || !phoneNumber || !address || !amount || !dateOfDelivery || !poojaMode) {
            return res.status(400).json({ success: false, error: "All required fields must be provided" });
        }


        if (
            !mongoose.Types.ObjectId.isValid(userId) ||
            !mongoose.Types.ObjectId.isValid(poojaId) ||
            !mongoose.Types.ObjectId.isValid(planId)
        ) {
            return res.status(400).json({ success: false, error: 'Invalid ID(s)' });
        }

        const order = await Order.create({
            userId,
            poojaId,
            planId,
            name,
            phoneNumber,
            address,
            status: "Pending",
            amount,
            dateOfDelivery,
            poojaMode
        });


        const admin = await Admin.findOne({ role: "admin" })

        const notification = await axios.post(
            "https://bookmyyogna.onrender.com/notification/createNotification",
            {
                recipient: admin._id,
                heading: `New pooja sesson booked`,
                message: `New pooja has been booked for ${order.name} on date ${order.dateOfDelivery.toLocaleDateString('en-IN')} with mode ${order.poojaMode}.`,
                receiverRole: admin.role
            }
        );

        return res.status(201).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get All Orders
const getAllOrdersForUsers = async (req, res) => {
    try {
        const userId = req.user._id;
        const filter = { userId };
        const { startDate, endDate, status } = req.body;

        if (status && status.trim() !== "") {
            filter.status = status
        }

        if (startDate && endDate) {
            filter.createdAt = {
                $gte: new Date(`${startDate}T00:00:00.000Z`),
                $lte: new Date(`${endDate}T23:59:59.999Z`)
            };
        }

        const orders = await Order.find(filter)
            .populate('userId', 'fullName')
            .populate('poojaId', 'heading image')
            .populate('planId', 'heading amount');
        res.json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllOrdersForAdmin = async (req, res) => {
    try {

        const filter = {};
        const { startDate, endDate, status } = req.body;

        if (status && status.trim() !== "") {
            filter.status = status
        }

        if (startDate && endDate) {
            filter.createdAt = {
                $gte: new Date(`${startDate}T00:00:00.000Z`),
                $lte: new Date(`${endDate}T23:59:59.999Z`)
            };
        }

        const orders = await Order.find(filter)
            .populate('userId', 'name')
            .populate('poojaId', 'heading image')
            .populate('planId', 'heading amount');

        return res.json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Order by ID
const getOrderById = async (req, res) => {
    try {
        const orderid = req.params.id;
        const order = await Order.findById(orderid)
            .populate('userId', 'name email')
            .populate('poojaId', 'heading')
            .populate('planId', 'heading amount');

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Order
const updateOrder = async (req, res) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(404).json({ success: false, message: 'Only admin can do this.' });
        }
        const { status } = req.body;
        const orderid = req.params.id;

        const order = await Order.findById(orderid).select('status userId');
        

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        const notification = await axios.post(
            "https://bookmyyogna.onrender.com/notification/createNotification",
            {
                recipient: order.userId,
                heading: `New pooja booking status has been changed.`,
                message: `Your pooja booking status has been changed to ${order.status} for pooja booking id ${order._id}.`,
                receiverRole: "user"
            }
        );
        

        return res.status(200).json({ success: true, message: "Order status has been changed", order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


module.exports = { createOrder, getAllOrdersForAdmin, getAllOrdersForUsers, getOrderById, updateOrder };