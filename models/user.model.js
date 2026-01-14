// const { verify } = require('jsonwebtoken')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    avatar: {
        type: String,
        default: ""
    },
    mobile: {
        type: String,
        required: [true, "Mobile is required"]
    },
    refresh_token: {
        type: String,
        default: null
    },
    verify_email: {
        type: Boolean,
        default: false
    },
    last_login: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    address_details: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    },
    shopping_cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cartproduct"
    },
    orderHistory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    },
    forgot_password_otp: {
        type: String,
        default: null
    },
    forgot_password_otp_expires: {
        type: Date,
        default: ""
    },
    role: {
        type: String,
        enum: ["ADMIN", "USER"],
        default: "USERS"
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