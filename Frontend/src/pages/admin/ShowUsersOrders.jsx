import OrderCard from '@/components/OrderCard'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

function ShowUsersOrders() {
  const params = useParams()

  const [userOrders, setUserOrders] = useState(null)

  const getUserOrders = async () => {
    const accesstoken = localStorage.getItem('token')
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/order/user-order/${params.userId}`, {
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