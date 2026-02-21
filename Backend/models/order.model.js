const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
   user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true
   },
   product: [{
      productId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Product",
         required: true
      },
      quantity: {
         type: Number,
         required: true
      }
   }],
   amount: { type: Number, required: true },
   tax: { type: Number, required: true },
   shipping: { type: Number, required: true },
   currency: { type: String, required: true },
   status: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
   
   // Promo code fields
   promoCode: { type: String, default: null },
   discountAmount: { type: Number, default: 0 },

   //  Razorpay Fields (paymentId and signature set after payment)
   razorpayOrderId: { type: String, required: true },
   razorpayPaymentId: { type: String },
   razorpaySignature: { type: String }
}, {
   timestamps: true
})
const OrderModel = mongoose.model('Order', orderSchema)
module.exports = OrderModel