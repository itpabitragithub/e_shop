const express = require('express')
const router = express.Router()

const { createOrder, verifyPayment, getMyOrders, getAllOrdersAdmin, getUserOrders, getSalesData } = require('../controllers/order.controller')
const { isAdmin, isAuthenticated, isUser } = require('../middleware/isAuthenticated')

router.post('/create-order', isAuthenticated, isUser, createOrder)
router.post('/verify-payment', isAuthenticated, isUser, verifyPayment)
router.get('/myorder', isAuthenticated, isUser, getMyOrders)
router.get('/all', isAuthenticated, isAdmin, getAllOrdersAdmin)
router.get('/user-order/:userId', isAuthenticated, isAdmin, getUserOrders)
router.get('/sales', isAuthenticated, isAdmin, getSalesData)

module.exports = router