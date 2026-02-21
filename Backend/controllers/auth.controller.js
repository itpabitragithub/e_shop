const UserModel = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SessionModel = require('../models/session.model')

// Helper: resolve user_type from user (handles legacy users without user_type)
const resolveUserType = (user) => {
    if (user.user_type) return user.user_type
    return user.role === 'ADMIN' ? 'admin' : 'user'
}

/**
 * Unified login - user_type in body decides which flow
 * user_type: "user" | "admin"
 */
const login = async (req, res) => {
    try {
        const { email, password, user_type } = req.body
        if (!email || !password || !user_type) {
            return res.status(400).json({
                success: false,
                message: "Email, password and user_type are required"
            })
        }
        if (!['user', 'admin'].includes(user_type)) {
            return res.status(400).json({
                success: false,
                message: "user_type must be 'user' or 'admin'"
            })
        }

        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        // Migrate legacy users: set user_type if missing
        if (!user.user_type) {
            user.user_type = user.role === 'ADMIN' ? 'admin' : 'user'
            if (user.role === 'USER') user.role = 'CUSTOMER'
            await user.save()
        }

        const resolvedUserType = resolveUserType(user)

        if (resolvedUserType !== user_type) {
            return res.status(403).json({
                success: false,
                message: user_type === 'admin'
                    ? "Access denied. Use admin login."
                    : "Access denied. Use user login."
            })
        }

        if (user_type === 'user' && !user.verify_email) {
            return res.status(400).json({
                success: false,
                message: "Verify your account before login"
            })
        }

        const token = jwt.sign(
            { id: user._id, user_type: resolvedUserType },
            process.env.JWT_SECRET,
            { expiresIn: '10d' }
        )
        const refreshToken = jwt.sign(
            { id: user._id, user_type: resolvedUserType },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        )

        user.isLoggedIn = true
        await user.save()

        const existingSession = await SessionModel.findOne({ userId: user._id })
        if (existingSession) {
            await SessionModel.deleteOne({ userId: user._id })
        }
        await SessionModel.create({ userId: user._id })

        const userObj = user.toObject()
        userObj.user_type = resolvedUserType

        return res.status(200).json({
            success: true,
            message: `Welcome back ${user.firstName}`,
            accessToken: userObj,
            token,
            refreshToken,
            user_type: resolvedUserType
        })
    } catch (error) {
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
        await SessionModel.deleteOne({ userId })
        await UserModel.findByIdAndUpdate(userId, { isLoggedIn: false })
        return res.status(200).json({
            success: true,
            message: "Logout successful"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

module.exports = {
    login,
    logout,
    resolveUserType
}
