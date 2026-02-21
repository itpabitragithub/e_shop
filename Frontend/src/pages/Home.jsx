import Features from '@/components/Features'
import Hero from '@/components/Hero'
import BestDeals from '@/components/BestDeals'
import React from 'react'

function Home() {
  return (
    <div>
      <Hero />
      <BestDeals />
      <Features />
    </div>
  )
}

export default Home