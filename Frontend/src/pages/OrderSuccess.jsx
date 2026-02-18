import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import React from 'react'
import { useNavigate } from 'react-router-dom';


function OrderSuccess() {
    const navigate = useNavigate();

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 p-6'>
        <div className='max-w-md w-full bg-white rounded-2xl shadow-lg p-10 text-center'>
            {/* Success Icon */}
            <div className='flex justify-center'>
                <CheckCircle className='w-20 h-20 text-green-500' />
            </div>

            {/* Title */}
            <h1 className='text-2xl font-bold text-gray-800 mt-6'>
                Payment Successfully
            </h1>

            {/* Message */}
            <p className='text-gray-600'>
                Thank you for your purchase! Your order has been placed successfully.
            </p>

            {/* Button */}
            <div className='mt-8 text-gray-600'>
                <button
                onClick={() => navigate('/products')}
                className='w-full bg-purple-600 text-white hover:bg-purple-700' rounded='xl transition'
                >
                    Continue Shopping
                </button>

                <button
                onClick={() => navigate('/orders')}
                className='w-full border border-purple-600 py-3 text-Purple-600 hover:bg-purple-50' rounded='xl transition'
                >
                    View My Orders
                </button>
            </div>
        </div>
    </div>
  )
}

export default OrderSuccess