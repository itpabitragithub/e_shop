const express = require('express')
const { register, verify, reVerify, login, logout, forgotPassword, verifyOTP, changePassword, allUsers, getUserDetails, updateUser} = require('../controllers/user.controller')
const {isAuthenticated, isAdmin} = require('../middleware/isAuthenticated')
const { singleUpload } = require('../middleware/multer')

const router = express.Router()


router.post('/register', register)
router.post('/verify', verify)
router.post('/reverify', reVerify)
router.post('/login', login)
router.post('/logout', isAuthenticated, logout)
router.post('/forgot-password', forgotPassword)
router.post('/verify-otp/:email', verifyOTP)
router.post('/change-password/:email', changePassword)
router.get('/all-users',isAuthenticated, isAdmin, allUsers)
router.get('/user-details/:userId', getUserDetails)
router.put('/update/:id', isAuthenticated, singleUpload, updateUser)

module.exports = router