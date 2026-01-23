import React from 'react'
import { Truck, Shield, Headphones } from 'lucide-react'

function Features() {
  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'On orders over $50',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '100% secure transactions',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Always here to help',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ]

  return (
    <section className='py-12 bg-gray-100'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='grid md:grid-cols-3 gap-8'>
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div key={index} className='flex items-center gap-4'>
                <div className={`${feature.bgColor} rounded-full p-4 flex-shrink-0`}>
                  <IconComponent className={`${feature.iconColor} w-6 h-6`} />
                </div>
                <div>
                  <h3 className='font-bold text-black text-lg mb-1'>{feature.title}</h3>
                  <p className='text-gray-600 text-sm'>{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Features