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
import { Eye, EyeOff, Loader2, User, Shield } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setUser } from '../redux/userSlice'


function Login({ defaultUserType = 'user' }) {
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [userType, setUserType] = useState(defaultUserType) // 'user' | 'admin'
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/login`,
                { ...formData, user_type: userType },
                { headers: { "Content-Type": "application/json" } }
            );
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                const userData = { ...response.data.accessToken, user_type: response.data.user_type };
                localStorage.setItem('user', JSON.stringify(userData));
                dispatch(setUser(userData));
                toast.success(response.data.message);
                const redirectTo = location.state?.from?.pathname || (userType === 'admin' ? '/dashboard/sales' : '/');
                navigate(redirectTo);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "An error occurred");
        } finally {
            setLoading(false)
        }
    }
  return (
    <div className='flex justify-center items-center min-h-screen bg-pink-100'>
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                        Sign in with your account
                    </CardDescription>
                    <div className="flex gap-2 mt-2">
                        <Button
                            type="button"
                            variant={userType === 'user' ? 'default' : 'outline'}
                            size="sm"
                            className="flex-1"
                            onClick={() => setUserType('user')}
                        >
                            <User className="w-4 h-4 mr-1" /> User
                        </Button>
                        <Button
                            type="button"
                            variant={userType === 'admin' ? 'default' : 'outline'}
                            size="sm"
                            className="flex-1"
                            onClick={() => setUserType('admin')}
                        >
                            <Shield className="w-4 h-4 mr-1" /> Admin
                        </Button>
                    </div>
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
                    <Button onClick={handleSubmit} type="submit" className="w-full cursor-pointer bg-pink-500 text-white hover:bg-pink-600">
                        {loading?<><Loader2 className='w-4 h-4 text-white animate-spin' />Please wait...</>:"Login"}
                    </Button>
                    {userType === 'user' ? (
                        <>
                            <p className='text-center text-sm text-gray-500'>Don't have an account? <Link to={"/signup"} className='hover:underline cursor-pointer text-blue-800'>Signup</Link></p>
                            <p className='text-center text-sm text-gray-500'>Admin? <Link to={"/admin/login"} className='hover:underline cursor-pointer text-blue-800'>Login here</Link></p>
                        </>
                    ) : (
                        <p className='text-center text-sm text-gray-500'>User? <Link to={"/login"} className='hover:underline cursor-pointer text-blue-800'>Login here</Link></p>
                    )}

                </CardFooter>
            </Card>
        </div>
  )
}

export default Login