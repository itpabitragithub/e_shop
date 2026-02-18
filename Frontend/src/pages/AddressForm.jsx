import { Label } from '@/components/ui/label';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { addAddress, deleteAddress, setCart, setSelectedAddress } from '../redux/productSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddressForm() {
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
    })
    const { cart, addresses, selectedAddress } = useSelector(store => store.product);
    const [showForm, setShowForm] = useState(addresses.length > 0 ? false : true);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Form submitted:', formData);
    }

    const handleSave = () => {
        dispatch(addAddress(formData));
        setShowForm(false);
    }

    const subtotal = cart.totalPrice;
    const shipping = subtotal > 50 ? 0 : 10;
    const tax = parseFloat((subtotal * 0.05).toFixed(2));
    const total = subtotal + shipping + tax;

    console.log(cart);

    const handlePayment = async () => {
        const accessToken = localStorage.getItem('token');
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/orders/create-order`, {
                products: cart?.items?.map(item => ({
                    productId: item.productId._id,
                    quantity: item.quantity,
                })),
                tax: tax,
                amount: total,
                shipping: shipping,
                currency: "INR"
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (!data.success) return toast.error("Something went wrong");

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.order.amount,
                currency: data.order.currency,
                order_id: data.order.id,
                name: "E-shop",
                description: "Payment for order",
                handler: async function (response) {
                    try {
                        const verifyres = await axios.post(`${import.meta.env.VITE_API_URL}/api/orders/verify-payment`, response, {
                            headers: {
                                Authorization: `Bearer ${accessToken}`
                            }
                        });

                        if (verifyres.data.success) {
                            toast.success("✅ Payment successfull !");
                            dispatch(setCart({
                                items: [],
                                totalPrice: 0
                            }));
                            navigate("/order-success");
                        } else {
                            toast.error("❌ Payment verification failed !");
                        }


                    } catch (error) {
                        toast.error("Error verifying Payment");
                    }
                },
                modal: {
                    ondismiss: async () => {
                        //Handle user closing the popup
                        await axios.post(`${import.meta.env.VITE_API_URL}/api/orders/verify-payment`, {
                            razorpay_order_id: data.order.id,
                            paymentFailed: true
                        }, {
                            headers: {
                                Authorization: `Bearer ${accessToken}`
                            }
                        })
                        toast.error("❌ Payment verification failed !");
                    }
                },
                prefill: {
                    name: formData.fullName,
                    email: formData.email,
                    contact: formData.phone,
                },
                theme: {
                    color: "#F47286"
                }
            }
            const rzp = new window.Razorpay(options);


            //Listen for payment failure
            rzp.on('payment.failed', async function (response) {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/orders/verify-payment`, {
                    razorpay_order_id: data.order.id,
                    paymentFailed: true
                }, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
                toast.error("Payment failed. Please try again");
            });
            rzp.open();

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong while Processing payment");
        }
    }

    return (
        <div className='max-w-7xl mx-auto p-10'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mt-10'>
                {/* Left side - Address Form or Saved Addresses */}
                <div className='space-y-4 p-6 bg-white'>
                    {
                        showForm ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="mb-4">
                                    <Label htmlFor='fullName'>Full Name</Label>
                                    <Input
                                        id="fullName"
                                        name="fullName"
                                        placeholder="John Doe"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <Label htmlFor='phone'>Phone Number</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        placeholder="+91 1234567890"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        type="tel"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <Label htmlFor='email'>Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        placeholder="john.doe@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        type="email"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <Label htmlFor='address'>Address</Label>
                                    <Input
                                        id="address"
                                        name="address"
                                        placeholder="1234 Main St, Anytown, USA"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                                    <div>
                                        <Label htmlFor='city'>City</Label>
                                        <Input
                                            id="city"
                                            name="city"
                                            placeholder="Anytown"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor='state'>State</Label>
                                        <Input
                                            id="state"
                                            name="state"
                                            placeholder="New York"
                                            value={formData.state}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                                    <div>
                                        <Label htmlFor='zipCode'>Zip Code</Label>
                                        <Input
                                            id="zipCode"
                                            name="zipCode"
                                            placeholder="123456"
                                            value={formData.zipCode}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor='country'>Country</Label>
                                        <Input
                                            id="country"
                                            name="country"
                                            placeholder="India"
                                            value={formData.country}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <Button type="button" onClick={handleSave} className='w-full mt-4'>Save & Continue</Button>
                            </form>
                        ) : (
                            <div className='space-y-4'>
                                <h2 className='text-lg font-semibold'>Saved Addresses</h2>
                                {
                                    addresses.map((address, index) => {
                                        return (
                                            <div
                                                onClick={() => dispatch(setSelectedAddress(index))}
                                                key={index}
                                                className={`border p-4 rounded-md cursor-pointer relative ${selectedAddress === index ? 'border-purple-600 bg-purple-50' : 'border-gray-300'}`}>
                                                <p className='text-sm font-medium'>{address.fullName}</p>
                                                <p>{address.phone}</p>
                                                <p>{address.email}, {address.city}, {address.state}, {address.zipCode}, {address.country}</p>
                                                <button type="button" onClick={(e) => dispatch(deleteAddress(index))} className='text-sm text-red-500 hover:text-red-700 absolute top-2 right-2'>Delete</button>
                                            </div>
                                        )

                                    })
                                }

                                <Button type="button" onClick={() => setShowForm(true)} variant='outline' className='w-full mt-4'>+ Add New Address</Button>
                                <Button
                                    onClick={handlePayment}
                                    disabled={selectedAddress === null}
                                    type="button"
                                    variant='outline' className='w-full mt-4 bg-purple-600 text-white hover:bg-purple-700'>
                                    Proceed to Checkout
                                </Button>
                            </div> 
                        )
                    }
                </div>
                {/* Right side - Order Summary */}
                <div className='sticky top-10'>
                    <Card className='w-full'> 
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div className='flex justify-between'>
                                <span>Subtotal ({cart.items.length}) items</span>
                                <span>₹{subtotal.toLocaleString("en-IN")}</span>
                            </div>
                            <div className='flex justify-between'>
                                <span>Shipping</span>
                                <span>₹{shipping}</span>
                            </div>
                            <div className='flex justify-between'>
                                <span>Tax</span>
                                <span>₹{tax}</span>
                            </div>
                            <Separator />
                            <div className='flex justify-between font-bold text-lg'>
                                <span>Total</span>
                                <span>₹{total}</span>
                            </div>
                            <div className='text-sm text-muted-foreground pt-4'>
                                <p>* Free shipping on orders over ₹299</p>
                                <p>* 30-day return policy</p>
                                <p>* Secure checkout with SSL encryption</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default AddressForm