import mongoose from 'mongoose';
const { Schema } = mongoose;

const imageSchema = new Schema({
    img_url: {
        type: String,
        required: true
    }, 
})

module.exports = mongoose.model('Image', imageSchema)