const OrderModel = require('../models/order.model')
const ProductModel = require('../models/product.model')
const razorpayInstance = require('../config/Razorpay')
const CartModel = require('../models/cart.model')
const crypto = require('crypto')
const UserModel = require('../models/user.model')
const PromoCodeModel = require('../models/promoCode.model')

function normalizeAmount(amount) {
    const num = Number(amount);

    if (!Number.isFinite(num)) {
        throw new Error("Invalid amount");
    }

    // if decimal present → rupees → convert
    if (!Number.isInteger(num)) {
        return Math.round(num * 100);
    }

    // already paise
    return num;
}

const createOrder = async (req, res) => {
    try {
        const { products, amount, tax, shipping, currency, promoCode, discountAmount } = req.body
        const normalizedAmount = normalizeAmount(amount)
        const options = {
            amount: normalizedAmount,
            currency: currency || "INR",
            receipt: `receipt_${Date.now()}`
        }

        const razorpayOrder = await razorpayInstance.orders.create(options)

        // Update promo code usage if applicable
        if (promoCode) {
            await PromoCodeModel.findOneAndUpdate(
                { code: promoCode },
                { 
                    $inc: { usedCount: 1 },
                    $addToSet: { usedBy: req.user._id }
                }
            )
        }

        // save order to database (schema uses 'product' not 'products')
        const newOrder = await OrderModel.create({
            user: req.user._id,
            product: products,
            amount,
            tax,
            shipping,
            currency: currency || "INR",
            promoCode: promoCode || null,
            discountAmount: discountAmount || 0,
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
            message: error.message
        })

    }
}

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentFailed } = req.body
        const userId = req.user._id

        if (paymentFailed) {
            const order = await OrderModel.findOneAndUpdate(
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
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
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
             const order = await OrderModel.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: "Failed" },
                { new: true }
            );
            return res.status(200).json({
                success: false,
                message: "Payment failed",
                order
            })
        }

    } catch (error) {
        console.log("❌ Error in verifyPayment: ", error);
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getMyOrders = async (req, res) => {
    try {
        const userId = req.user._id
        const orders = await OrderModel.find({user: userId})
        .populate({path: "product.productId", select: "productName productPrice productImg"})
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
            message: error.message
        })
    }
}

// Admin Only 
const getUserOrders= async (req, res) => {
    try{
        const {userId} = req.params; // userId will be come from URL
        const orders = await OrderModel.find({user: userId})
        .populate({
            path: "product.productId", 
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
            message: error.message
        })
    }
}

const getAllOrdersAdmin= async (req, res) => {
    try{
        const orders = await OrderModel.find()
        .sort({createdAt: -1}) // sort by createdAt in descending order
        .populate("product.productId", "productName productPrice productImg")
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
            message: error.message,
            error: error.message
        })
    }
}

const getSalesData = async (req, res) => {
    try{
        const totalUsers = await UserModel.countDocuments({})
        const totalOrders = await OrderModel.countDocuments({})
        const totalProducts = await ProductModel.countDocuments({})

        // Total sales amount
        const totalSaleAgg = await OrderModel.aggregate([
            { $match: { status: "Paid" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ])

        const totalSales = totalSaleAgg[0]?.total || 0

        //  Sales grouped by date (last 30 days)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const salesByDate = await OrderModel.aggregate([
            { $match: {status: "Paid", createdAt: { $gte: thirtyDaysAgo } } },
            { $group: { 
                _id: { 
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } 
                }, 
                amount: { $sum: "$amount" } 
            } 
        },
            { $sort: { _id: 1 } }
        ])
        console.log(salesByDate);

        const formattedSales = salesByDate.map((item) => ({
            date: item._id,
            amount: item.amount
        }))
        console.log(formattedSales);

        res.json({
            success: true,
            totalUsers,
            totalOrders,
            totalProducts,
            totalSales,
            sales:formattedSales,
        })
    }
    catch(error){
        console.log("Error fetching sales data:", error);
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { createOrder, verifyPayment, getMyOrders, getAllOrdersAdmin, getUserOrders, getSalesData }