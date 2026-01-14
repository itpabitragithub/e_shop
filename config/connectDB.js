const mongoose = require('mongoose')
require('dotenv').config()

if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined');
}

const connectDB = async () => { 
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log("MongoDB connection error: ".error);
        process.exit(1);
    }
}
 
module.exports = connectDB; 
  