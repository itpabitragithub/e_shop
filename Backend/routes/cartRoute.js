const express = require('express')
const { isAuthenticated } = require('../middleware/isAuthenticated')
const { getCart, addToCart, updateQuantity, removeFromCart } = require('../controllers/cart.controller')
const router = express.Router()


router.get('/', isAuthenticated, getCart)
router.post('/add', isAuthenticated, addToCart)
router.put('/update', isAuthenticated, updateQuantity)
router.delete('/remove', isAuthenticated, removeFromCart)

module.exports = router 