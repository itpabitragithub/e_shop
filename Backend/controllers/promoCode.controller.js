const PromoCodeModel = require('../models/promoCode.model')

// Validate and apply promo code
const validatePromoCode = async (req, res) => {
    try {
        const { code, totalAmount } = req.body
        const userId = req.user?._id

        if (!code) {
            return res.status(400).json({
                success: false,
                message: "Promo code is required"
            })
        }

        if (!totalAmount || totalAmount <= 0) {
            return res.status(400).json({
            success: false,
            message: "Total amount is required"
            })
        }

        // Find promo code
        const promoCode = await PromoCodeModel.findOne({ 
            code: code.toUpperCase().trim(),
            isActive: true
        })

        if (!promoCode) {
            return res.status(404).json({
                success: false,
                message: "Invalid promo code"
            })
        }

        // Check if promo code is within valid date range
        const now = new Date()
        if (now < promoCode.startDate || now > promoCode.endDate) {
            return res.status(400).json({
                success: false,
                message: "Promo code has expired or is not yet active"
            })
        }

        // Check minimum purchase amount
        if (totalAmount < promoCode.minPurchaseAmount) {
            return res.status(400).json({
                success: false,
                message: `Minimum purchase amount of ₹${promoCode.minPurchaseAmount} required`
            })
        }

        // Check usage limit
        if (promoCode.usageLimit !== null && promoCode.usedCount >= promoCode.usageLimit) {
            return res.status(400).json({
                success: false,
                message: "Promo code usage limit reached"
            })
        }

        // Check if user has already used this code (optional - remove if you want to allow multiple uses)
        if (userId && promoCode.usedBy.includes(userId)) {
            return res.status(400).json({
                success: false,
                message: "You have already used this promo code"
            })
        }

        // Calculate discount
        let discountAmount = 0
        if (promoCode.discountType === "percentage") {
            discountAmount = (totalAmount * promoCode.discountValue) / 100
            // Apply max discount limit if set
            if (promoCode.maxDiscountAmount !== null && discountAmount > promoCode.maxDiscountAmount) {
                discountAmount = promoCode.maxDiscountAmount
            }
        } else if (promoCode.discountType === "fixed") {
            discountAmount = promoCode.discountValue
            // Ensure discount doesn't exceed total amount
            if (discountAmount > totalAmount) {
                discountAmount = totalAmount
            }
        }

        // Round discount to 2 decimal places
        discountAmount = Math.round(discountAmount * 100) / 100

        const finalAmount = totalAmount - discountAmount

        res.json({
            success: true,
            message: "Promo code applied successfully",
            promoCode: {
                code: promoCode.code,
                description: promoCode.description,
                discountType: promoCode.discountType,
                discountValue: promoCode.discountValue
            },
            discountAmount,
            originalAmount: totalAmount,
            finalAmount
        })

    } catch (error) {
        console.log("❌ Error in validatePromoCode: ", error);
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Create promo code (Admin only)
const createPromoCode = async (req, res) => {
    try {
        const { code, description, discountType, discountValue, minPurchaseAmount, maxDiscountAmount, startDate, endDate, usageLimit } = req.body

        // Validate required fields
        if (!code || !discountType || !discountValue || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            })
        }

        // Validate discount type
        if (!["percentage", "fixed"].includes(discountType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid discount type. Must be 'percentage' or 'fixed'"
            })
        }

        // Validate dates
        const start = new Date(startDate)
        const end = new Date(endDate)
        if (end <= start) {
            return res.status(400).json({
                success: false,
                message: "End date must be after start date"
            })
        }

        // Validate discount value
        if (discountType === "percentage" && (discountValue < 0 || discountValue > 100)) {
            return res.status(400).json({
                success: false,
                message: "Percentage discount must be between 0 and 100"
            })
        }

        if (discountType === "fixed" && discountValue < 0) {
            return res.status(400).json({
                success: false,
                message: "Fixed discount must be greater than 0"
            })
        }

        // Check if code already exists
        const existingCode = await PromoCodeModel.findOne({ code: code.toUpperCase().trim() })
        if (existingCode) {
            return res.status(400).json({
                success: false,
                message: "Promo code already exists"
            })
        }

        const promoCode = await PromoCodeModel.create({
            code: code.toUpperCase().trim(),
            description: description || "",
            discountType,
            discountValue,
            minPurchaseAmount: minPurchaseAmount || 0,
            maxDiscountAmount: maxDiscountAmount || null,
            startDate: start,
            endDate: end,
            usageLimit: usageLimit || null
        })

        res.status(201).json({
            success: true,
            message: "Promo code created successfully",
            promoCode
        })

    } catch (error) {
        console.log("❌ Error in createPromoCode: ", error);
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Get all promo codes (Admin only)
const getAllPromoCodes = async (req, res) => {
    try {
        const promoCodes = await PromoCodeModel.find().sort({ createdAt: -1 })
        
        res.json({
            success: true,
            count: promoCodes.length,
            promoCodes
        })
    } catch (error) {
        console.log("❌ Error in getAllPromoCodes: ", error);
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Update promo code (Admin only)
const updatePromoCode = async (req, res) => {
    try {
        const { id } = req.params
        const updateData = req.body

        // If code is being updated, check for duplicates
        if (updateData.code) {
            const existingCode = await PromoCodeModel.findOne({ 
                code: updateData.code.toUpperCase().trim(),
                _id: { $ne: id }
            })
            if (existingCode) {
                return res.status(400).json({
                    success: false,
                    message: "Promo code already exists"
                })
            }
            updateData.code = updateData.code.toUpperCase().trim()
        }

        const promoCode = await PromoCodeModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        )

        if (!promoCode) {
            return res.status(404).json({
                success: false,
                message: "Promo code not found"
            })
        }

        res.json({
            success: true,
            message: "Promo code updated successfully",
            promoCode
        })

    } catch (error) {
        console.log("❌ Error in updatePromoCode: ", error);
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Delete promo code (Admin only)
const deletePromoCode = async (req, res) => {
    try {
        const { id } = req.params

        const promoCode = await PromoCodeModel.findByIdAndDelete(id)

        if (!promoCode) {
            return res.status(404).json({
                success: false,
                message: "Promo code not found"
            })
        }

        res.json({
            success: true,
            message: "Promo code deleted successfully"
        })

    } catch (error) {
        console.log("❌ Error in deletePromoCode: ", error);
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    validatePromoCode,
    createPromoCode,
    getAllPromoCodes,
    updatePromoCode,
    deletePromoCode
}
