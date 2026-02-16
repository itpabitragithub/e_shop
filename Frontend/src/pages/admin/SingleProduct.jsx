import Breadcrums from '@/components/Breadcrums'
import ProductDesc from '@/components/ProductDesc'
import ProductImg from '@/components/ProductImg'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import axios from 'axios'

function SingleProduct() {
  const params = useParams()
  const productId = params.Id
  const {products} = useSelector((state) => state.product)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProduct = async () => {
      // First, try to get from Redux store (if available)
      const productFromStore = products?.find((p) => p._id === productId)
      if (productFromStore) {
        setProduct(productFromStore)
        setLoading(false)
        return
      }

      // If not in store, fetch from API
      try {
        setLoading(true)
        setError(null)
        const response = await axios.get(`http://localhost:3000/api/product/getSingleProduct/${productId}`)
        if (response.data.success) {
          setProduct(response.data.product)
        } else {
          setError('Product not found')
        }
      } catch (err) {
        console.error('Error fetching product:', err)
        setError(err.response?.data?.message || 'Failed to fetch product')
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId, products])
  
  if (loading) {
    return (
      <div className='pt-20 py-10 max-w-7xl mx-auto px-4'>
        <div className='text-center py-10 text-gray-500'>Loading product...</div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className='pt-20 py-10 max-w-7xl mx-auto px-4'>
        <div className='text-center py-10 text-gray-500'>{error || 'Product not found'}</div>
      </div>
    )
  }
  
  return (
    <div className='pt-20 py-10 max-w-7xl mx-auto px-4'>
      <Breadcrums product={product}/>
      <div className='mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 items-start gap-4'>
        <ProductImg images={product.productImg}/>
        <ProductDesc product={product}/>
      </div>
    </div>
  )
}

export default SingleProduct