import React, { useEffect, useMemo, useState } from 'react'
import { Button } from './ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import API_BASE_URL from '@/utils/apiBase'

const Hero = () => {
  const [products, setProducts] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/v1/product/getallproducts`)
        if (res.data.success) setProducts(res.data.products || [])
      } catch (e) {
        console.log(e)
      }
    }
    load()
  }, [])

  const featured = useMemo(() => {
    if (!products.length) return null
    return products[Math.floor(Math.random() * products.length)]
  }, [products])

  return (
    <section className='relative overflow-hidden bg-[#fff1f5]'>
      <div
        className='absolute inset-0 opacity-12'
        style={{
          backgroundImage: "url('/polka-dot-cotton-fabric.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        aria-hidden='true'
      />
      <div className='absolute -top-24 -left-20 h-64 w-64 rounded-full bg-gradient-to-br from-pink-300/60 to-yellow-200/60 blur-2xl' aria-hidden='true' />
      <div className='absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-gradient-to-tr from-pink-400/40 to-amber-200/50 blur-3xl' aria-hidden='true' />

      <div className='relative max-w-7xl mx-auto px-4 pt-12 pb-14 grid gap-10 lg:grid-cols-2 items-center'>
        <div className='space-y-5'>
          <div className='inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/80 px-3 py-1 text-xs font-semibold text-pink-700'>
            <span className='h-2 w-2 rounded-full bg-pink-600' />
            New arrivals every week
          </div>
          <h1 className='text-4xl md:text-5xl font-semibold text-slate-900 leading-tight'>
            Fabrics that
            <span className='block text-pink-600'>elevate every outfit</span>
          </h1>
          <p className='text-slate-600 max-w-xl'>
            Shop cottons, chiffons, georgettes, and festive blends. Premium feel, vibrant colors, and honest pricing.
          </p>
          <div className='flex flex-wrap gap-3'>
            <Button asChild className='bg-pink-600 hover:bg-pink-700 text-white'>
              <Link to='/products'>Shop Fabrics</Link>
            </Button>
            <Button asChild variant='outline' className='border-pink-200 text-slate-700 hover:bg-pink-100'>
              <Link to='/products'>View Offers</Link>
            </Button>
          </div>
          <div className='grid grid-cols-3 gap-4 text-sm text-slate-700 max-w-md'>
            <div className='rounded-xl border border-pink-100 bg-white/70 p-3 text-center'>
              <p className='text-lg font-semibold text-slate-900'>1k+</p>
              <p className='text-xs text-slate-500'>Happy buyers</p>
            </div>
            <div className='rounded-xl border border-pink-100 bg-white/70 p-3 text-center'>
              <p className='text-lg font-semibold text-slate-900'>40+</p>
              <p className='text-xs text-slate-500'>Fabric types</p>
            </div>
            <div className='rounded-xl border border-pink-100 bg-white/70 p-3 text-center'>
              <p className='text-lg font-semibold text-slate-900'>COD</p>
              <p className='text-xs text-slate-500'>Easy payment</p>
            </div>
          </div>
        </div>

        <div className='relative'>
          <div className='bg-white/90 w-full max-w-[520px] aspect-[4/5] rounded-3xl border border-pink-100 p-4 shadow-lg mx-auto lg:mx-0 lg:justify-self-end backdrop-blur-sm'>
            {featured ? (
              <button
                type='button'
                onClick={() => navigate(`/products/${featured._id}`)}
                className='group relative h-full w-full overflow-hidden rounded-2xl'
                aria-label={`View ${featured.productName}`}
              >
                <img
                  src={featured.productImg?.[0]?.url || '/diya-hero1.png'}
                  alt={featured.productName}
                  className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]'
                />
                <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 text-left'>
                  <p className='text-xs text-white/80'>{featured.category}</p>
                  <p className='text-base font-semibold text-white line-clamp-2'>{featured.productName}</p>
                  <div className='mt-2 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900'>
                    INR {featured.productPrice}
                  </div>
                </div>
              </button>
            ) : (
              <img
                src='/diya-hero1.png'
                alt='Diya Fashion hero'
                className='rounded-2xl object-cover w-full h-full'
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
