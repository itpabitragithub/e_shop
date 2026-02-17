const express = require('express')
const router = express.Router()

const { createOrder, verifyPayment } = require('../controllers/order.controller')
const { isAuthenticated } = require('../middleware/isAuthenticated')

router.post('/create-order', isAuthenticated, createOrder)
router.post('/verify-payment', isAuthenticated, verifyPayment)

module.exports = router