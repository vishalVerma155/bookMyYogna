const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    recipientAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
    },
    senderAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
    },
    heading: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
},{timestamps : true});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;

