import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import { addAddress, deleteAddress, setCart, setSelectedAddress } from '@/redux/productSlice'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import axios from 'axios'
import API_BASE_URL from '@/utils/apiBase'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

const AddressForm = () => {
  const emptyForm = useMemo(() => ({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  }), [])
  const [formData, setFormData] = useState(emptyForm)
  const [showSavedList, setShowSavedList] = useState(false)
  const { addresses, selectedAddress, cart } = useSelector((store) => store.product)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = (e) => {
    e.preventDefault()
    dispatch(addAddress(formData))
    setFormData(emptyForm)
  }

  const handlePayment = async () => {
    const accessToken = localStorage.getItem("accessToken")
    try {
      if (!window.Razorpay) {
        const scriptLoaded = await new Promise((resolve) => {
          const script = document.createElement("script")
          script.src = "https://checkout.razorpay.com/v1/checkout.js"
          script.onload = () => resolve(true)
          script.onerror = () => resolve(false)
          document.body.appendChild(script)
        })
        if (!scriptLoaded) {
          toast.error("Failed to load Razorpay. Check your internet connection.")
          return
        }
      }

      const { data } = await axios.post(`${API_BASE_URL}/api/v1/orders/create-order`, {
        products: cart?.items?.map(item => ({
          productId: item.productId?._id || item.product?._id,
          quantity: item.quantity,
        })),
        tax,
        shipping,
        amount: total,
        currency: "INR"
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (!data.success) return toast.error("Something went wrong")

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        order_id: data.order.id,
        name: "Diya Fashion",
        description: "Order Payment",
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(`${API_BASE_URL}/api/v1/orders/verify-payment`, response, {
              headers: { Authorization: `Bearer ${accessToken}` }
            })
            if (verifyRes.data.success) {
              toast.success("✅ Payment Successfull!")
              dispatch(setCart({ items: [], totalPrice: 0 }))
              navigate("/order-success")
            } else {
              toast.error("❌ Payment Verification Failed")
            }
          } catch (error) {
            toast.error("Error verifying payment")
          }
        },
        modal: {
          ondismiss: async function () {
            await axios.post(`${API_BASE_URL}/api/v1/orders/verify-payment`, {
              razorpay_order_id: data.order.id,
              paymentFailed: true
            }, {
              headers: { Authorization: `Bearer ${accessToken}` }
            })
            toast.error("Payment cancelled or failed")
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone
        },
        theme: { color: "#F47286" }
      }

      const rzp = new window.Razorpay(options)

      rzp.on("payment.failed", async function (response) {
        await axios.post(`${API_BASE_URL}/api/v1/orders/verify-payment`, {
          razorpay_order_id: data.order.id,
          paymentFailed: true
        }, {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
        toast.error("Payment failed please try again")
      })

      rzp.open()
    } catch (error) {
      console.error(error)
      toast.error("SOmething went wrong while processing payment")
    }
  }

  const subtotal = cart?.totalPrice || 0
  const shipping = subtotal > 299 ? 0 : 10
  const tax = subtotal * 0.05
  const total = subtotal + shipping + tax

  const canShowSaved = Array.isArray(addresses) && addresses.length > 0

  return (
    <div className='bg-[#fff5f7] min-h-screen pt-20 pb-12'>
      <div className='max-w-5xl mx-auto w-full px-4'>
        <div className='mb-6'>
          <div>
            <h1 className='text-xl font-semibold text-slate-900'>Delivery Address</h1>
            <p className='text-sm text-slate-500'>Add an address and select one to place your order.</p>
          </div>

        </div>

        {showSavedList && canShowSaved ? (
          <div className='grid gap-6 lg:grid-cols-[1.1fr_0.9fr]'>
            <div className='rounded-xl border border-pink-100 bg-white p-5'>
              <div className='flex items-center justify-between mb-4'>
                <h2 className='text-lg font-semibold'>Saved Addresses</h2>
                <p className='text-xs text-slate-500'>Tap one to select</p>
              </div>

              <div className='space-y-3'>
                {addresses.map((addr, index) => {
                  const isSelected = selectedAddress === index
                  return (
                    <div
                      key={index}
                      type='button'
                      onClick={() => dispatch(setSelectedAddress(index))}
                      className={`w-full text-left border p-4 rounded-lg cursor-pointer transition ${isSelected ? "border-pink-600 bg-pink-50" : "border-pink-100 bg-white"
                        }`}
                    >
                      <div className='flex items-start justify-between gap-3'>
                        <div>
                          <p className='font-medium text-slate-800'>{addr.fullName}</p>
                          <p className='text-sm text-slate-600'>{addr.phone}</p>
                          <p className='text-sm text-slate-600'>{addr.email}</p>
                          <p className='text-sm text-slate-600'>
                            {addr.address}, {addr.city}, {addr.state}, {addr.zip}, {addr.country}
                          </p>
                        </div>
                        <button
                          type='button'
                          onClick={(e) => {
                            e.stopPropagation()
                            dispatch(deleteAddress(index))
                          }}
                          className='text-xs text-pink-600 hover:underline'
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              <Button
                type='button'
                variant='outline'
                className='rounded-lg mt-4'
                onClick={() => setShowSavedList(false)}
              >
                Add New Address
              </Button><br />
              <Button
                type='button'
                onClick={handlePayment}
                variant='outline'
                className='rounded-lg mt-4 w-full bg-pink-600 text-white hover:bg-pink-500 hover:text-white'
              >
                Continue to Purchase
              </Button>
            </div>

            <div>
              <Card className='border border-pink-100'>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='flex justify-between text-sm'>
                    <span>Subtotal ({cart?.items?.length || 0} items)</span>
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

                  <div className='text-xs text-slate-500 pt-2 space-y-1'>
                    <p>Free shipping on orders over INR 299</p>
                    <p>Secure checkout</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className='rounded-xl border border-pink-100 bg-white p-5 max-w-full'>
            <form className='space-y-4' onSubmit={handleSave}>
              <div>
                <Label htmlFor='fullName'>Full Name</Label>
                <Input className='mt-2' id='fullName' name='fullName' required value={formData.fullName} onChange={handleChange} placeholder='Full name' />
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='phone'>Phone</Label>
                  <Input className='mt-2' id='phone' name='phone' required value={formData.phone} onChange={handleChange} placeholder='Phone number' />
                </div>
                <div>
                  <Label htmlFor='email'>Email</Label>
                  <Input className='mt-2' id='email' name='email' type='email' required value={formData.email} onChange={handleChange} placeholder='Email address' />
                </div>
              </div>
              <div>
                <Label htmlFor='address'>Street Address</Label>
                <Input className='mt-2' id='address' name='address' required value={formData.address} onChange={handleChange} placeholder='House, street, area' />
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='city'>City</Label>
                  <Input className='mt-2' id='city' name='city' required value={formData.city} onChange={handleChange} placeholder='City' />
                </div>
                <div>
                  <Label htmlFor='state'>State</Label>
                  <Input className='mt-2' id='state' name='state' required value={formData.state} onChange={handleChange} placeholder='State' />
                </div>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='zip'>Zip Code</Label>
                  <Input className='mt-2' id='zip' name='zip' required value={formData.zip} onChange={handleChange} placeholder='Zip code' />
                </div>
                <div>
                  <Label htmlFor='country'>Country</Label>
                  <Input className='mt-2' id='country' name='country' required value={formData.country} onChange={handleChange} placeholder='Country' />
                </div>
              </div>
              <Button type='submit' className='w-full bg-pink-600 hover:bg-pink-700 text-white rounded-lg'>
                Save Address
              </Button>
              {canShowSaved && !showSavedList && (
                <Button
                  type='button'
                  variant='outline'
                  className='rounded-lg w-full'
                  onClick={() => setShowSavedList(true)}
                >
                  Select Address
                </Button>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default AddressForm
