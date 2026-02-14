import React, { useEffect } from 'react'
import userLogo from '@/assets/user.png'
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { setCart } from '@/redux/productSlice';
import axios from 'axios';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';

const Cart = () => {
    const {cart} = useSelector((store) => store.product);
    const dispatch = useDispatch();
    const accessToken = localStorage.getItem('token');

    const subtotal = cart?.totalPrice;
    const shipping = subtotal > 299 ? 0 : 10;
    const tax = subtotal * 0.05;
    const total = subtotal + shipping + tax;

    useEffect(() => {
        const fetchCart = async () => {
            if (!accessToken) return;
            try {
                const response = await axios.get('http://localhost:3000/api/cart', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                if (response.data.success) {
                    dispatch(setCart(response.data.cart));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchCart();
    }, [accessToken, dispatch]);

    const updateQuantity = async (productId, type) => {
        if (!accessToken) {
            toast.error('Please login to update cart');
            return;
        }
        try {
            const response = await axios.put('http://localhost:3000/api/cart/update', 
                { productId, type },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );
            if (response.data.success) {
                dispatch(setCart(response.data.cart));
                toast.success(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Failed to update quantity');
        }
    };

    const removeFromCart = async (productId) => {
        if (!accessToken) {
            toast.error('Please login to remove items');
            return;
        }
        try {
            const response = await axios.delete('http://localhost:3000/api/cart/remove', {
                data: { productId },
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (response.data.success) {
                dispatch(setCart(response.data.cart));
                toast.success(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Failed to remove item');
        }
    };

    const getProductId = (item) => {
        // Handle both populated (object) and non-populated (string/ObjectId) cases
        if (typeof item?.productId === 'object' && item?.productId?._id) {
            return item.productId._id;
        }
        return item?.productId;
    };

  return (
    <div className='pt-20 bg-gray-100 min-h-screen'>
        {
            cart?.items?.length > 0 ? (
                <div className='max-w-7xl mx-auto px-4 py-8'>
                    <h1 className='text-2xl font-bold text-gray-800 mb-7'>Shopping Cart</h1>
                    <div className='flex gap-7 flex-col lg:flex-row'>
                        <div className='flex flex-col gap-5 flex-1'>
                            {cart?.items?.map((item, index) => {
                                const product = item?.productId || item?.product;
                                return (
                                    <div key={index} className='bg-white rounded-lg shadow-md p-5 flex flex-col sm:flex-row gap-5'>
                                        <div className='w-full sm:w-[200px] h-[200px] flex-shrink-0'>
                                            <img 
                                                src={product?.productImg?.[0]?.url || userLogo} 
                                                alt={product?.productName || 'Product'} 
                                                className='w-full h-full object-cover rounded-lg' 
                                            />
                                        </div>
                                        <div className='flex-1 flex flex-col justify-between'>
                                            <div>
                                                <h2 className='text-xl font-semibold text-gray-800 mb-2'>
                                                    {product?.productName || 'Product Name'}
                                                </h2>
                                                <p className='text-lg font-bold text-purple-600 mb-4'>
                                                    ₹{item?.price || product?.productPrice || 0}
                                                </p>
                                            </div>
                                            <div className='flex items-center justify-between flex-wrap gap-4'>
                                                <div className='flex items-center gap-3'>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => updateQuantity(getProductId(item), 'decrement')}
                                                        disabled={item?.quantity <= 1}
                                                        className='rounded-full'
                                                    >
                                                        <Minus className='h-4 w-4' />
                                                    </Button>
                                                    <span className='text-lg font-semibold w-8 text-center'>{item?.quantity || 1}</span>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => updateQuantity(getProductId(item), 'increment')}
                                                        className='rounded-full'
                                                    >
                                                        <Plus className='h-4 w-4' />
                                                    </Button>
                                                </div>
                                                <div className='flex items-center gap-4'>
                                                    <p className='text-lg font-bold text-gray-800'>
                                                        Total: ₹{(item?.price || product?.productPrice || 0) * (item?.quantity || 1)}
                                                    </p>
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        onClick={() => removeFromCart(getProductId(item))}
                                                        className='rounded-full'
                                                    >
                                                        <Trash2 className='h-4 w-4' />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div>
                            <Card className='w-[400px]'>
                                <CardHeader>
                                    <CardTitle>Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className='space-y-4'>
                                    <div className='flex justify-between'>
                                        <span>Subtotal ({cart?.items?.length} items)</span>
                                        <span>₹{cart?.totalPrice?.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span>Shipping</span>
                                        <span>₹{shipping}</span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span>Tax(5%)</span>
                                        <span>₹{tax}</span>
                                    </div>
                                    <Separator />
                                    <div className='flex justify-between font-bold text-lg'>
                                        <span>Total</span>
                                        <span>₹{total}</span>
                                    </div>
                                    <div className='space-y-3 pt pt-4'>
                                        <div flex space-x-2>
                                            <Input placeholder='Promo code' />
                                            <Button variant="outline">Apply</Button>
                                        </div>
                                        <Button className='w-full bg-pink-600'>PLACE ORDER</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='max-w-7xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]'>
                    <div className='text-center'>
                        <h2 className='text-3xl font-bold text-gray-800 mb-4'>Your cart is empty</h2>
                        <p className='text-gray-600 mb-6'>Looks like you haven't added anything to your cart yet.</p>
                        <Button 
                            onClick={() => window.location.href = '/products'}
                            className='bg-purple-600 hover:bg-purple-700 text-white'
                        >
                            Continue Shopping
                        </Button>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default Cart