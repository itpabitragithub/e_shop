import { createSlice } from "@reduxjs/toolkit"

// Load cart from localStorage on initialization
const loadCartFromStorage = () => {
    try {
        const cartStr = localStorage.getItem('cart');
        return cartStr ? JSON.parse(cartStr) : null;
    } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        return null;
    }
};

const productSlice = createSlice({
    name: "product",
    initialState: {
        products: [],
        cart: loadCartFromStorage() || { items: [], totalPrice: 0 },
    },
    reducers: {
        //Action
        setProducts: (state, action) => {
            state.products = action.payload
        },
        setCart: (state, action) => {
            state.cart = action.payload
            // Persist to localStorage
            if (action.payload) {
                localStorage.setItem('cart', JSON.stringify(action.payload));
            } else {
                localStorage.removeItem('cart');
            }
        }
    }
})
export const { setProducts, setCart } = productSlice.actions
export default productSlice.reducer