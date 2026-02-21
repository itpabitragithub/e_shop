import { ShoppingCart, User, ChevronDown } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react'
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
    const userType = user?.user_type ?? (user?.role === 'ADMIN' ? 'admin' : 'user')
    const isAdmin = userType === 'admin'
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [profileOpen, setProfileOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const logoutHandler = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {}, {
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
            <div className='max-w-7xl mx-auto flex items-center justify-between py-2'>
                {/* logo section */}
                <div>
                    <Link to={"/"} className='flex items-center gap-2 hover:opacity-80 transition-opacity'>
                        {/* <img src="/cart.png" alt="E-SHOP Logo" className='w-[50px] h-[50px] object-contain' />  */}
                        <span className='text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-700 bg-clip-text text-transparent tracking-wide'>
                            E-Shop
                        </span>
                    </Link>
                </div>
                {/* navigation links */}
                <nav className='flex items-center gap-6'>
                    {!isAdmin && (
                        <>
                            <ul className='flex items-center gap-8 text-base font-semibold text-gray-700'>
                                <Link to={"/"}><li>Home</li></Link>
                                <Link to={"/products"}><li>Products</li></Link>
                                {user && <Link to={"/orders"}><li>Orders</li></Link>}
                            </ul>
                            <Link to={"/cart"} className='relative'>
                                <ShoppingCart />
                                <span className='absolute -top-3 -right-5 bg-pink-500 text-white rounded-full px-2'>{cart?.items?.length || 0}</span>
                            </Link>
                            {user && (
                                <div className='relative' ref={dropdownRef}>
                                    <button
                                        onClick={() => setProfileOpen((prev) => !prev)}
                                        className='flex items-center gap-1 p-1.5 rounded-full hover:bg-purple-200/60 transition-colors'
                                        aria-expanded={profileOpen}
                                        aria-haspopup="true"
                                    >
                                        <User className='w-6 h-6 text-gray-700' />
                                        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {profileOpen && (
                                        <div className='absolute right-0 mt-2 w-40 py-1 bg-white rounded-lg shadow-lg border border-gray-100 z-30'>
                                            <Link
                                                to={`/profile/${user._id}`}
                                                onClick={() => setProfileOpen(false)}
                                                className='block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50'
                                            >
                                                Profile
                                            </Link>
                                            <button
                                                onClick={() => { setProfileOpen(false); logoutHandler(); }}
                                                className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50'
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                    {user && isAdmin && (
                        <div className='relative' ref={dropdownRef}>
                            <button
                                onClick={() => setProfileOpen((prev) => !prev)}
                                className='flex items-center gap-1 p-1.5 rounded-full hover:bg-purple-200/60 transition-colors'
                                aria-expanded={profileOpen}
                                aria-haspopup="true"
                            >
                                <User className='w-6 h-6 text-gray-700' />
                                <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {profileOpen && (
                                <div className='absolute right-0 mt-2 w-40 py-1 bg-white rounded-lg shadow-lg border border-gray-100 z-30'>
                                    <Link
                                        to={`/profile/${user._id}`}
                                        onClick={() => setProfileOpen(false)}
                                        className='block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50'
                                    >
                                        Profile
                                    </Link>
                                    <button
                                        onClick={() => { setProfileOpen(false); logoutHandler(); }}
                                        className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50'
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    {!user && (
                        <Button
                            onClick={() => navigate('/login')}
                            className='bg-gradient-to-tl from-purple-500 to-purple-800 hover:from-purple-600 hover:to-purple-900 transition-colors ml-4'
                        >
                            Login
                        </Button>
                    )}
                </nav>
            </div>
        </header>
    )
}

export default Navbar