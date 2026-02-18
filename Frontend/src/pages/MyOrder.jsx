import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import React, { useEffect, useState } from 'react'

function MyOrder() {
    const [userOrders, setUserOrders] = useState([])

    const getMyOrders = async () => {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/order/myorder`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if (response.data.success) {
            setUserOrders(response.data.orders)
        }
    }

    useEffect(() => {
        getMyOrders()
    }, [])

    return (
        <div className='pr-20 flex flex-col gap-3'>
            <div className='w-full p-6'>
                <div className='flex items-center gap-4 mb-6'>
                    <Button onClick={() => Navigate(-1)}><ArrowLeft /></Button>
                    <h1 className='text-2xl font-bold'>Orders</h1>
                </div>
                {
                    userOrders?.length === 0 ? (
                        <p className='text-gray-500 space-y-6 text-2xl'>No Orders found for this user yet. Start shopping now!</p>
                    ) : (
                        <div className='space-y-6 w-full'>
                            {
                                userOrders.map((order) => (
                                    <div key={order._id} className='w-full rounded-2xl p-6 border border-gray-200 shadow-lg'>
                                        {/* Order Header */}
                                        <div className='flex items-center justify-between mb-4'>
                                            <h2 className='text-xl font-semibold'>Order ID:{" "}
                                                <span className='text-gray-600'>{order._id}</span>
                                            </h2>
                                            <p className='text-gray-600 text-sm'>Amount:{" "}
                                                <span className='font-bold'>{order.currency} {order.amount.toFixed(2)}</span>
                                            </p>
                                        </div>

                                        {/* User Info */}
                                        <div className='flex items-center justify-between'>
                                            <div className='mb-4'>
                                                <p className='text-gray-700 text-sm'>
                                                    <span className='font-medium'>User:</span>{" "}
                                                    {order.user?.firstName} {order.user?.lastName}
                                                </p>
                                                <p className='text-gray-500 text-sm'>
                                                    Email: {order.user?.email || "N/A"}
                                                </p>
                                            </div>
                                            <sapn className={`${order.status === "paid" ? "bg-green-500" : order.status === "Failed" ? "bg-red-500" : "bg-orange-300"} text-white px-2 py-1 rounded-lg`}>{order.status}</sapn>
                                        </div>

                                        {/* Productz */}
                                        <div>
                                            <h3 className='font-medium mb-2'>Products:</h3>
                                            <ul>
                                                {
                                                    order.products.map((product, index) => (
                                                        <li key={index} className='flex items-center justify-between bg-gray-100 p-2 rounded-lg'>
                                                            <img onClick={() => navigate(`/product/${product.productId._id}`)} className='w-16 cursor-pointer' src={product.productId?.productImg?.[0].url} alt="" />
                                                            <span className='w-[100px] line-clamp-2'>{product.productId?.productName}</span>
                                                            <span>{product?.productId._id}</span>
                                                            <span className='font-medium'>₹{product.productId?.productPrice} * {product.quantity}</span>   
                                                        </li>                                            
                                                    ))
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default MyOrder