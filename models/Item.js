const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const itemSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    country: {
        type: Number,
        default: 'Indonesia'
    },
    city: {
        type: String,
        required: true
    },
    isPopular: {
        type: Boolean
    },
    description: {
        type: String,
        required: true
    },
    image: [{
        type: ObjectId,
        ref: 'Image'
    }],
    feature: [{
        type: ObjectId,
        ref: 'Feature'
    }],
    activity: [{
        type: ObjectId,
        ref: 'Activity'
    }],
})

module.exports = mongoose.model('Item', itemSchema);