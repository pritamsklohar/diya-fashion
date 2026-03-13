import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDispatch, useSelector } from 'react-redux';
import userLogo from '../assets/user.png';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { setCart } from '@/redux/productSlice';
import { toast } from 'sonner';

const Cart = () => {
  const { cart } = useSelector((store) => store.product);

  const subtotal = cart?.totalPrice || 0;
  const shipping = subtotal > 299 ? 0 : 10;
  const tax = subtotal * 0.05; // 5% Tax
  const total = subtotal + shipping + tax;
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
        toast.success("Product removed form Cart")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const loadCart = async () => {
    try {
      const res = await axios.post(`${API}/get`, null,  {
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
    <div className='pt-30 bg-gray-50 min-h-screen'>
      {cart?.items?.length > 0 ? (
        <div className='max-w-7xl mx-auto'>
          <h1 className='text-2xl font-bold text-gray-800 mb-7'>Shopping Cart</h1>

          <div className='flex flex-col md:flex-row gap-7'>
            {/* Left Side: Cart Items List */}
            <div className='flex flex-col gap-5 flex-1'>
              {cart?.items?.map((product, index) => (
                <Card key={index}>
                  <CardContent className='p-4'>
                    <div className='flex justify-between items-center pr-7'>
                      <div className='flex items-center w-[350px]'>
                        <img
                          src={product?.productId?.productImg?.[0]?.url || userLogo}
                          alt=""
                          className='w-25 h-25 object-cover rounded'
                        />
                        <div className='ml-4 w-[280px]'>
                          <h1 className='font-semibold truncate'>
                            {product?.productId?.productName}
                          </h1>
                          <p className='text-sm text-gray-600'>
                            ₹{product?.productId?.productPrice}
                          </p>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className='flex gap-5 items-center'>
                        <Button onClick={() => handleUpdateQuantity(product.productId._id, 'decrease')} variant='outline' size="sm">-</Button>
                        <span>{product.quantity}</span>
                        <Button onClick={() => handleUpdateQuantity(product.productId._id, 'increase')} variant='outline' size="sm">+</Button>
                      </div>

                      {/* Item Total Price */}
                      <p className='font-medium'>
                        ₹{(product?.productId?.productPrice) * (product?.quantity)}
                      </p>

                      {/* Remove Button */}
                      <div className='flex text-red-500 items-center gap-1 cursor-pointer'>
                        <Trash2 className='w-4 h-4' />
                        <p onClick={() => handleRemove(product?.productId?._id)} className='text-sm'>Remove</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Right Side: Order Summary */}
            <div className='w-full md:w-[400px]'>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='flex justify-between'>
                    <span>Subtotal ({cart?.items?.length} items)</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Tax (5%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className='flex justify-between font-bold text-lg'>
                    <span>Total</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Promo Code Section */}
                  <div className='space-y-3 pt-4'>
                    <div className='flex space-x-2'>
                      <Input placeholder="Promo Code" />
                      <Button variant='outline'>Apply</Button>
                    </div>
                  </div>

                  <Button onClick={()=>navigate('/address')} className='w-full bg-pink-600 hover:bg-pink-700 text-white'>
                    PLACE ORDER
                  </Button>

                  <Button variant='outline' className='w-full' asChild>
                    <Link to="/products">Continue Shopping</Link>
                  </Button>

                  <div className='text-sm text-muted-foreground pt-4 space-y-1'>
                    <p>* Free shipping on orders over 299</p>
                    <p>* 30-days return policy</p>
                    <p>* Secure checkout with SSL encryption</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Cart State */
        <div className='flex flex-col items-center justify-center min-h-[60vh] p-6 text-center'>
          {/* Icon Section */}
          <div className='bg-pink-100 p-6 rounded-full'>
            <ShoppingCart className='w-16 h-16 text-pink-600' />
          </div>

          <h2 className='mt-6 text-2xl font-bold'>Your Cart is Empty</h2>
          <p className='mt-2 text-gray-600'>
            Looks like you haven't added anything to your cart yet.
          </p>

          <Button
            onClick={() => navigate('/products')}
            className='mt-6 cursor-pointer bg-pink-600 text-white py-3 px-8'
          >
            Shop Now
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
