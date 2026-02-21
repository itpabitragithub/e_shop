import OrderCard from '@/components/OrderCard'
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

function ShowUsersOrders() {
  const params = useParams()

  const [userOrders, setUserOrders] = useState(null)

  const getUserOrders = async () => {
    const accesstoken = localStorage.getItem('token')
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/user-order/${params.userId}`, {
      headers: {
        Authorization: `Bearer ${accesstoken}`
      }
    })
    if (response.data.success) {
      setUserOrders(response.data.orders)
    }
  }
  useEffect(() => {
    getUserOrders()
  }, [])
  return (
    <div className='pl-[350px] py-20 '>
      <OrderCard userOrders={userOrders} />
    </div>
  )
}

export default ShowUsersOrders 