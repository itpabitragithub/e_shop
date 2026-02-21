const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: [true, "Product ID is required"],
                validate: {
                    validator: function(v) {
                        return v != null && mongoose.Types.ObjectId.isValid(v);
                    },
                    message: "Product ID must be a valid ObjectId"
                }
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
                min: [1, "Quantity must be at least 1"]
            },
            price: {
                type: Number,
                required: true,
                min: [0, "Price cannot be negative"]
            }
        }
    ],
    totalPrice: {
        type: Number,
        default: 0,
        min: [0, "Total price cannot be negative"]
    }

}, {
    timestamps: true
})

const CartModel = mongoose.model('Cart', cartSchema)

// Static method to clean up incorrect indexes
CartModel.cleanupIndexes = async function() {
    try {
        if (!mongoose.connection.readyState) {
            console.log('Database not connected. Skipping index cleanup.');
            return;
        }

        const collection = mongoose.connection.collection('carts');
        const indexes = await collection.indexes();
        
        // Drop any unique index on productId (should not exist at root level)
        for (const index of indexes) {
            if (index.name === 'productId_1' || 
                (index.key && index.key.productId === 1 && index.unique === true && !index.key.userId)) {
                try {
                    await collection.dropIndex(index.name);
                    console.log(`✓ Dropped incorrect index: ${index.name}`);
                } catch (err) {
                    if (err.code !== 27) { // 27 = IndexNotFound
                        console.error(`Error dropping index ${index.name}:`, err.message);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error during index cleanup:', error.message);
    }
}

module.exports = CartModel