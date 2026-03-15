import ImageUpload from '@/components/ImageUpload'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { setProducts } from '@/redux/productSlice'
import axios from 'axios'
import API_BASE_URL from '@/utils/apiBase'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const AddProduct = () => {
  const accessToken = localStorage.getItem("accessToken")
  const dispatch = useDispatch()
  const { products } = useSelector(store => store.product)

  const [loading, setLoading] = useState(false)
  const [productData, setProductData] = useState({
    productName: "",
    productPrice: 0,
    productDesc: "",
    productImg: [],
    category: ""
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setProductData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("productName", productData.productName)
    formData.append("productPrice", productData.productPrice)
    formData.append("productDesc", productData.productDesc)
    formData.append("category", productData.category)

    if (productData.productImg.length === 0) {
      toast.error("Please select at least one image")
      return
    }

    productData.productImg.forEach((img) => {
      formData.append("files", img)
    })

    try {
      setLoading(true)
      const res = await axios.post(`${API_BASE_URL}/api/v1/product/add`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (res.data.success) {
        dispatch(setProducts([...products, res.data.product]))
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to add product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='px-4 sm:px-6 lg:px-9 pt-8 sm:pt-10 pb-12'>
      <div className='max-w-6xl'>
        <Card className='border border-pink-100'>
          <CardHeader>
            <CardTitle className='text-lg'>Add Product</CardTitle>
            <CardDescription>Enter product details to publish a new listing.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-2'>
              <Label>Product Name</Label>
              <Input
                type='text'
                name='productName'
                value={productData.productName}
                onChange={handleChange}
                placeholder='Fabric name'
                required
              />
            </div>

            <div className='grid gap-2'>
              <Label>Price (INR)</Label>
              <Input
                type='number'
                name='productPrice'
                value={productData.productPrice}
                onChange={handleChange}
                required
              />
            </div>

            <div className='grid gap-2'>
              <Label>Category</Label>
              <Input
                type='text'
                name='category'
                value={productData.category}
                onChange={handleChange}
                placeholder='Cotton, Silk, etc.'
                required
              />
            </div>

            <div className='grid gap-2'>
              <Label>Description</Label>
              <Textarea
                name='productDesc'
                value={productData.productDesc}
                onChange={handleChange}
                placeholder='Describe the fabric'
              />
            </div>

            <ImageUpload productData={productData} setProductData={setProductData} />
          </CardContent>
          <CardFooter className='flex-col gap-2'>
            <Button
              disabled={loading}
              onClick={submitHandler}
              className='w-full bg-pink-600 hover:bg-pink-700 text-white rounded-lg'
              type='submit'
            >
              {loading ? (
                <span className='flex gap-2 items-center'>
                  <Loader2 className='animate-spin' /> Please wait
                </span>
              ) : (
                'Add Product'
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default AddProduct
