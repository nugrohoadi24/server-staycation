import mongoose from 'mongoose';
const { Schema } = mongoose;

const memberSchema = new Schema({
    name: {
        type: String,
        required: true
    }, 
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('Member', memberSchema)