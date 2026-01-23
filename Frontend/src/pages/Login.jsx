import React, { useState } from 'react'

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
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setUser } from '../redux/userSlice'


function Login() {
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()// Prevent the page from reloading
        console.log(formData);
        try {
            setLoading(true)
            const response = await axios.post(`http://localhost:3000/api/user/login`, formData, {
                headers: {
                    // Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            });
            if (response.data.success) {
                // Save token and user to localStorage
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.accessToken));
                dispatch(setUser(response.data.accessToken));
                toast.success(response.data.message);
                navigate("/");
            }
            console.log(response);
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error.message || "An error occurred");
        }
        finally{
            setLoading(false)
        }
    }
  return (
    <div className='flex justify-center items-center min-h-screen bg-purple-100'>
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Create your account</CardTitle>
                    <CardDescription>
                        Enter given details below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-3">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="m@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    placeholder="Enter a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    type={showPassword ? "text" : "password"}
                                    required
                                />
                                {
                                    showPassword ? <EyeOff onClick={() => setShowPassword(!showPassword)} className='w-5 h-5 text-gray-500 absolute right-5 bottom-2' /> :
                                        <Eye onClick={() => setShowPassword(!showPassword)} className='w-5 h-5 text-gray-500 absolute right-5 bottom-2' />
                                }
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button onClick={handleSubmit} type="submit" className="w-full cursor-pointer bg-purple-700 text-white hover:bg-purple-800">
                        {loading?<><Loader2 className='w-4 h-4 text-white animate-spin' />Please wait...</>:"Login"}
                    </Button>
                    <p className='text-center text-sm text-gray-500'>Don't have an account? <Link to={"/signup"} className='hover:underline cursor-pointer text-blue-800'>Signup</Link></p>

                </CardFooter>
            </Card>
        </div>
  )
}

export default Login