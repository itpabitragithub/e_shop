import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { AreaChart } from 'lucide-react'
import { Tooltip } from 'radix-ui'
import React from 'react'

function AdminSales() {
  const [sales, setSales] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalSales: 0,
    salesByDate: [],
  })

  const fetchSates = async () => {
    try {
      const accesstoken = localStorage.getItem('token')
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/order/sales`, {
        headers: {
          Authorization: `Bearer ${accesstoken}`
        }
      })

      if (response.data.success) {
        setSales(response.data.salesData)
      }
    } catch (error) {
      console.log("Error fetching sales data:", error);
    }
  }

  useEffect(() => {
    fetchSates()
  }, [])

  return (
    <div className='pl-[350px] bg-gray-100 py-20 mx-auto px-4'>
      <div className='p-6 grid gap-6 lg:grid-cols-4'>
        {/* Sates card */}
        <Card className='bg-purple-500 text-white shadow'>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent className='text-2xl font-bold'>{sales.totalUsers}</CardContent>
        </Card>
        <Card className='bg-purple-500 text-white shadow'>
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent className='text-2xl font-bold'>{sales.totalProducts}</CardContent>
        </Card>
        <Card className='bg-purple-500 text-white shadow'>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent className='text-2xl font-bold'>{sales.totalOrders}</CardContent>
        </Card>
        <Card className='bg-purple-500 text-white shadow'>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent className='text-2xl font-bold'>{sales.totalSales}</CardContent>
        </Card>

        {/* Sales chart */}
        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle>Sales (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sales.sales}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="amount" stroke="#F47286" fill="#F47286" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
      </Card>
    </div>
  </div>
)
}

export default AdminSales