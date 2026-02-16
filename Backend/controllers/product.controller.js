const ProductModel = require("../models/product.model");
const cloudinary = require("../utlis/cloudinary");
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

        // Convert productPrice from string to number (remove commas if present)
        // const price = typeof productPrice === 'string' 
        //     ? parseFloat(productPrice.replace(/,/g, '')) 
        //     : Number(productPrice);

        // if (isNaN(price)) {

        //     return res.status(400).json({
        //         success: false,
        //         message: "Invalid product price"
        //     })
        // }



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
                    public_id: result.public_id,
                    // cloudinary_id: result.public_id
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
        if (!products) {
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

const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params
        const product = await ProductModel.findById(productId)
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        //Delete product images from cloudinary
        if (product.productImg && product.productImg.length > 0) {
            for (let img of product.productImg) {
                const result = await cloudinary.uploader.destroy(img.public_id)

            }
        }
        //Delete product from db
        await ProductModel.findByIdAndDelete(productId)
        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getSingleProduct = async (req, res) => {
    try {
        const { productId } = req.params
        const product = await ProductModel.findById(productId)
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            product: product
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params
        const { productName, productDesc, productPrice, category, brand, existingImages } = req.body
        const product = await ProductModel.findById(productId)
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        let updatedImages = [];

        //keep selected old images
        if (existingImages) {
            const keepIds = json.parse(existingImages);
            updatedImages = product.productImg.filter(img => keepIds.includes(img.public_id));

            //delete only removed images
            const removeImages = product.productImg.filter(img => !keepIds.includes(img.public_id));
            for (let img of removeImages) {
                const result = await cloudinary.uploader.destroy(img.public_id);
            }
        } else {
            updatedImages = product.productImg;
        }

        //handle new images
        if(req.files && req.files.length > 0){
            for(let file of req.files){
                const fileUri = getDataUri(file);
                const result = await cloudinary.uploader.upload(fileUri, {
                    folder: "mern_products"
                });
                updatedImages.push({
                    url: result.secure_url,
                    public_id: result.public_id,
                });
            }
        }

        //update product in db
        product.productName = productName;
        product.productDesc = productDesc;
        product.productPrice = productPrice;
        product.category = category;
        product.brand = brand;
        product.productImg = updatedImages;
        await product.save();
        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product: product
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
    getAllProducts,
    getSingleProduct,
    deleteProduct,
    updateProduct
}