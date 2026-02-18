const OrderModel = require('../models/order.model')
const razorpayInstance = require('../config/Razorpay')
const CartModel = require('../models/cart.model')
const crypto = require('crypto')

const createOrder = async (req, res) => {
    try {
        const { products, amount, tax, shipping, currency } = req.body
        const options = {
            amount: Math.round(Number(amount) * 100), // convert to paisa
            currency: currency || "INR",
            receipt: `receipt_${Date.now()}`
        }

        const razorpayOrder = await razorpayInstance.orders.create(options)

        // save order to database
        const newOrder = await OrderModel.create({
            user: req.user._id,
            products,
            amount,
            tax,
            shipping,
            currency: "Pending",
            razorpayOrderId: razorpayOrder.id,
        })

        await newOrder.save()

        res.json({
            success: true,
            order: razorpayOrder,
            dbOrder: newOrder
        })

    } catch (error) {
        console.log("❌ Error in createOrder: ", error);
        res.status(500).json({
            success: false,
            message: "error.message"
        })

    }
}

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentFailed } = req.body
        const userId = req.user._id

        if (paymentFailed) {
            const order = await OrderModel.findOne(
                { razorpayOrderId: razorpay_order_id },
                { status: "Failed" },
                { new: true }
            );
            return res.status(200).json({
                success: false,
                message: "Payment failed",
                order: order
            })
        }

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_SECRET)
            .update(sign.toString())
            .digest('hex');

        if(expectedSign == razorpay_signature) {
            const order = await OrderModel.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { 
                    status: "Paid",
                    razorpayPaymentId: razorpay_payment_id,
                    razorpaySignature: razorpay_signature
                },
                { new: true }
            );

            await CartModel.findOneAndUpdate({userId}, {$set: {items: [], totalPrice: 0}})

            return res.status(200).json({
                success: true,
                message: "Payment successful",
                order: order
            })
        } else {
             await OrderModel.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: "Failed" },
                { new: true }
            );
            return res.status(200).json({
                success: false,
                message: "Payment failed",
                order: order
            })
        }

    } catch (error) {
        console.log("❌ Error in verifyPayment: ", error);
        res.status(500).json({
            success: false,
            message: "error.message"
        })
    }
}

const getMyOrders = async (req, res) => {
    try {
        const userId = req.user._id
        const orders = await OrderModel.find({user: userId})
        .populate({path: "products.product", select: "productName productPrice productImage"})
        .populate("user", "firstName lastName email")
        res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        })
    } catch (error) {
        console.log("❌ Error fetching user orders:", error);
        res.status(500).json({
            success: false,
            message: "error.message"
        })
    }
}

// Admin Only 
const getUserOrder= async (req, res) => {
    try{
        const {userId} = req.params; // userId will be come from URL
        const orders = await OrderModel.find({user: userId})
        .populate({
            path: "products.productId", 
            select: "productName productPrice productImg"
        }) // fetch product details
        .populate("user", "firstName lastName email") // fetch user info
        res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        })
    }catch(error){
        console.log("❌ Error fetching user orders:", error);
        res.status(500).json({
            success: false,
            message: "error.message"
        })
    }
}

const getAllOrdersAdmin= async (req, res) => {
    try{
        const orders = await OrderModel.find()
        .sort({createdAt: -1}) // sort by createdAt in descending order
        .populate("products.productId", "productName productPrice productImg")
        .populate("user", "firstName lastName email")
        
        res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        })
    }catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: "error.message",
            error: error.message
        })
    }
}

module.exports = { createOrder, verifyPayment, getMyOrders }