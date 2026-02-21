const express = require('express')
const { login, logout } = require('../controllers/auth.controller')
const { isAuthenticated } = require('../middleware/isAuthenticated')

const router = express.Router()

// Auth routes - user_type in body for login
router.post('/login', login)
router.post('/logout', isAuthenticated, logout)

module.exports = router
