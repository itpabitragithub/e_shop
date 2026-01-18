const express = require('express')
const { register, verify, reVerify, login, logout, forgotPassword, verifyOTP, changePassword, allUsers} = require('../controllers/user.controller')
const isAuthenticated = require('../middleware/isAuthenticated')

const router = express.Router()

router.post('/register', register)
router.post('/verify', verify)
router.post('/reverify', reVerify)
router.post('/login', login)
router.post('/logout', isAuthenticated, logout)
router.post('/forgot-password', forgotPassword)
router.post('/verify-otp/:email', verifyOTP)
router.post('/change-password/:email', changePassword)
router.get('/all-users', allUsers)

module.exports = router