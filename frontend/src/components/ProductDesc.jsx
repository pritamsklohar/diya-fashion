import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import API_BASE_URL from '@/utils/apiBase'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setCart } from '@/redux/productSlice'

const ProductDesc = ({ product }) => {
  const accessToken = localStorage.getItem("accessToken")
  const dispatch = useDispatch()
  const [quantity, setQuantity] = useState(1)

  const addToCart = async (productId) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/v1/cart/add`, { productId, quantity }, {
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
    <div className='space-y-4'>
      <div className='space-y-1'>
        <h1 className='text-2xl font-semibold text-slate-900'>{product?.productName}</h1>
        <p className='text-sm text-slate-500'>{product?.category} | {product?.brand || 'Diya'}</p>
      </div>

      <p className='text-xl font-semibold text-pink-600'>INR {product?.productPrice}</p>

      <p className='text-sm text-slate-600 leading-relaxed'>{product?.productDesc}</p>

      <div className='flex items-center gap-3'>
        <div className='flex items-center gap-2 rounded-md border border-pink-100 bg-white px-3 py-2'>
          <p className='text-sm font-medium text-slate-700'>Qty</p>
          <Input
            type='number'
            min={1}
            className='w-16 h-9'
            value={quantity}
            onChange={(e) => {
              const next = parseInt(e.target.value, 10)
              setQuantity(Number.isFinite(next) && next > 0 ? next : 1)
            }}
          />
        </div>
        <Button
          onClick={() => addToCart(product?._id)}
          className='bg-pink-600 hover:bg-pink-700 text-white px-6'
        >
          Add to Cart
        </Button>
      </div>

      <div className='grid gap-2 text-sm text-slate-500'>
        <p>Free shipping above INR 299</p>
        <p>Easy returns within 30 days</p>
      </div>
    </div>
  )
}

export default ProductDesc
