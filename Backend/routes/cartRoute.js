const express = require('express')
const { isAuthenticated, isUser } = require('../middleware/isAuthenticated')
const { getCart, addToCart, updateQuantity, removeFromCart } = require('../controllers/cart.controller')
const router = express.Router()


router.get('/', isAuthenticated, isUser, getCart)
router.post('/add', isAuthenticated, isUser, addToCart)
router.put('/update', isAuthenticated, isUser, updateQuantity)
router.delete('/remove', isAuthenticated, isUser, removeFromCart)

module.exports = router 