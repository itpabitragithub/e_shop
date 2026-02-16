import React from 'react'
import userLogo from '@/assets/user.png'
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Trash2, ShoppingCartIcon } from 'lucide-react';
import { setCart } from '@/redux/productSlice';
import axios from 'axios';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
    const {cart} = useSelector((store) => store.product);
    

    const subtotal = cart?.totalPrice;
    const shipping = subtotal > 299 ? 0 : 10;
    const tax = subtotal * 0.05;
    const total = subtotal + shipping + tax;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const API = "http://localhost:3000/api/cart";
    const accessToken = localStorage.getItem('token');

    const handleUpdateQuantity = async (productId, type) => {
        if (!accessToken) {
            toast.error('Please login to update cart');
            navigate('/login');
            return;
        }
        try {
            const response = await axios.put(`${API}/update`, { productId, type}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (response.data.success) {
                dispatch(setCart(response.data.cart));
                toast.success('Quantity updated successfully');
            }
        }
        catch (error) {
            console.error('Error updating quantity:', error);
            toast.error(error.response?.data?.message || 'Failed to update quantity');
        }
    }

    const removeFromCart = async (productId) => {
        if (!accessToken) {
            toast.error('Please login to remove items from cart');
            navigate('/login');
            return;
        }
        
        if (!productId) {
            toast.error('Product ID is missing');
            return;
        }
        
        try {
            const response = await axios.delete(`${API}/remove`, {
                data: { productId },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data.success) {
                // Update cart in Redux store
                if (response.data.cart) {
                    dispatch(setCart(response.data.cart));
                    toast.success('Item removed from cart');
                } else {
                    // If cart is empty or null, set empty cart
                    dispatch(setCart({ items: [], totalPrice: 0 }));
                    toast.success('Item removed from cart');
                }
            } else {
                toast.error('Failed to remove item from cart');
            }
        }
        catch (error) {
            console.error('Error removing item:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to remove item';
            toast.error(errorMessage);
        }
    }

  return (
    <div className='pt-20 bg-gray-100 min-h-screen overflow-x-hidden'>
        {
            cart?.items?.length > 0 ? (
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                    <h1 className='text-2xl font-bold text-gray-800 mb-7'>Shopping Cart</h1>
                    <div className='flex gap-7 flex-col lg:flex-row'>
                        <div className='flex flex-col gap-5 flex-1 min-w-0'>
                            {cart?.items?.map((item, index) => {
                                return <Card key={index} className='overflow-hidden'>
                                        <CardContent className='p-4 sm:p-6'>
                                            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                                                <div className='flex items-center gap-4 flex-1 min-w-0'>
                                                    <img 
                                                        src={item?.productId?.productImg?.[0]?.url || userLogo} 
                                                        alt={item?.productId?.productName} 
                                                        className='w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md flex-shrink-0' 
                                                    />
                                                    <div className='flex-1 min-w-0'>
                                                        <h1 className='font-semibold text-base sm:text-lg truncate'>{item?.productId?.productName}</h1>
                                                        <p className='text-gray-600 mt-1'>₹{item?.productId?.productPrice?.toLocaleString('en-IN')}</p>
                                                    </div>
                                                </div>
                                                <div className='flex items-center gap-3 sm:gap-5 w-full sm:w-auto justify-between sm:justify-start'>
                                                    <div className='flex items-center gap-3 sm:gap-4'>
                                                        <Button 
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleUpdateQuantity(item?.productId?._id, 'decrement')}
                                                            className='h-8 w-8 p-0'
                                                        >
                                                            <Minus className='w-4 h-4' />
                                                        </Button>
                                                        <span className='font-medium min-w-[2rem] text-center'>{item?.quantity}</span>
                                                        <Button 
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleUpdateQuantity(item?.productId?._id, 'increment')}
                                                            className='h-8 w-8 p-0'
                                                        >
                                                            <Plus className='w-4 h-4' />
                                                        </Button>
                                                    </div>
                                                    <div className='flex items-center gap-4'>
                                                        <p className='font-semibold text-base sm:text-lg min-w-[80px] text-right'>
                                                            ₹{((item?.productId?.productPrice) * (item?.quantity))?.toLocaleString('en-IN')}
                                                        </p>
                                                        <Button 
                                                            type="button"
                                                            size="sm"
                                                            variant="ghost"
                                                            className='text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0'
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                removeFromCart(item?.productId?._id);
                                                            }}
                                                            aria-label="Remove item from cart"
                                                        >
                                                            <Trash2 className='w-4 h-4' />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                </Card>
                            })}
                        </div>
                        <div className='lg:sticky lg:top-24 lg:h-fit'>
                            <Card className='w-full lg:w-[400px]'>
                                <CardHeader>
                                    <CardTitle>Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className='space-y-4'>
                                    <div className='flex justify-between'>
                                        <span>Subtotal ({cart?.items?.length} items)</span>
                                        <span className='font-medium'>₹{cart?.totalPrice?.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span>Shipping</span>
                                        <span className='font-medium'>₹{shipping}</span>
                                    </div> 
                                    <div className='flex justify-between'>
                                        <span>Tax(5%)</span>
                                        <span className='font-medium'>₹{tax?.toFixed(2)}</span>
                                    </div>
                                    <Separator />
                                    <div className='flex justify-between font-bold text-lg'>
                                        <span>Total</span>
                                        <span>₹{total?.toFixed(2)?.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className='space-y-3 pt-4'>
                                        <div className='flex space-x-2'>
                                            <Input placeholder='Promo code' className='flex-1' />
                                            <Button variant="outline">Apply</Button>
                                        </div>
                                        <Button className='w-full bg-pink-600 hover:bg-pink-700'>PLACE ORDER</Button>
                                        <Button variant="outline" className='w-full bg-transparent'>
                                            <Link to='/products'>Continue Shopping</Link>
                                        </Button>
                                    </div>
                                    <div className='text-muted-foreground text-sm pt-4 space-y-1'>
                                        <p>* Free shipping on orders over ₹299</p>
                                        <p>* 30-day return policy</p>
                                        <p>* Secure checkout with SSL encryption</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='flex flex-col items-center justify-center min-h-[60vh] p-6 text-center'>
                    {/* Icon */}
                    <div className='bg-pink-100 rounded-full p-6'>
                        <ShoppingCartIcon className='w-16 h-16 text-pink-600 mx-auto' />
                    </div>
                    {/* Title */}
                    <h2 className='text-2xl mt-6 font-bold text-gray-800'>Your cart is empty</h2>
                    {/* Description */}
                    <p className='text-gray-600 mt-2'>Looks like you haven't added anything to your cart yet.</p>
                    {/* Button */}
                    <Button 
                     onClick={() => navigate('/products')} className='bg-purple-600 hover:bg-purple-700 text-white mt-6 py-3 px-6 rounded-md cursor-pointer'
                    >
                        Start Shopping
                    </Button>
                </div>
            )
        }
    </div>
  )
}

export default Cart
