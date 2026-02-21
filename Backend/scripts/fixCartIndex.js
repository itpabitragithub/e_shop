/**
 * Script to fix the incorrect unique index on productId in carts collection
 * Run this script if you encounter: "E11000 duplicate key error collection: test.carts index: productId_1"
 * 
 * Usage: node scripts/fixCartIndex.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

const fixCartIndex = async () => {
    try {
        // Connect to MongoDB
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in .env file');
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('✓ Connected to MongoDB');

        const collection = mongoose.connection.collection('carts');
        
        // Get all indexes
        const indexes = await collection.indexes();
        console.log('\nCurrent indexes on carts collection:');
        indexes.forEach(index => {
            console.log(`  - ${index.name}:`, JSON.stringify(index.key), index.unique ? '(unique)' : '');
        });

        // Find and drop incorrect unique index on productId
        let foundIncorrectIndex = false;
        for (const index of indexes) {
            if (index.name === 'productId_1' || 
                (index.key && index.key.productId === 1 && index.unique === true && !index.key.userId)) {
                try {
                    console.log(`\n⚠ Found incorrect index: ${index.name}`);
                    await collection.dropIndex(index.name);
                    console.log(`✓ Successfully dropped index: ${index.name}`);
                    foundIncorrectIndex = true;
                } catch (err) {
                    if (err.code === 27) { // IndexNotFound
                        console.log(`  Index ${index.name} already removed`);
                    } else {
                        console.error(`  Error dropping index ${index.name}:`, err.message);
                    }
                }
            }
        }

        if (!foundIncorrectIndex) {
            console.log('\n✓ No incorrect indexes found. Database is clean.');
        }

        // Clean up any carts with null productId in items
        console.log('\nCleaning up carts with invalid productId...');
        const result = await collection.updateMany(
            { 'items.productId': null },
            { $pull: { items: { productId: null } } }
        );
        
        if (result.modifiedCount > 0) {
            console.log(`✓ Cleaned up ${result.modifiedCount} cart(s) with null productId`);
        } else {
            console.log('✓ No carts with null productId found');
        }

        // Recalculate totalPrice for all carts
        const carts = await collection.find({}).toArray();
        let updatedCount = 0;
        for (const cart of carts) {
            if (cart.items && cart.items.length > 0) {
                const newTotalPrice = cart.items.reduce((sum, item) => {
                    return sum + (item.price || 0) * (item.quantity || 0);
                }, 0);
                
                if (cart.totalPrice !== newTotalPrice) {
                    await collection.updateOne(
                        { _id: cart._id },
                        { $set: { totalPrice: newTotalPrice } }
                    );
                    updatedCount++;
                }
            } else if (cart.totalPrice !== 0) {
                await collection.updateOne(
                    { _id: cart._id },
                    { $set: { totalPrice: 0 } }
                );
                updatedCount++;
            }
        }
        
        if (updatedCount > 0) {
            console.log(`✓ Recalculated totalPrice for ${updatedCount} cart(s)`);
        }

        console.log('\n✓ Index cleanup completed successfully!');
        console.log('You can now restart your server and try adding items to cart again.\n');

    } catch (error) {
        console.error('✗ Error:', error.message);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('✓ Database connection closed');
    }
};

// Run the script
fixCartIndex();
