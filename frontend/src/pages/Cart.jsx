import React, { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDispatch, useSelector } from 'react-redux'
import userLogo from '../assets/user.png'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { setCart } from '@/redux/productSlice'
import { toast } from 'sonner'

const Cart = () => {
  const { cart } = useSelector((store) => store.product)

  const subtotal = cart?.totalPrice || 0
  const shipping = subtotal > 299 ? 0 : 10
  const tax = subtotal * 0.05
  const total = subtotal + shipping + tax
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const API = "http://localhost:8000/api/v1/cart"
  const accessToken = localStorage.getItem("accessToken")

  const handleUpdateQuantity = async (productId, type) => {
    try {
      const res = await axios.put(`${API}/update`, { productId, type }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (res.data.success) {
        dispatch(setCart(res.data.cart))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleRemove = async (productId) => {
    try {
      const res = await axios.delete(`${API}/remove`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: { productId }
      })

      if (res.data.success) {
        dispatch(setCart(res.data.cart))
        toast.success("Product removed from cart")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const loadCart = async () => {
    try {
      const res = await axios.post(`${API}/get`, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.data.success) {
        dispatch(setCart(res.data.cart))
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    loadCart()
  }, [dispatch])

  return (
    <div className='bg-[#fff5f7] min-h-screen pt-12 pb-12'>
      {cart?.items?.length > 0 ? (
        <div className='max-w-7xl mx-auto px-4'>
          <div className='flex items-center justify-between mb-6 flex-wrap gap-3'>
            <div>
              <h1 className='text-xl font-semibold text-slate-900'>Shopping Cart</h1>
              <p className='text-sm text-slate-500'>Review your items before checkout.</p>
            </div>
            <Button variant='outline' className='rounded-lg' asChild>
              <Link to='/products'>Continue Shopping</Link>
            </Button>
          </div>

          <div className='grid gap-6 lg:grid-cols-[1.2fr_0.8fr]'>
            <div className='space-y-4'>
              {cart?.items?.map((product, index) => (
                <Card key={index} className='border border-pink-100'>
                  <CardContent className='p-4 flex flex-col gap-4 md:flex-row md:items-center'>
                    <div className='flex items-center gap-4 flex-1'>
                      <img
                        src={product?.productId?.productImg?.[0]?.url || userLogo}
                        alt=''
                        className='w-20 h-24 object-cover rounded-lg border border-pink-100'
                      />
                      <div>
                        <h1 className='font-medium text-slate-800'>
                          {product?.productId?.productName}
                        </h1>
                        <p className='text-sm text-slate-500'>INR {product?.productId?.productPrice}</p>
                      </div>
                    </div>

                    <div className='flex items-center gap-3'>
                      <Button
                        onClick={() => handleUpdateQuantity(product.productId._id, 'decrease')}
                        variant='outline'
                        size='sm'
                        className='rounded-lg'
                      >
                        -
                      </Button>
                      <span className='min-w-6 text-center text-sm font-semibold'>{product.quantity}</span>
                      <Button
                        onClick={() => handleUpdateQuantity(product.productId._id, 'increase')}
                        variant='outline'
                        size='sm'
                        className='rounded-lg'
                      >
                        +
                      </Button>
                    </div>

                    <p className='font-semibold text-slate-700'>
                      INR {(product?.productId?.productPrice) * (product?.quantity)}
                    </p>

                    <button
                      type='button'
                      onClick={() => handleRemove(product?.productId?._id)}
                      className='flex items-center gap-1 text-pink-600 text-sm'
                    >
                      <Trash2 className='w-4 h-4' /> Remove
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className='lg:sticky lg:top-24 h-max'>
              <Card className='border border-pink-100'>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='flex justify-between text-sm'>
                    <span>Subtotal ({cart?.items?.length} items)</span>
                    <span>INR {subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `INR ${shipping}`}</span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span>Tax (5%)</span>
                    <span>INR {tax.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className='flex justify-between font-semibold text-lg'>
                    <span>Total</span>
                    <span>INR {total.toLocaleString('en-IN')}</span>
                  </div>

                  <div className='space-y-3 pt-2'>
                    <div className='flex space-x-2'>
                      <Input placeholder='Promo code' className='rounded-lg' />
                      <Button variant='outline' className='rounded-lg'>Apply</Button>
                    </div>
                  </div>

                  <Button
                    onClick={() => navigate('/address')}
                    className='w-full bg-pink-600 hover:bg-pink-700 text-white rounded-lg'
                  >
                    Place Order
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center min-h-[60vh] p-6 text-center'>
          <div className='bg-pink-100 p-6 rounded-full'>
            <ShoppingCart className='w-16 h-16 text-pink-600' />
          </div>

          <h2 className='mt-6 text-xl font-semibold text-slate-800'>Your cart is empty</h2>
          <p className='mt-2 text-slate-600'>Looks like you have not added anything yet.</p>

          <Button
            onClick={() => navigate('/products')}
            className='mt-6 bg-pink-600 text-white px-8 rounded-lg'
          >
            Shop Now
          </Button>
        </div>
      )}
    </div>
  )
}

export default Cart
