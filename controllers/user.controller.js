const UserModel = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const verifyEmail = require('../emailVerify/verifyEmail')
const SessionModel = require('../models/session.model')
const sendOTPMail = require('../emailVerify/sendOTPMail')

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
            { id: newUser._id },
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

const verify = async (req, res) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }
        const token = authHeader.split(' ')[1]
        let decoded
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET)
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: "Token expired"
                })
            }
            return res.status(401).json({
                success: false,
                message: "Token verification failed"
            })

        }
        const user = await UserModel.findById(decoded.id)
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            })
        }
        user.token = null
        user.verify_email = true
        await user.save()
        return res.status(200).json({
            success: true,
            message: "Email verified successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

const reVerify = async (req, res) => {
    try {
        const { email } = req.body
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '10m' }
        )
        await verifyEmail(token, email) // Send email to user to verify their email
        user.token = token
        await user.save()
        return res.status(200).json({
            success: true,
            message: "Email verification link sent again successfully",
            token: user.token
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            })
        }
        if (!user.verify_email) {
            return res.status(400).json({
                success: false,
                message: "Verify your account than login"
            })
        }
        // generate refresh token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '10d' }
        )
        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        )
        user.isLoggedIn = true
        await user.save()

        // check for existing session and delete it
        const existingSession = await SessionModel.findOne({ userId: user._id })
        if (existingSession) {
            await SessionModel.deleteOne({ userId: user._id })
        }

        // create new session
        await SessionModel.create({ userId: user._id })
        return res.status(200).json({
            success: true,
            message: `Welcome back ${user.firstName}`,
            accessToken: user,
            token: token,
            refreshToken: refreshToken
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

const logout = async (req, res) => {
    try {
        const userId = req.userId
        await SessionModel.deleteOne({ userId: userId })
        await UserModel.findByIdAndUpdate(userId, { isLoggedIn: false })
        return res.status(200).json({
            success: true,
            message: "Logout successful" })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error", 
            error: error.message
        })
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(400).json({ 
                success: false,
                message: "User not found" })
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const otp_expires = Date.now() + 10 * 60 * 1000 // 10 minutes
        user.otp = otp
        user.otp_expires = otp_expires

        await user.save()
        await sendOTPMail(otp, email)
        
        return res.status(200).json({
            success: true,
            message: "OTP sent to email successfully"
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}
   
const verifyOTP = async (req, res) => {
    try {
        const {otp} = req.body
        const email = req.params.email
        if(!otp){
            return res.status(400).json({
                success: false,
                message: "OTP is required"
            })
        }
        const user = await UserModel.findOne({ email })
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        if(!user.otp || !user.otp_expires){
            return res.status(400).json({ 
                success: false, 
                message: "Otp is not generated or already verified" 
            })
        }
        if(user.otp_expires < Date.now()){
            return res.status(400).json({
                success: false,
                message: "OTP has expired please generate a new one"
            })
        }
        if(user.otp !== otp){
            return res.status(400).json({
                 success: false, 
                 message: "Invalid OTP" })
        }
        user.otp = null
        user.otp_expires = null
        await user.save()
        return res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        })
    }
    
    catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

const changePassword = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                success: false,
                error: "Request body is missing. Please send JSON data with 'newPassword' and 'confirmPassword' fields."
            })
        }
        const { newPassword, confirmPassword } = req.body
        const {email} = req.params
        const user = await UserModel.findOne({ email })
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        if(!newPassword || !confirmPassword){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        if(newPassword !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            })
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        await user.save()
        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

const allUsers = async (req, res) => {
    try {
        const users = await UserModel.find()
        return res.status(200).json({
            success: true,
            users: users
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}
    


module.exports = { register, verify, reVerify, login, logout, forgotPassword, verifyOTP, changePassword, allUsers }