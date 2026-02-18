import { ShoppingCart } from 'lucide-react';
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/button';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { clearUser } from '../redux/userSlice';

function Navbar() {
    const {cart} = useSelector((store) => store.product);
    const {user} = useSelector((store) => store.user);
    const token = localStorage.getItem('token');
    const admin = user?.role === 'ADMIN' ? true : false
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const logoutHandler = async () => {
        try {
            const response = await axios.post(`http://localhost:3000/api/user/logout`,{},{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if(response.data.success){ 
                dispatch(clearUser());
                toast.success(response.data.message);
            }
        } catch (error) {
            console.log(error);
            // Even if logout fails, clear local state
            dispatch(clearUser());
        }
    }
    return (
        <header className='bg-purple-100 fixed w-full z-20 border-b border-gray-200'>
            <div className='max-w-7xl mx-auto flex items-center justify-between py-0.5 px-1'>
                {/* logo section */}
                <div>
                    <Link to={"/"}>
                        <img src="/cart.png" alt="" className='w-[80px]' /> 
                    </Link>
                </div>
                {/* navigation links */}
                <nav className='flex items-center gap-6'>
                    <ul className='flex items-center gap-7 text-base font-semibold text-gray-700'>
                        <Link to={"/"}><li>Home</li></Link>
                        <Link to={"/products"}><li>Products</li></Link>
                        {
                            user && <Link to={`/profile/${user._id}`}><li>Hello ,{user.firstName}</li></Link>
                        }
                        {
                            admin && <Link to={`/dashboard/sales`}><li>Dashboard</li></Link>
                        }
                    </ul>
                    <Link to={"/cart"} className='relative'>
                        <ShoppingCart />
                        <span className='absolute -top-3 -right-5 bg-purple-500 text-white rounded-full px-2'>{cart?.items?.length || 0}</span>
                    </Link>
                    {
                        user ? 
                            <Button 
                                onClick={logoutHandler}
                                className='bg-purple-500 text-white cursor-pointer hover:bg-purple-600 transition-colors'
                            >
                                Logout
                            </Button>
                         : 
                                <Button
                                    onClick={() => navigate('/login')}
                                    className='bg-gradient-to-tl from-purple-500 to-purple-800 hover:from-purple-600 hover:to-purple-900 transition-colors'
                                >
                                    Login
                                </Button>
                    }
                </nav>
            </div>
        </header>
    )
}

export default Navbar