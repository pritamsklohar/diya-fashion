import { ShoppingCart } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { setCart } from '@/redux/productSlice'
import { cn } from '@/lib/utils'
import API_BASE_URL from '@/utils/apiBase'

const ProductCard = ({ product, className }) => {
  const { productImg, productPrice, productName } = product
  const displayName = (productName || '')
    .replace(/[-_]{2,}/g, '-')
    .replace(/\s*-\s*/g, ' - ')
    .trim()

  const accessToken = localStorage.getItem('accessToken')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const addToCart = async (productId) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/v1/cart/add`, { productId }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.data.success) {
        toast.success('Product added to cart')
        dispatch(setCart(res.data.cart))
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className={cn('rounded-lg sm:rounded-xl border border-pink-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition', className)}>
      <div className='relative aspect-square sm:aspect-[4/5] overflow-hidden bg-pink-50'>
        <img
          onClick={() => navigate(`/products/${product._id}`)}
          src={productImg[0]?.url}
          alt={productName}
          className='h-full w-full object-cover cursor-pointer'
        />
      </div>
      <div className='p-2 sm:p-3 space-y-1.5 sm:space-y-2'>
        <h1 className='text-xs sm:text-sm font-medium text-slate-800 truncate sm:whitespace-normal sm:line-clamp-2 min-h-[20px] sm:min-h-[40px]'>
          {displayName}
        </h1>
        <div className='space-y-1.5 sm:space-y-2'>
          <p className='text-xs sm:text-sm font-semibold text-slate-900'>INR {productPrice}</p>
          <div className='flex items-center gap-1.5 sm:gap-2'>
            <Button
              variant='outline'
              size='xs'
              onClick={() => navigate(`/products/${product._id}`)}
              className='flex-1 border-pink-200 text-pink-700 hover:bg-pink-50'
            >
              View
            </Button>
            <Button
              size='xs'
              onClick={() => (addToCart(product._id))}
              className='flex-1 bg-pink-600 text-white hover:bg-pink-700'
            >
              <ShoppingCart className='h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1' /> Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
