const mongoose = require('mongoose');
const { Schema } = mongoose;

const featureSchema = new Schema({
    name: {
        type: String,
        required: true
    }, 
    qty: {
        type: Number,
        required: true
    },
    img_url: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Feature', featureSchema);