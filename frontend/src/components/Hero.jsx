import React from 'react'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section className='bg-pink-50'>
      <div className='max-w-7xl mx-auto px-4 pt-10 pb-12 grid gap-8 lg:grid-cols-2 items-center'>
        <div className='space-y-4'>
          <h1 className='text-3xl md:text-4xl font-semibold text-slate-900'>
            Women&apos;s Fabrics for Daily Wear and Occasions
          </h1>
          <p className='text-slate-600'>
            Shop cottons, chiffons, georgettes, and blends. Pick your colors and get quality fabric at the right price.
          </p>
          <div className='flex gap-3'>
            <Button asChild className='bg-pink-600 hover:bg-pink-700 text-white'>
              <Link to='/products'>Shop Fabrics</Link>
            </Button>
            <Button asChild variant='outline' className='border-pink-200 text-slate-700 hover:bg-pink-100'>
              <Link to='/products'>View Offers</Link>
            </Button>
          </div>
          <div className='flex gap-6 text-sm text-slate-600'>
            <p>Easy returns</p>
            <p>Cash on delivery</p>
            <p>Trusted quality</p>
          </div>
        </div>
        <div className='bg-white w-[485px] h-[600px] rounded-2xl border border-pink-100 p-4 shadow-sm'>
          <img
            src='/diya-hero1.png'
            alt='Diya Fashion hero'
            className='rounded-xl object-cover w-full'
          />
        </div>
      </div>
    </section>
  )
}

export default Hero
