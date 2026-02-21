/**
 * Create an admin user (for first-time setup)
 * Run: node scripts/createAdmin.js
 * Set ADMIN_EMAIL and ADMIN_PASSWORD in .env or pass as args
 */
require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const UserModel = require('../models/user.model')
const connectDB = require('../config/connectDB')

async function createAdmin() {
    const email = process.env.ADMIN_EMAIL || process.argv[2]
    const password = process.env.ADMIN_PASSWORD || process.argv[3]
    if (!email || !password) {
        console.error('Usage: node scripts/createAdmin.js <email> <password>')
        console.error('Or set ADMIN_EMAIL and ADMIN_PASSWORD in .env')
        process.exit(1)
    }
    await connectDB()
    const existing = await UserModel.findOne({ email })
    if (existing) {
        if (existing.user_type === 'admin' || existing.role === 'ADMIN') {
            console.log('Admin already exists for:', email)
        } else {
            existing.user_type = 'admin'
            existing.role = 'SUPER_ADMIN'
            await existing.save()
            console.log('Updated user to admin:', email)
        }
    } else {
        const hashed = await bcrypt.hash(password, 10)
        await UserModel.create({
            firstName: 'Admin',
            lastName: 'User',
            email,
            password: hashed,
            user_type: 'admin',
            role: 'SUPER_ADMIN',
            verify_email: true
        })
        console.log('Admin created:', email)
    }
    process.exit(0)
}

createAdmin().catch((err) => {
    console.error(err)
    process.exit(1)
})
