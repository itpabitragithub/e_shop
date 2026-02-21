import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { setCart } from '@/redux/productSlice'

function ProductDesc({ product }) {
    const accessToken = localStorage.getItem('token')
    const dispatch = useDispatch()
    const handleAddToCart = async (productId) => {
        if(!productId){
            toast.error('Product ID is missing')
            return
        }
        if(!accessToken){
            toast.error('Please login to add items to cart')
            return
        }
        try{    
            const response = await axios.post(`http://localhost:3000/api/cart/add`, {productId},
             {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            if( response.data.success){
                toast.success('Product added to cart successfully')
                dispatch(setCart(response.data.cart))
            } 
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='flex flex-col gap-4 w-full'>
            <h1 className='text-4xl font-bold text-gray-800'>{product.productName}</h1>
            <p className='text-gray-800'>{product.category} | {product.brand}</p>
            <h2 className='text-purple-500 text-2xl font-bold'>₹{product.productPrice}</h2>
            <p className='line-clamp-12 text-muted-foreground'>{product.productDesc}</p>
            <div className='flex items-center gap-2 w-full sm:w-[300px]'>
                <p className='text-gray-800 font-semibold'>Quantity</p>
                <Input type='number' defaultValue={1} className='w-12' />
            </div>
            <Button onClick={() => handleAddToCart(product._id)} className='w-full bg-purple-500 text-white hover:bg-purple-600'>Add to Cart</Button>
        </div>
    )
}

export default ProductDesc