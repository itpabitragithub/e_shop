import React from 'react'
import { Button } from './ui/button'
import { setCart } from '@/redux/productSlice'
import { ShoppingCart } from 'lucide-react'
import { Skeleton } from './ui/skeleton'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'

const ProductCart = ({ product, loading }) => {
    
    const { productImg, productPrice, productName } = product
    const accessToken = localStorage.getItem('token')
    const dispatch = useDispatch()
    // const navigate = useNavigate()

    const addToCart = async(productId) => {
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
            if(response.data.success){
                toast.success('Product added to cart successfully')
                dispatch(setCart(response.data.cart))
            }
        }catch(error){
            console.log(error);
        }
    }
    return (
        <div className='shadow-lg rounded-lg overflow-hidden h-max'>
            <div className='w-full h-full overflow-hidden aspect-square'>
                {
                    loading ? <Skeleton className='w-full h-full rounded-lg' /> : <img src={productImg[0]?.url} alt={product.name} className='w-full h-full transition-transform duration-300 hover:scale-105' />
                }
            </div>
            {
                loading ? <div className='px-2 space-y-2 my-2'>
                    <Skeleton className='w-[200px] h-4' />
                    <Skeleton className='w-[100px] h-4' />
                    <Skeleton className='w-[150px] h-8' />
                </div> : <div className='px-2 space-y-1'>
                    <h1 className='font-semibold line-clamp-2'>{productName}</h1>
                    <h2 className='font-bold'>₹{productPrice}</h2>
                    <Button onClick={() => addToCart(product._id)} className='bg-pink-600 mb-3 w-full'><ShoppingCart />Add to Cart</Button>
                </div>
            }

        </div>
    )
}

export default ProductCart