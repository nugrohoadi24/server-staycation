const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const bookingSchema = new Schema({
    itemId: {
        _id: {
            type: ObjectId,
            ref: 'Item'
        },
        title: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        duration: {
            type: Number,
            required: true
        }
    },
    memberId: {
        type: ObjectId,
        ref: 'Member'
    },
    bankId: {
        type: ObjectId,
        ref: 'Bank'
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    invoice: {
        type: String,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    payment: {
        proofPayment: {
            type: String,
            required: true
        },
        bank_from: {
            type: String,
            required: true
        },
        accountHolder: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        }
    },
})

module.exports = mongoose.model('Booking', bookingSchema);