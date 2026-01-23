import React, { useState } from 'react'

import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
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

function Signup() {
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    })
    const navigate = useNavigate()
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()// Prevent the page from reloading
        console.log(formData);
        try {
            setLoading(true)
            const response = await axios.post(`http://localhost:3000/api/user/register`, formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (response.data.success) {
                navigate("/verify");
                toast.success(response.data.message);
            }
            console.log(response);
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
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
                        <div className="grid grid-cols-2 gap-4">
                            <div className='grid gap-2'>
                                <Label htmlFor="firstName">FirstName</Label>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    placeholder="John"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className='grid gap-2'>
                                <Label htmlFor="lastName">LastName</Label>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
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
                                    placeholder="Enter password"
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
                        {loading?<><Loader2 className='w-4 h-4 text-white animate-spin' />Please wait...</>:"Signup"}
                    </Button>
                    <p className='text-center text-sm text-gray-500'>Already have an account? <Link to={"/login"} className='hover:underline cursor-pointer text-blue-800'>Login</Link></p>

                </CardFooter>
            </Card>
        </div>
    )
}

export default Signup