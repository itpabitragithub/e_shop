const UserModel = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const verifyEmail = require('../emailVerify/verifyEmail')

const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const existingUser = await UserModel.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            }) 
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await UserModel.create({
            firstName,
            lastName, 
            email,
            password: hashedPassword
        })
        const token = jwt.sign(
            {id: newUser._id},
            process.env.JWT_SECRET, 
            { expiresIn: '10m' }
        )
        await verifyEmail(token, email) // Send email to user to verify their email
        newUser.token = token
        await newUser.save()
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: newUser
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}



module.exports = { register}