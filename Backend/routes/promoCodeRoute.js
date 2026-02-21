const express = require('express')
const router = express.Router()

const { 
    validatePromoCode, 
    createPromoCode, 
    getAllPromoCodes, 
    updatePromoCode, 
    deletePromoCode 
} = require('../controllers/promoCode.controller')
const { isAdmin, isAuthenticated, isUser } = require('../middleware/isAuthenticated')

// User routes
router.post('/validate', isAuthenticated, isUser, validatePromoCode)

// Admin routes
router.post('/create', isAuthenticated, isAdmin, createPromoCode)
router.get('/all', isAuthenticated, isAdmin, getAllPromoCodes)
router.put('/update/:id', isAuthenticated, isAdmin, updatePromoCode)
router.delete('/delete/:id', isAuthenticated, isAdmin, deletePromoCode)

module.exports = router
