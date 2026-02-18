import { Input } from '@/components/ui/input'
import axios from 'axios'
import { Edit, Eye, Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import UserLogo from '@/assets/user.png'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'


function AdminUsers() {
    const [users, setUsers] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const navigate = useNavigate()


    const getallusers = async () => {
        const accessToken = localStorage.getItem('token')
        try {
            const response = await axios.get('http://localhost:3000/api/user/all-users', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            if (response.data.success) {
                setUsers(response.data.users)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const filteredUsers = users.filter((user) => {
        return user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user?.email?.toLowerCase().includes(searchTerm.toLowerCase())

    })

    useEffect(() => {
        getallusers()
    }, [])

    return (
        <div className='pl-[350px] py-20 pr-20 mx-auto px-4'>
            <h1 className='font-bold text-2xl'>User Management</h1>
            <p>View and manage registered users</p>
            <div className='flex relative w-[300px] mt-6'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-600'/>
                <Input 
                value={searchTerm}
                type='text'
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder='Search users...' 
                className='w-full pl-10'/>
            </div>
            <div className='grid grid-cols gap-7 mt-7'>
                {
                    filteredUsers.map((user, index) => { 
                        return (
                            <div key={index} className='bg-purple-100 rounded-lg p-5'>
                                <div className='flex items-center gap-2'>
                                    <img 
                                        src={user?.profilePic || UserLogo} 
                                        alt="" 
                                        className='w-16 rounded-full aspect-square object-cover border boder-purple-600'
                                        onError={(e) => {
                                            e.target.src = UserLogo
                                        }}
                                    />
                                    <div>
                                        <h1 className='font-semibold'>{user?.firstName} {user?.lastName}</h1>
                                        <h3>{user?.email}</h3>
                                    </div>
                                </div>
                                <div className='flex mt-3 gap-3'>
                                    <Button onClick={() => navigate(`/dashboard/users/${user?._id}`)} variant='outline'><Edit/>Edit</Button>
                                    <Button onClick={() => navigate(`/dashboard/users/orders/${user?._id}`)}><Eye/>show Order</Button>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div> 
    )
}

export default AdminUsers