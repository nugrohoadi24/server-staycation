const mongoose = require('mongoose');
const { Schema } = mongoose;

const activitySchema = new Schema({
    name: {
        type: String,
        required: true
    }, 
    type: {
        type: String,
        required: true
    },
    img_url: {
        type: String,
        required: true
    },
    isPopular: {
        type: Boolean,
    },
})

module.exports = mongoose.model('Activity', activitySchema);