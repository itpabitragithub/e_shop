const express = require('express')
const { isAuthenticated, isAdmin } = require('../middleware/isAuthenticated')
const { multipleUpload } = require('../middleware/multer')
const { addProduct, getAllProducts } = require('../controllers/product.controller')
const router = express.Router()


router.post('/add', isAuthenticated, isAdmin, multipleUpload, addProduct)
router.get('/getAllProducts', getAllProducts)

module.exports = router