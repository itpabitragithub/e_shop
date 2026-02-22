const mongoose = require('mongoose')
require('dotenv').config()

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        const err = new Error('MONGO_URI is not defined')
        console.error(err.message)
        throw err
    }
    try {
        if (mongoose.connection.readyState === 1) return
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to MongoDB')
        // Only run index cleanup when not on Vercel (avoids cold-start issues)
        if (!process.env.VERCEL) {
            const CartModel = require('../models/cart.model')
            await CartModel.cleanupIndexes()
        }
    } catch (error) {
        console.error('MongoDB connection error:', error.message)
        if (!process.env.VERCEL) process.exit(1)
        throw error
    }
}

module.exports = connectDB 
  