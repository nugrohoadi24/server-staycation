import mongoose from 'mongoose';
const { Schema } = mongoose;

const bankSchema = new Schema({
    name_bank: {
        type: String,
        required: true
    }, 
    rekening: {
        type: String,
        required: true
    },
    name_account: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('Bank', bankSchema)