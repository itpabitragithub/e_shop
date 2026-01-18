const express = require('express')
const { register, verify, reVerify, login, logout } = require('../controllers/user.controller')

const router = express.Router()

router.post('/register', register)
router.post('/verify', verify)
router.post('/reverify', reVerify)
router.post('/login', login)
// router.post('/logout', logout)

module.exports = router