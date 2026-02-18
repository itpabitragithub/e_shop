const express = require('express')
const router = express.Router()

const { createOrder, verifyPayment, getMyOrders } = require('../controllers/order.controller')
const { isAuthenticated } = require('../middleware/isAuthenticated')

router.post('/create-order', isAuthenticated, createOrder)
router.post('/verify-payment', isAuthenticated, verifyPayment)
router.get('/myorder', isAuthenticated, getMyOrders)

module.exports = router