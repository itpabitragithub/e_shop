const UserModel = require('../models/user.model')
const jwt = require('jsonwebtoken')

// Resolve user_type from user (handles legacy users)
const resolveUserType = (user) => {
    if (user.user_type) return user.user_type
    return user.role === 'ADMIN' ? 'admin' : 'user'
}

const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "Authorization token is missing or invalid"
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
                    message: "The registered Token has expired"
                })
            }
            return res.status(401).json({
                success: false,
                message: "Access token is missing or invalid"
            })
        }

        const user = await UserModel.findById(decoded.id)
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            })
        }
        if (!user.isLoggedIn) {
            return res.status(401).json({ success: false, message: "User is not logged in" })
        }

        req.user = user
        req.userId = user._id
        req.user_type = decoded.user_type || resolveUserType(user)
        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message
        })
    }
}

/** Require user_type to be one of allowed types: 'user' | 'admin' */
const requireUserType = (...allowedTypes) => {
    return (req, res, next) => {
        const userType = req.user_type || resolveUserType(req.user)
        if (allowedTypes.includes(userType)) {
            return next()
        }
        return res.status(403).json({
            success: false,
            message: `Access denied. Required: ${allowedTypes.join(' or ')}`
        })
    }
}

/** Require admin (user_type === 'admin' or legacy role === 'ADMIN') */
const isAdmin = (req, res, next) => {
    const userType = req.user_type || resolveUserType(req.user)
    if (userType === 'admin') {
        return next()
    }
    return res.status(403).json({
        success: false,
        message: "Access denied: admins only"
    })
}

/** Require user (user_type === 'user') - for user-only routes */
const isUser = (req, res, next) => {
    const userType = req.user_type || resolveUserType(req.user)
    if (userType === 'user') {
        return next()
    }
    return res.status(403).json({
        success: false,
        message: "Access denied: user account required"
    })
}

module.exports = { isAuthenticated, isAdmin, isUser, requireUserType, resolveUserType }
