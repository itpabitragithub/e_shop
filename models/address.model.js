const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
    address_line: {
        type: String,
        required: [true, "Address line is required"]
    },
    city: {
        type: String,
        required: [true, "City is required"]
    },
    state: {
        type: String,
        required: [true, "State is required"]
    },
    pincode: {
        type: String,
        required: [true, "Pincode is required"]
    },
    country: {
        type: String,
        required: [true, "Country is required"]
    },
    mobile: {
        type: Number,
        required: [true, "Phone is required"]
    },
    status: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true
})

const AddressModel = mongoose.model('Address', addressSchema)
module.exports = AddressModel