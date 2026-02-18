import React, { useState, useEffect } from 'react'
import axios from 'axios'

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const accesstoken = localStorage.getItem('token')
  console.log('orders', orders);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/orders/all`, {
          headers: {
            Authorization: `Bearer ${accesstoken}`
          }
        })
        if (data.success) setOrders(data.orders)

      } catch (error) {
        console.log('❌ Failed to fetch admin orders', error);
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [accesstoken])

  if (loading) {
    return <div className='text-center py-20 text-gray-500'>Loading all orders...</div>
  }

  return (
    <div className='pl-[350px] py-20 pr-20 max-auto px-4'>
      <h1 className='text-3xl font-bold mb-6'>Admin - All Orders</h1>

      {
        orders.length === 0 ? (
          <p className='text-gray-500'>No orders found</p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full border border-gray-200 text-left text-sm'>
              <thead className='bg-gray-100'>
                <tr>
                  <th className='px-4 py-2'>Order ID</th>
                  <th className='px-4 py-2'>User</th>
                  <th className='px-4 py-2'>Products</th>
                  <th className='px-4 py-2'>Amount</th>
                  <th className='px-4 py-2'>Status</th>
                  <th className='px-4 py-2'>Date</th>
                </tr>
              </thead>
              <tbody>
                {
                  orders.map((order) => (
                    <tr key={order._id} className='hover:bg-gray-50'>
                      <td className='px-4 py-2 border'>{order._id}</td>
                      <td className='px-4 py-2 border'>
                        {order.user.firstName} <br />
                        <span className='text-gray-500 text-xs'>{order.user.lastName}</span>
                      </td>
                      <td className='px-4 py-2 border'>
                        {order.products.map((p, idx) => (
                          <div key={idx}  className='px-4 py-2 border'>
                            {p.product.name} x {p.quantity}
                          </div>
                        ))}
                      </td>
                      <td className='px-4 py-2 border font-semibold'>
                        ${order.amount.toLocaleString('en-IN')}
                      </td>
                      <td className='px-4 py-2 border'>
                        <span className={`px-4 py-1 rounded text-xs font-medium ${order.status === 'Paid' ? 'bg-green-100 text-green-800' : order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :'bg-red-100 text-red-800'}`}>{order.status}</span>
                      </td>
                      <td className='px-4 py-2 border'>
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        )
      }
    </div>
  )
}

export default AdminOrders