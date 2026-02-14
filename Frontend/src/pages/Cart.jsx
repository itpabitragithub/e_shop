import React, { useEffect } from 'react'
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
    const accessToken = localStorage.getItem('accessToken');

    const handleUpdateQuantity = async (productId, type) => {
        try {
            const response = await axios.put(`${API}/update-quantity`, { productId, type}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (response.data.success) {
                dispatch(setCart(response.data.cart));
            }
        }
        catch (error) {
            console.log(error);
        }
    }

  return (
    <div className='pt-20 bg-gray-100 min-h-screen'>
        {
            cart?.items?.length > 0 ? (
                <div className='max-w-7xl mx-auto px-4 py-8'>
                    <h1 className='text-2xl font-bold text-gray-800 mb-7'>Shopping Cart</h1>
                    <div className='flex gap-7 flex-col lg:flex-row'>
                        <div className='flex flex-col gap-5 flex-1'>
                            {cart?.items?.map((item, index) => {
                                return <Card key={index}>
                                        <div className='flex justify-between items-center gap-4'>
                                            <img src={item?.productId?.productImg?.[0]?.url || userLogo} alt={item?.productId?.productName} className='w-25 h-25' />
                                            <div className='w-[280px]'>
                                                <h1 className='font-semibold truncate'>{item?.productId?.productName}</h1>
                                                <p>₹{item?.productId?.productPrice}</p>
                                            </div>
                                            <div className='flex items-center gap-5'>
                                                <Button onClick={() => handleUpdateQuantity(item?.productId?._id, 'decrease')}><Minus className='w-4 h-4' /></Button>
                                                <span>{item?.quantity}</span>
                                                <Button onClick={() => handleUpdateQuantity(item?.productId?._id, 'increase')}><Plus className='w-4 h-4' /></Button>
                                            </div>
                                            <p>₹{(item?.productId?.productPrice) * (item?.quantity)}</p>
                                            <p className='text-red-500 flex items-center gap-2 cursor-pointer' onClick={() => removeFromCart(getProductId(item))}><Trash2 className='w-4 h-4' /></p>
                                        </div>
                                </Card>
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
                                    <div className='space-y-3 pt-4'>
                                        <div className='flex space-x-2'>
                                            <Input placeholder='Promo code' className='flex-1' />
                                            <Button variant="outline">Apply</Button>
                                        </div>
                                        <Button className='w-full bg-pink-600'>PLACE ORDER</Button>
                                        <Button variant="outline" className='w-full bg-transparent'>
                                            <Link to='/products'>Continue Shopping</Link>
                                        </Button>
                                    </div>
                                    <div className='text-muted-foreground text-sm pt-4'>
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
