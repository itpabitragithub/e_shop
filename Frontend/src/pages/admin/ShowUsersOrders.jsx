import OrderCard from '@/components/OrderCard'
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
 
function ShowUsersOrders() {
  const params = useParams()
  const [userOrders, setUserOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const getUserOrders = async () => {
    const accesstoken = localStorage.getItem('token')
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/user-order/${params.userId}`, {
        headers: {
          Authorization: `Bearer ${accesstoken}`
        }
      })
      if (response.data.success) {
        setUserOrders(response.data.orders || [])
      } else {
        setUserOrders([])
      }
    } catch (error) {
      console.error('Error fetching user orders:', error)
      setUserOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (params.userId) {
      setLoading(true)
      getUserOrders()
    } else {
      setLoading(false)
    }
  }, [params.userId])

  if (loading) {
    return (
      <div className='pl-[350px] py-20'>
        <p className='text-gray-500'>Loading orders...</p>
      </div>
    )
  }

  return (
    <div className='pl-[350px] py-20'>
      <h1 className='text-2xl font-bold mb-4 px-2'>User&apos;s Orders</h1>
      <OrderCard userOrders={userOrders} />
    </div>
  )
}

export default ShowUsersOrders 