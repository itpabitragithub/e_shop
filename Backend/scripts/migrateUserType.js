/**
 * Migration script: Add user_type to existing users
 * Run: node scripts/migrateUserType.js
 */
require('dotenv').config()
const mongoose = require('mongoose')
const UserModel = require('../models/user.model')
const connectDB = require('../config/connectDB')

async function migrate() {
    await connectDB()
    const users = await UserModel.find({ user_type: { $exists: false } })
    for (const u of users) {
        u.user_type = u.role === 'ADMIN' ? 'admin' : 'user'
        if (u.role === 'USER') u.role = 'CUSTOMER'
        await u.save()
    }
    console.log('Migration complete. Updated', users.length, 'users.')
    process.exit(0)
}

migrate().catch((err) => {
    console.error(err)
    process.exit(1)
})
