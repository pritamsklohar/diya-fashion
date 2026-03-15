import { Button } from '@/components/ui/button'
import axios from 'axios'
import API_BASE_URL from '@/utils/apiBase'
import { ArrowLeft } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const MyOrder = () => {
  const navigate = useNavigate()
  const [userOrder, setUserOrder] = useState([])

  const getUserOrders = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      const res = await axios.get(`${API_BASE_URL}/api/v1/orders/myorder`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      if (res.data.success) {
        setUserOrder(res.data.orders)
      } else {
        setUserOrder([])
      }
    } catch (error) {
      console.log(error)
      setUserOrder([])
    }
  }

  useEffect(() => {
    getUserOrders()
  }, [])

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-3'>
        <Button onClick={() => navigate(-1)} variant='outline' className='rounded-lg'>
          <ArrowLeft />
        </Button>
        <div>
          <h2 className='text-lg font-semibold text-slate-900'>Your Orders</h2>
          <p className='text-sm text-slate-500'>Track your recent purchases.</p>
        </div>
      </div>

      {userOrder.length === 0 ? (
        <div className='rounded-lg border border-pink-100 bg-pink-50 p-6 text-sm text-slate-600'>
          No orders found for this user.
        </div>
      ) : (
        <div className='space-y-4'>
          {userOrder.map((order) => (
            <div key={order._id} className='rounded-xl border border-pink-100 bg-white p-5 shadow-sm'>
              <div className='flex flex-wrap items-start justify-between gap-3'>
                <div>
                  <p className='text-sm text-slate-500'>Order ID:</p>
                  <p className='font-semibold text-slate-800 break-all'>{order._id}</p>
                </div>
                <div className='text-right'>
                  <p className='text-sm text-slate-500'>Amount:</p>
                  <p className='font-semibold text-slate-800'>INR {order.amount}</p>
                </div>
              </div>

              {order.user && (
                <div className='mt-3 text-sm text-slate-600'>
                  <p><span className='font-medium text-slate-700'>User:</span> {order.user.firstName} {order.user.lastName}</p>
                  <p><span className='font-medium text-slate-700'>Email:</span> {order.user.email}</p>
                </div>
              )}

              <div className='mt-3 flex items-center justify-between'>
                <p className='text-sm font-semibold text-slate-700'>Products:</p>
                <span className='text-xs font-semibold px-3 py-1 rounded-full bg-pink-100 text-pink-700 capitalize'>
                  {order.status}
                </span>
              </div>

              <div className='mt-3 space-y-3'>
                {order.products?.map((item, idx) => {
                  const product = item.productId
                  const img = product?.productImg?.[0]?.url
                  if (!product) return null

                  return (
                    <div key={`${order._id}-${idx}`} className='flex items-center gap-4 rounded-lg border border-pink-100 bg-pink-50/30 p-3'>
                      <Link
                        to={`/products/${product._id}`}
                        className='h-14 w-14 shrink-0 overflow-hidden rounded-md border border-pink-100 bg-white'
                      >
                        {img ? (
                          <img src={img} alt={product.productName} className='h-full w-full object-cover' />
                        ) : (
                          <div className='h-full w-full bg-pink-100' />
                        )}
                      </Link>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium text-slate-800 line-clamp-2'>
                          {product.productName}
                        </p>
                        <p className='text-xs text-slate-500'>Product ID: {product._id}</p>
                      </div>
                      <div className='text-sm font-semibold text-slate-700 whitespace-nowrap'>
                        INR {product.productPrice} x {item.quantity}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyOrder
