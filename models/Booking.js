const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const bookingSchema = new Schema({
    item: [{
        _id: {
            type: ObjectId,
            ref: 'Item'
        },
        price: {
            type: Number,
            required: true
        },
        night: {
            type: Number,
            required: true
        }
    }],
    member: [{
        type: ObjectId,
        ref: 'Member'
    }],
    bank: [{
        type: ObjectId,
        ref: 'Bank'
    }],
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
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
})

module.exports = mongoose.model('Booking', bookingSchema);