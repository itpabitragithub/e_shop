import { createSlice } from "@reduxjs/toolkit";

// Load user from localStorage on initialization
const loadUserFromStorage = () => {
    try {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
        console.error('Error loading user from localStorage:', error);
        return null;
    }
};

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: loadUserFromStorage(),
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            // Persist to localStorage
            if (action.payload) {
                localStorage.setItem('user', JSON.stringify(action.payload));
            } else {
                localStorage.removeItem('user');
            }
        },
        clearUser: (state) => {
            state.user = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
    }
})

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;