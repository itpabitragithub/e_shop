const express = require('express')
const router = express.Router()

const { createOrder, verifyPayment, getMyOrders, getAllOrdersAdmin, getUserOrders, getSalesData } = require('../controllers/order.controller')
const { isAdmin, isAuthenticated } = require('../middleware/isAuthenticated')

router.post('/create-order', isAuthenticated, createOrder)
router.post('/verify-payment', isAuthenticated, verifyPayment)
router.get('/myorder', isAuthenticated, getMyOrders)
router.get('/all', isAuthenticated, isAdmin, getAllOrdersAdmin)
router.get('/user-order/:userId', isAuthenticated, isAdmin, getUserOrders)
router.get('/sales', isAuthenticated, isAdmin, getSalesData)

module.exports = router