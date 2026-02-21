const CartModel = require('../models/cart.model')
const ProductModel = require('../models/product.model')

const getCart = async (req, res) => {
    try {
        const userId = req.userId;
        const cart = await CartModel.findOne({ userId }).populate("items.productId");
        if (!cart) {
            return res.status(404).json({
                success: false,
                cart: []
            })
        }
        res.status(200).json({ success: true, cart })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const addToCart = async (req, res) => {
    try {
        const userId = req.userId;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User ID is missing. Please ensure you are authenticated."
            })
        }
        
        const { productId } = req.body;
        
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            })
        }

        // Check if product exists
        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }
        // find the user's cart (if exists)
        let cart = await CartModel.findOne({ userId });

        // if cart doesn't exist, create a new cart
        if (!cart) {
            cart = new CartModel({
                userId: userId,
                items: [{ productId, quantity: 1, price: product.productPrice }],
                totalPrice: product.productPrice
            });
        }
        else {
            // Find if product is already in cart
            const itemIndex = cart.items.findIndex
                (item => item.productId.toString() === productId);
            if (itemIndex > -1) {
                // if product exists -> just increase the quantity
                cart.items[itemIndex].quantity += 1;
            }
            else {
                // if new product -> add to cart
                cart.items.push({
                    productId,
                    quantity: 1,
                    price: product.productPrice
                })
            }

            // Recalculate the total price
            cart.totalPrice = cart.items.reduce(
                (acc, item) => acc + item.price * item.quantity, 0
            )
        }

        await cart.save();

        // Populated product details before sending response
        const populatedCart = await CartModel.findById(cart._id).populate("items.productId");

        res.status(200).json({
            success: true,
            message: "Product added to cart successfully",
            cart: populatedCart
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updateQuantity = async (req, res) => {
    try {
        const userId = req.userId;
        const { productId, type } = req.body;

        let cart = await CartModel.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            })
        }
        const item = cart.items.find(item => item.productId.toString() === productId);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart"
            })
        }
        if (type === "increment") {
            item.quantity += 1;
        }
        else if (type === "decrement" && item.quantity > 1) {
            item.quantity -= 1;
        }

        cart.totalPrice = cart.items.reduce(
            (acc, item) => acc + item.price * item.quantity, 0
        )
        await cart.save();
        cart = await cart.populate("items.productId");

        res.status(200).json({
            success: true,
            message: "Quantity updated successfully",
            cart
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const removeFromCart = async (req, res) => {
    try {
        const userId = req.userId;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            })
        }

        let cart = await CartModel.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            })
        }
        
        // Filter out the item to remove
        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        
        // Recalculate total price
        cart.totalPrice = cart.items.reduce(
            (acc, item) => acc + item.price * item.quantity, 0
        )
        
        await cart.save();
        
        // Populate product details before sending response
        const populatedCart = await CartModel.findById(cart._id).populate("items.productId");
        
        res.status(200).json({
            success: true,
            message: "Item removed from cart successfully",
            cart: populatedCart
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { getCart, addToCart, updateQuantity, removeFromCart }