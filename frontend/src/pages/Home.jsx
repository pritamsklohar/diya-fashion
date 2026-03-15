import Features from '@/components/Features'
import Hero from '@/components/Hero'
import HomeProducts from '@/components/HomeProducts'
import React from 'react'

const Home = () => {
  return (
    <main className='bg-[#fff5f7]'>
      <Hero />
      <HomeProducts />
      <Features />
    </main>
  )
}

export default Home
