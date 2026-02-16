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
        addresses: [],
        selectedAddress: null // currently chosen address
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
        },
        // Address Management
        addAddress: (state, action) => {
            if(!state.addresses) state.addresses=[];
            state.addresses.push(action.payload);
        },

        setSelectedAddress: (state, action) => {
            state.selectedAddress = action.payload;
        },

        // Delete Address
        deleteAddress: (state, action) => {
            const indexToDelete = action.payload;
            
            //Reset selected address if deleted address is the selected one
            if(state.addresses[indexToDelete] === state.selectedAddress) {
                state.selectedAddress = null;
            }
            
            state.addresses = state.addresses.filter((address, index) => index !== indexToDelete);
        }
    }
})
export const { setProducts, setCart, addAddress, setSelectedAddress, deleteAddress } = productSlice.actions
export default productSlice.reducer