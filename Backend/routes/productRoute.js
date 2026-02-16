const express = require('express')
const { isAuthenticated, isAdmin } = require('../middleware/isAuthenticated')
const { multipleUpload } = require('../middleware/multer')
const { addProduct, getAllProducts, getSingleProduct, deleteProduct, updateProduct } = require('../controllers/product.controller')
const router = express.Router()


router.post('/add', isAuthenticated, isAdmin, multipleUpload, addProduct)
router.get('/getAllProducts', getAllProducts)
router.get('/getSingleProduct/:productId', getSingleProduct)
router.delete('/delete/:productId', isAuthenticated, isAdmin, deleteProduct)
router.put('/update/:productId', isAuthenticated, isAdmin, multipleUpload, updateProduct)

module.exports = router