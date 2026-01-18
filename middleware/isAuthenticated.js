const UserModel = require('../models/user.model')
const jwt = require('jsonwebtoken')

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
        }
        catch (error) {
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
        next()
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message
        })
    }
}

const isAdmin = async (req, res, next) => {
    if (req.user && req.user.role === "ADMIN") {
        next()
    }
    else {
        return res.status(401).json({
            success: false,
            message: "Access denied: admins only"
        })
    }
}

module.exports = { isAuthenticated, isAdmin }