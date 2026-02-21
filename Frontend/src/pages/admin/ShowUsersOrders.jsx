import OrderCard from '@/components/OrderCard'
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
 
function ShowUsersOrders() {
  const params = useParams()

  const [userOrders, setUserOrders] = useState([])

  const getUserOrders = async () => { 
    const accesstoken = localStorage.getItem('token')
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/user-order/${params.userId}`, {
        headers: {
          Authorization: `Bearer ${accesstoken}`
        }
      })
      console.log('API Response:', response.data)
      if (response.data.success) {
        console.log('Orders received:', response.data.orders)
        setUserOrders(response.data.orders || [])
      } else {
        console.log('API returned success: false')
        setUserOrders([])
      }
    } catch (error) {
      console.error('Error fetching user orders:', error)
      if (error.response) {
        console.error('Error response:', error.response.data)
      }
      setUserOrders([])
    }
  }
  useEffect(() => {
    if (params.userId) {
      getUserOrders()
    }
  }, [params.userId])
  return (
    <div className='pl-[350px] py-20 '>
      <OrderCard userOrders={userOrders} />
    </div>
  )
}

export default ShowUsersOrders 