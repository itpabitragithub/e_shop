const mongoose = require('mongoose')

let isConnected = false

const connectDB = async () => {
  if (isConnected) {
    return
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false
    })

    isConnected = db.connections[0].readyState
    console.log('MongoDB Connected')

    // 👇 load model AFTER connection
    const CartModel = require('../models/cart.model')
    if (CartModel.cleanupIndexes) {
      await CartModel.cleanupIndexes()
    }

  } catch (error) {
    console.error("MongoDB connection error:", error.message)

    // ❌ DO NOT EXIT IN SERVERLESS
    // process.exit(1)
  }
}

module.exports = connectDB