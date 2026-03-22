import React, { useEffect, useState } from 'react'
import axios from 'axios'
import API_BASE_URL from '@/utils/apiBase'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setProducts } from '@/redux/productSlice'
import ProductCard from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const HomeProducts = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const getAllProducts = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_BASE_URL}/api/v1/product/getallproducts`)
      if (res.data.success) {
        setItems(res.data.products)
        dispatch(setProducts(res.data.products))
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllProducts()
  }, [])

  const categories = Array.from(new Set(items.map(p => p.category).filter(Boolean)))

  return (
    <section className='py-12'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='rounded-2xl border border-pink-100 bg-white/70 backdrop-blur-sm p-6 sm:p-8'>
          <div className='flex flex-wrap items-center justify-between gap-4 mb-6'>
            <div>
              <h2 className='text-xl font-semibold text-slate-900'>Shop by Category</h2>
            </div>
            <Button
              variant='outline'
              onClick={() => navigate('/products')}
              className='border-pink-200 text-pink-700 hover:bg-pink-50'
            >
              View All
            </Button>
          </div>

          {loading ? (
            <div className='text-sm text-slate-500'>Loading products...</div>
          ) : items.length === 0 ? (
            <div className='rounded-xl border border-dashed border-pink-200 bg-white p-10 text-center'>
              <h3 className='text-lg font-semibold text-slate-700'>No products available</h3>
              <p className='text-sm text-slate-500 mt-2'>Please check back soon.</p>
            </div>
          ) : (
            <div className='space-y-8'>
              

              {categories.map((cat) => (
                <div key={cat} className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <h3 className='text-base font-semibold text-slate-800'>{cat}</h3>
                  </div>
                  <div className='flex gap-4 overflow-x-auto pb-2'>
                    {items.filter(p => p?.category === cat).map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        className='w-[170px] sm:w-[220px] lg:w-[240px] shrink-0'
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default HomeProducts
