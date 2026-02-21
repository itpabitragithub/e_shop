import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '@/redux/userSlice'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

import { useParams } from 'react-router-dom'
import userLogo from "../assets/user.png"
import { toast } from 'sonner'
import axios from 'axios'
import MyOrder from './MyOrder'

function Profile() {
    const { user } = useSelector((store) => store.user)
    const params = useParams()
    const userId = params.userId
    const [updateUser, setUpdateUser] = useState({
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        phoneNumber: user?.phoneNumber,
        address: user?.address,
        city: user?.city, 
        zipCode: user?.zipCode,
        profilePic: user?.profilePic,
        role: user?.role,
    })
    const [file, setFile] = useState(null)
    const dispatch = useDispatch()

    // Fetch user data if not available in Redux
    useEffect(() => {
        const fetchUserData = async () => {
            if (!user && userId) {
                try {
                    const token = localStorage.getItem("token")
                    const response = await axios.get(`http://localhost:3000/api/user/user-details/${userId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    })
                    if (response.data.success) {
                        dispatch(setUser(response.data.user))
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error)
                }
            }
        }
        fetchUserData()
    }, [userId, user, dispatch])

    // Update form state when user data changes
    useEffect(() => {
        if (user) {
            // Check if there's a pending profilePic in localStorage
            const pendingProfilePic = localStorage.getItem('pendingProfilePic')
            setUpdateUser({
                firstName: user?.firstName || '',
                lastName: user?.lastName || '',
                email: user?.email || '',
                phoneNumber: user?.phoneNumber || '',
                address: user?.address || '',
                city: user?.city || '',
                zipCode: user?.zipCode || '',
                profilePic: pendingProfilePic || user?.profilePic || '',
                role: user?.role || '',
            })
        }
    }, [user])

    const handleChange = (e) => {
        setUpdateUser({ ...updateUser, [e.target.name]: e.target.value })
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        setFile(selectedFile)
        // Convert file to base64 for persistence across page refreshes
        const reader = new FileReader()
        reader.onloadend = () => {
            const base64String = reader.result
            setUpdateUser({ ...updateUser, profilePic: base64String })
            // Store base64 string in localStorage to persist on refresh
            localStorage.setItem('pendingProfilePic', base64String)
        }
        reader.readAsDataURL(selectedFile)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const accessToken = localStorage.getItem("token")
        try {
            //use formdata for text and file
            const formData = new FormData()
            formData.append("firstName", updateUser.firstName)
            formData.append("lastName", updateUser.lastName)
            formData.append("email", updateUser.email)
            formData.append("phoneNumber", updateUser.phoneNumber)
            formData.append("address", updateUser.address)
            formData.append("city", updateUser.city)
            formData.append("zipCode", updateUser.zipCode)
            formData.append("role", updateUser.role)

            if (file) {
                formData.append("file", file) // Image file for backend multer
            }

            const response = await axios.put(`http://localhost:3000/api/user/update/${userId}`, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "multipart/form-data"
                }
            })
            if (response.data.success) {
                toast.success(response.data.message)
                dispatch(setUser(response.data.user))
                // Clear pending profilePic from localStorage after successful update
                localStorage.removeItem('pendingProfilePic')
            }
            // else {
            //     toast.error(response.data.message)
            // }
        }
        catch (error) {
            console.log(error)
            toast.error("Failed to update profile")
        }
    }

    return (
        <div className='pt-20 min-h-screen bg-gray-100'>
            <div className='max-w-4xl mx-auto px-4 py-8'>
                <Tabs defaultValue="profile" className="max-w-7xl mx-auto items-center">
                    <TabsList className="mb-4">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="orders">Orders</TabsTrigger>
                    </TabsList>
                    <TabsContent value="profile">
                        <div>
                            <div className='flex flex-col justify-center item-center bg-gray'>
                                <h1 className='font-bold mb-7 text-2xl text-gray-700'>UpdateProfile</h1>
                                <div className='w-full flex gap-4 justify-between items-start max-w-2xl'>
                                    {/* Profile Picture */}
                                    <div className='flex flex-col items-center'>
                                        <img src={updateUser?.profilePic || userLogo} alt="Profile Picture" className='w-24 h-24 rounded-full object-cover border-2 border-gray-500' />
                                        <Label className='mt-4 cursor-pointer bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600'>Change Picture
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                        </Label>

                                    </div>
                                    {/* Profile form  */}
                                    <form onSubmit={handleSubmit} className='space-y-4 shadow-lg p-5 rounded-lg bg-white'>
                                        <div className='grid grid-cols-2 gap-4'>
                                            <div>
                                                <Label className='block text-sm font-medium text-gray-700'>First Name:</Label>
                                                <Input
                                                    type='text'
                                                    name='firstName'
                                                    placeholder='John'
                                                    value={updateUser.firstName}
                                                    onChange={handleChange}
                                                    className='mt-1 w-full rounded-lg px-3 py-2'
                                                />
                                            </div>
                                            <div>
                                                <Label className='block text-sm font-medium text-gray-700'>Last Name:</Label>
                                                <Input
                                                    type='text'
                                                    name='lastName'
                                                    placeholder='Doe'
                                                    value={updateUser.lastName}
                                                    onChange={handleChange}
                                                    className='mt-1 w-full rounded-lg px-3 py-2'
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label className='block text-sm font-medium text-gray-700'>Email:</Label>
                                            <Input
                                                type='email'
                                                name='email'
                                                placeholder='john@example.com'
                                                value={updateUser.email}
                                                onChange={handleChange}
                                                className='mt-1 w-full rounded-lg px-3 py-2'
                                            />
                                        </div>
                                        <div>
                                            <Label className='block text-sm font-medium text-gray-700'>Phone Number:</Label>
                                            <Input
                                                type='text'
                                                name='phoneNumber'
                                                placeholder='Enter your Contact Number'
                                                value={updateUser.phoneNumber}
                                                onChange={handleChange}
                                                className='mt-1 w-full rounded-lg px-3 py-2'
                                            />
                                        </div>
                                        <div>
                                            <Label className='block text-sm font-medium text-gray-700'>Address:</Label>
                                            <Input
                                                type='text'
                                                name='address'
                                                placeholder='Enter your Address'
                                                value={updateUser.address}
                                                onChange={handleChange}
                                                className='mt-1 w-full rounded-lg px-3 py-2'
                                            />
                                        </div>
                                        <div className='grid grid-cols-2 gap-4'>
                                            <div>
                                                <Label className='block text-sm font-medium text-gray-700'>City:</Label>
                                                <Input
                                                    type='text'
                                                    name='city'
                                                    placeholder='Enter your City'
                                                    value={updateUser.city}
                                                    onChange={handleChange}
                                                    className='mt-1 w-full rounded-lg px-3 py-2'
                                                />
                                            </div>
                                            <div>
                                                <Label className='block text-sm font-medium text-gray-700'>Zip Code:</Label>
                                                <Input
                                                    type='text'
                                                    name='zipCode'
                                                    placeholder='Enter your Zip Code'
                                                    value={updateUser.zipCode}
                                                    onChange={handleChange}
                                                    className='mt-1 w-full rounded-lg px-3 py-2'
                                                />
                                            </div>
                                        </div>
                                        <Button type='submit' className='w-full mt-4 bg-blue-500 text-white hover:bg-blue-600 font-semibold py-2 rounded-lg'>
                                            Update Profile
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="orders">
                         <MyOrder />
                    </TabsContent>  
                </Tabs> 
            </div>
        </div>
    )
}

export default Profile