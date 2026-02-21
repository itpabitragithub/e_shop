/**
 * One-time script to drop the stale orderId_1 unique index
 * that causes E11000 duplicate key errors when creating orders.
 * Run: node scripts/drop-orderId-index.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const mongoose = require('mongoose')
const OrderModel = require('../models/order.model')

async function dropOrderIdIndex() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to MongoDB')

        const indexes = await OrderModel.collection.getIndexes()
        if (indexes.orderId_1) {
            await OrderModel.collection.dropIndex('orderId_1')
            console.log('✓ Dropped orderId_1 index successfully')
        } else {
            console.log('Index orderId_1 does not exist (already removed or never created)')
        }
    } catch (error) {
        if (error.codeName === 'IndexNotFound' || error.message?.includes('index not found')) {
            console.log('Index orderId_1 already removed')
        } else {
            console.error('Error:', error.message)
            process.exit(1)
        }
    } finally {
        await mongoose.disconnect()
        console.log('Disconnected from MongoDB')
        process.exit(0)
    }
}

dropOrderIdIndex()
