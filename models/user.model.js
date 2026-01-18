// const { verify } = require('jsonwebtoken')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: ""
    }, // Cloudinary image URL
    profilePicPublicId: {
        type: String,
        default: ""
    }, // Cloudinary public ID for deletion
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["ADMIN", "USER"],
        default: "USER"
    },
    token: {
        type: String,
        default: null
    },
    verify_email: {
        type: Boolean,
        default: false
    },
    isLoggedIn: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        default: null
    },
    otp_expires: {
        type: Date,
        default: null
    },
    address_details: {
        type: String,
        ref: "Address"
    },
    city: {
        type: String,
        default: ""
    },
    zipCode: {
        type: String,
        default: ""
    },
    
    phoneNumber: {
        type: String,
        // required: true
    },
    
    // createdAt: {
    //     type: Date,
    //     default: Date.now
    // },
    // updatedAt: {
    //     type: Date,
    //     default: Date.now
    // }

}, { 
    timestamps: true 
}) 

const UserModel = mongoose.model('User', userSchema)
module.exports = UserModel