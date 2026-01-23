import React from 'react'

function Verify() {
  return (
    <div className='bg-gray-200 relative w-full h-[760px] overflow-hidden'>
        <div className='min-h-screen flex items-center justify-center'>
            <div className='bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center'>
                <h2 className='text-2xl font-semibold text-gray-800 mb-4'>✅ Check Your Email</h2>
                <p className='text-gray-400 text-sm '>We've sent a verification code to your email. Please check your inbox and enter the code below to verify your account.</p>
                {/* <div className='mb-6'>
                    <input type='text' className='w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter verification code' />
                </div>
                <Button className='w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600'>Verify Account</Button> */}
            </div>
        </div>
    </div>
  )
}

export default Verify