const mongoose = require('mongoose')

const promoCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    discountType: {
        type: String,
        enum: ["percentage", "fixed"],
        required: true
    },
    discountValue: {
        type: Number,
        required: true,
        min: 0
    },
    minPurchaseAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    maxDiscountAmount: {
        type: Number,
        default: null, // Only applicable for percentage discounts
        min: 0
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    usageLimit: {
        type: Number,
        default: null // null means unlimited usage
    },
    usedCount: {
        type: Number,
        default: 0
    },
    usedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
}, {
    timestamps: true
})

// Index for faster lookups
promoCodeSchema.index({ code: 1 })
promoCodeSchema.index({ isActive: 1, startDate: 1, endDate: 1 })

const PromoCodeModel = mongoose.model('PromoCode', promoCodeSchema)
module.exports = PromoCodeModel
