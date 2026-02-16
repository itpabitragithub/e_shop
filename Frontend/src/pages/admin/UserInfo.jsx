import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import userLogo from '../../assets/user.png'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
// import { RadioGroup } from 'radix-ui'

function UserInfo() {
    const navigate = useNavigate()
    const [updateUser, setUpdateUser] = useState(null)
    const [file, setFile] = useState(null)
    const dispatch = useDispatch()
    const params = useParams()
    const userId = params.Id 

    const handleChange = (e) => {
        setUpdateUser({ ...updateUser, [e.target.name]: e.target.value })
    }
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        setFile(selectedFile)
        // Convert file to base64 for preview
        const reader = new FileReader()
        reader.onloadend = () => {
            const base64String = reader.result
            setUpdateUser({ ...updateUser, profilePic: base64String })
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
                navigate('/dashboard/users')
            }
            
        }
        catch (error) {
            console.log(error)
            toast.error("Failed to update profile")
        }
    }

    const getUserDetails = async () => {
        try {   
            const accessToken = localStorage.getItem("token")   
            const response = await axios.get(`http://localhost:3000/api/user/user-details/${userId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            if (response.data.success) {
                setUpdateUser(response.data.user)
            } else {
                toast.error(response.data.message || "Failed to get user details")
            }
        }
        catch (error) {
            console.log(error)
            const errorMessage = error.response?.data?.message || error.message || "Failed to get user details"
            toast.error(errorMessage)
        }
    }

    useEffect(() => {
        if (userId) {
            getUserDetails()
        }
    }, [userId])

    return (
        <div className='pt-5 min-h-screen bg-gray-100'>
            <div className='max-w-7xl mx-auto'>
                <div className='flex flex-col justify-center items-center min-h-screen bg-gray-100'>
                    <div className='flex justify-between gap-10'>
                        <Button onClick={() => navigate(-1)}><ArrowLeft /></Button>
                        <h1 className='text-2xl font-2xl mb-7 text-gray-700'>Update Profile</h1>
                    </div>
                    <div className='w-full flex gap-4 justify-between items-start max-w-2xl'>
                        {/* Profile Picture */}
                        <div className='flex flex-col items-center'>
                            <img src={updateUser?.profilePic || userLogo} alt="Profile Picture" className='w-24 h-24 rounded-full object-cover border-2 border-purple-500' />
                            <Label className='mt-4 cursor-pointer bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600'>Change Picture
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
                                        value={updateUser?.firstName || ''}
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
                                        value={updateUser?.lastName || ''}
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
                                    value={updateUser?.email || ''}
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
                                    value={updateUser?.phoneNumber || ''}
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
                                    value={updateUser?.address || ''}
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
                                        value={updateUser?.city || ''}
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
                                        value={updateUser?.zipCode || ''}
                                        onChange={handleChange}
                                        className='mt-1 w-full rounded-lg px-3 py-2'
                                    />
                                </div>
                            </div>
                            <div className='flex gap-3 items-center'>
                                <Label className='block text-sm font-medium'>Role:</Label>
                                <RadioGroup 
                                value={updateUser?.role || 'user'} 
                                onValueChange={value => setUpdateUser({ ...updateUser, role: value })}
                                className='flex item-center'>
                                    <div className='flex items-center space-x-2'>
                                        <RadioGroupItem value="user" id="user" />
                                        <Label htmlFor="user">User</Label>
                                    </div>
                                    <div className='flex items-center space-x-2'>
                                        <RadioGroupItem value="admin" id="user" />
                                        <Label htmlFor="user">Admin</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            <Button type='submit' className='w-full mt-4 bg-purple-500 text-white hover:bg-purple-600 font-semibold py-2 rounded-lg'>
                                Update Profile
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserInfo