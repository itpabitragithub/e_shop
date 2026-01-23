import React from 'react'
import { Button } from './ui/button'

function Hero() {
    return (
        <section className='bg-gradient-to-r from-blue-600 to-purple-800 py-15'>
            <div className='max-w-7xl mx-auto px-4'>
                <div className='grid md:grid-cols-2 items-center gap-8'>
                    <div>
                        <h1 className='text-4xl md:text-6xl text-white font-bold mb-4'>Latest Electronics Products at Best Prices</h1>
                        <p className='text-xl text-blue-100 mb-6'>Discover cutting-edge technology with unbeatble deals on smartphone , laptops , tablets , and more.</p>
                        <div className='flex flex-col sm:flex-row gap-4'>
                            <Button className='bg-white text-blue-600 hover:bg-gray-400 hover:text-white transition-colors'>Shop Now</Button>
                            <Button  variant="outline" className='border-white text-white hover:bg-white hover:text-blue-600 bg-transparent'>View Deals</Button>
                        </div>
                    </div>
                    <div className='relative'>
                        <img src="/iphone hq.png" alt="" width={300} height={400} className='rounded-lg shadow-lg mx-auto mt-10'/>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero