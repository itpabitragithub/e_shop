const ProductModel = require("../models/product.model");
const { cloudinary } = require("../utlis/cloudinary");
const getDataUri = require("../utlis/dataUri");
const addProduct = async (req, res) => {
    try {
        const { productName, productDesc, productPrice, category, brand } = req.body
        const userId = req.user._id

        if (!productName || !productDesc || !productPrice || !category || !brand) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        //Handle multiple images upload using multer
        let productImg = [];
        if (req.files && req.files.length > 0) {
            for (let file of req.files) {
                const fileUri = getDataUri(file)
                const result = await cloudinary.uploader.upload(fileUri, {
                    folder: "mern_products" //Cloudinary folder name
                })
                productImg.push({
                    url: result.secure_url,
                    public_id: result.public_id
                })
            }

        }

        //Create a product in db
        const newProduct = await ProductModel.create({
            userId,
            productName,
            productDesc,
            productPrice,
            category,
            brand,
            productImg,// array of objects
        })
        return res.status(201).json({
            success: true,
            message: "Product added successfully",
            product: newProduct
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
    
const getAllProducts = async (req, res) => {
    try {
        const products = await ProductModel.find()
        if(!products){
            return res.status(404).json({
                success: false,
                message: "No products found",
                products: []
            })
        }
        return res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            products: products
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



module.exports = {
    addProduct,
    getAllProducts
}