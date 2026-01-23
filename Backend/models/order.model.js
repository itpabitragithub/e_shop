const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    orderId: {
        type: String,
        required: [true, "Order ID is required"],
        unique: true, 
    },

    product_id: {
        type: mongoose.Schema.ObjectId,
        ref: "Product"
    },
    product_details: { 
       name : String,
       image : Array,
     },
     paymentId : {
        type: String,
        default: ""
     },
     payment_status: {
        type: String,
        default: ""
     },
     delivery_address: {
        type: mongoose.Schema.ObjectId,
        ref: "Address"
     },
     delivery_status: {
        type: mongoose.Schema.ObjectId,
        ref: "Address"
     },
     subTotalAmt :{
        type: Number,
        default: 0
     },
     totalAmt :{
        type: Number,
        default: 0
     },
     invoice : {
        type: String,
        default: ""
     }
}, {
    timestamps: true
})  
const OrderModel = mongoose.model('Order', orderSchema)
module.exports = OrderModel