import ImageUpload from '@/components/ImageUpload'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setProducts } from '@/redux/productSlice'

function AddProduct() {
    // const navigate = useNavigate()
    const dispatch = useDispatch()
    const { products } = useSelector((state) => state.product)
    const [loading, setLoading] = useState(false)
    const [productData, setProductData] = useState({
        productName: '',
        productPrice: 0,
        productDesc: '',
        ProductImg: [],
        brand: '',
        category: ''
    })
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const submitHandler = async () => {
        const accessToken = localStorage.getItem('token');

        if (!accessToken) {
            toast.error('Please login to add products');
            return;
        }

        const formData = new FormData();
        formData.append('productName', productData.productName);
        formData.append('productPrice', productData.productPrice);
        formData.append('productDesc', productData.productDesc);
        formData.append('brand', productData.brand);
        formData.append('category', productData.category);

        if (productData.ProductImg.length === 0) {
            toast.error('Please upload at least one image');
            return;
        }

        productData.ProductImg.forEach((img) => {
            formData.append('files', img);
        })

        try {
            setLoading(true)
            const response = await axios.post('http://localhost:3000/api/product/add', formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                dispatch(setProducts([...products, response.data.product]))
                toast.success('Product added successfully');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
            console.log(error);
        } finally {
            setLoading(false)
        }

    }
    return (
        <div className='pl-[350px] py-20 pr-20 mx-auto px-4 bg-gray-100'>
            <Card className='w-full my-20'>
                <CardHeader>
                    <CardTitle>Add Product</CardTitle>
                    <CardDescription>Enter the details of the product</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='flex gap-2 flex-col'>
                        <div className='grid gap-2'>
                            <Label>Product Name</Label>
                            <Input
                                type='text'
                                name='productName'
                                value={productData.productName}
                                onChange={handleChange}
                                placeholder='Ex-Iphone'
                                required
                            />
                        </div>
                        <div className='grid gap-2'>
                            <Label>Price</Label>
                            <Input
                                type='number'
                                name='productPrice'
                                value={productData.productPrice}
                                onChange={handleChange}
                                placeholder=''
                                required
                            />
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                            <div className='grid gap-2'>
                                <Label>Brand</Label>
                                <Input
                                    type='text'
                                    name='brand'
                                    value={productData.brand}
                                    onChange={handleChange}
                                    placeholder='Ex-apple'
                                    required
                                />
                            </div>
                            <div className='grid gap-2'>
                                <Label>Category</Label>
                                <Input
                                    type='text'
                                    name='category'
                                    value={productData.category}
                                    onChange={handleChange}
                                    placeholder='Ex-mobile'
                                    required
                                />
                            </div>
                        </div>
                        <div className='grid gap-2'>
                            <div className='flex items-center'>
                                <Label>Description</Label>
                            </div>
                            <Textarea
                                name='productDesc'
                                value={productData.productDesc}
                                onChange={handleChange}
                                placeholder='Enter brief description of the product'
                                required
                            />
                        </div>
                        <ImageUpload productData={productData} setProductData={setProductData} />
                    </div>
                </CardContent>
                <CardFooter className='flex-col gap-2'>
                    <Button
                        disabled={loading}
                        onClick={submitHandler}
                        type='button'
                        className='w-full mt-6 bg-purple-500 text-white cursor-pointer'>
                        {
                            loading ? <span className='flex items-center gap-2'><Loader2 className='animate-spin' />Please wait...</span> : 'Add Product'
                        }
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default AddProduct
