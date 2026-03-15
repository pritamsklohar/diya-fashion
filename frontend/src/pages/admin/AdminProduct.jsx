import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Edit, Search, Trash2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDispatch, useSelector } from 'react-redux'
import { Card } from '@/components/ui/card'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from '@/components/ui/textarea'
import ImageUpload from '@/components/ImageUpload'
import { toast } from 'sonner'
import { setProducts } from '@/redux/productSlice'
import axios from 'axios'
import API_BASE_URL from '@/utils/apiBase'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const AdminProduct = () => {
  const { products } = useSelector(store => store.product)
  const [editProduct, setEditProduct] = useState(null)
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("")
  const accessToken = localStorage.getItem("accessToken")
  const dispatch = useDispatch()

  let filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (sortOrder === 'lowToHigh') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.productPrice - b.productPrice)
  }

  if (sortOrder === 'highToLow') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.productPrice - a.productPrice)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditProduct(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async (e) => {
    e.preventDefault()

    const formData = new FormData()

    if (!editProduct) return

    formData.append("productName", editProduct.productName || "")
    formData.append("productDesc", editProduct.productDesc || "")
    formData.append("productPrice", editProduct.productPrice || "")
    formData.append("category", editProduct.category || "")

    const existingImages = (editProduct.productImg || [])
      .filter((img) => !(img instanceof File) && img.public_id)
      .map((img) => img.public_id)

    formData.append("existingImages", JSON.stringify(existingImages))

    ;(editProduct.productImg || [])
      .filter((img) => img instanceof File)
      .forEach((file) => {
        formData.append("files", file)
      })

    try {
      const res = await axios.put(`${API_BASE_URL}/api/v1/product/update/${editProduct._id}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (res.data.success) {
        toast.success("Product updated successfully")
        const safeProducts = Array.isArray(products) ? products.filter(Boolean) : []
        const updateProducts = safeProducts.map((p) =>
          p._id === editProduct._id
            ? { ...p, ...editProduct, productImg: p.productImg }
            : p
        )
        dispatch(setProducts(updateProducts))
        setOpen(false)
        setEditProduct(null)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const deleteProductHandler = async (productId) => {
    try {
      const remainingProducts = products.filter((product) => product._id !== productId)

      const res = await axios.delete(`${API_BASE_URL}/api/v1/product/delete/${productId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (res.data.success) {
        toast.success(res.data.message)
        dispatch(setProducts(remainingProducts))
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='px-4 sm:px-6 lg:px-9 pt-8 sm:pt-10 pb-12'>
      <div className='flex flex-wrap gap-4 items-center justify-between mb-6'>
        <div>
          <h1 className='text-lg font-semibold text-slate-900'>Product Management</h1>
          <p className='text-sm text-slate-500'>Edit or remove fabric listings.</p>
        </div>

        <div className='flex flex-wrap gap-3 items-center w-full sm:w-auto'>
          <div className='relative bg-white rounded-lg border border-pink-100'>
            <Input
              type='text'
              placeholder='Search products...'
              className='w-full sm:w-[240px] rounded-lg pl-9'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className='absolute left-3 top-2.5 text-slate-400 w-4' />
          </div>

          <Select onValueChange={(value) => setSortOrder(value)}>
            <SelectTrigger className='w-full sm:w-[180px] bg-white rounded-lg'>
              <SelectValue placeholder='Sort by price' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='lowToHigh'>Price: Low to High</SelectItem>
              <SelectItem value='highToLow'>Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='space-y-3'>
        {filteredProducts.filter(Boolean).map((product) => {
          const imageUrl = product?.productImg?.[0]?.url
          return (
            <Card key={product?._id} className='p-4 border border-pink-100'>
              <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                <div className='flex gap-4 items-center'>
                  {imageUrl ? (
                    <img src={imageUrl} alt='' className='w-20 h-20 rounded-lg object-cover' />
                  ) : (
                    <div className='w-20 h-20 bg-pink-50 border border-dashed rounded-lg' />
                  )}
                  <div>
                    <h1 className='font-medium text-slate-800'>{product.productName}</h1>
                    <p className='text-sm text-slate-500'>{product.category}</p>
                  </div>
                </div>
                <div className='flex flex-wrap items-center gap-4'>
                  <p className='font-semibold text-slate-700'>INR {product.productPrice}</p>

                  <div className='flex gap-3'>
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
                        <button type='button' onClick={() => { setEditProduct(product), setOpen(true) }}>
                          <Edit className='text-pink-600 cursor-pointer' />
                        </button>
                      </DialogTrigger>
                      <DialogContent className='sm:max-w-[625px] max-h-[740px] overflow-y-scroll'>
                        <DialogHeader>
                          <DialogTitle>Edit Product</DialogTitle>
                          <DialogDescription>
                            Update the fabric details and save.
                          </DialogDescription>
                        </DialogHeader>

                        <div className='flex flex-col gap-3'>
                          <div className='grid gap-2'>
                            <Label>Product Name</Label>
                            <Input value={editProduct?.productName} onChange={handleChange} type='text' name='productName' placeholder='Fabric name' required />
                          </div>
                          <div className='grid gap-2'>
                            <Label>Price</Label>
                            <Input value={editProduct?.productPrice} onChange={handleChange} type='number' name='productPrice' required />
                          </div>
                          <div className='grid gap-2'>
                            <Label>Category</Label>
                            <Input value={editProduct?.category} onChange={handleChange} type='text' name='category' placeholder='Cotton' required />
                          </div>
                          <div className='grid gap-2'>
                            <Label>Description</Label>
                            <Textarea value={editProduct?.productDesc} onChange={handleChange} name='productDesc' placeholder='Describe the fabric' />
                          </div>
                          <ImageUpload productData={editProduct} setProductData={setEditProduct} />
                        </div>

                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant='outline'>Cancel</Button>
                          </DialogClose>
                          <Button onClick={handleSave} type='submit'>Save changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button type='button'>
                          <Trash2 className='text-pink-600 cursor-pointer' />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this product?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this product.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteProductHandler(product._id)}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default AdminProduct
