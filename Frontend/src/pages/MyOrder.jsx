import OrderCard from '@/components/OrderCard'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

function MyOrder() {
    const [userOrders, setUserOrders] = useState([])

    const getMyOrders = async () => {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/myorder`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        })
        if (response.data.success) {
            setUserOrders(response.data.orders)
        }
    }

    useEffect(() => {
        getMyOrders()
    }, [])

    return (
        <>
        <OrderCard userOrders={userOrders}/>
        </>
    )
}

export default MyOrder