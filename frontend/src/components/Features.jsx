import React from 'react'
import { Truck, Shield, Headphones } from 'lucide-react'

const Features = () => {
  const items = [
    {
      title: 'Fast Delivery',
      desc: 'Quick shipping across cities.',
      icon: Truck
    },
    {
      title: 'Secure Payments',
      desc: 'Safe checkout for every order.',
      icon: Shield
    },
    {
      title: 'Support',
      desc: 'We help you choose the right fabric.',
      icon: Headphones
    }
  ]

  return (
    <section className='py-12 bg-white'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='grid gap-4 md:grid-cols-3'>
          {items.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className='rounded-xl border border-pink-100 bg-pink-50/40 p-5'>
                <div className='h-10 w-10 rounded-full bg-pink-100 grid place-items-center text-pink-600'>
                  <Icon className='h-5 w-5' />
                </div>
                <h3 className='mt-3 text-sm font-semibold text-slate-800'>{item.title}</h3>
                <p className='text-sm text-slate-600 mt-1'>{item.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Features
