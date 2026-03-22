import FilterSidebar from '@/components/FilterSideBar'
import React, { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import ProductCard from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import API_BASE_URL from '@/utils/apiBase'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setProducts } from '@/redux/productSlice'

const Products = () => {
  const { products } = useSelector(store => store.product)
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [sortOrder, setSortOrder] = useState('')
  const dispatch = useDispatch()
  const categories = ["All", ...new Set(allProducts.map((p) => p?.category).filter(Boolean))]

  const getAllProducts = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_BASE_URL}/api/v1/product/getallproducts`)
      if (res.data.success) {
        setAllProducts(res.data.products)
        dispatch(setProducts(res.data.products))
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllProducts()
  }, [])

  useEffect(() => {
    if (allProducts.length === 0) return

    let filtered = [...allProducts]

    if (search.trim() !== "") {
      filtered = filtered.filter(p => p.productName?.toLowerCase().includes(search.toLowerCase()))
    }

    if (category !== "All") {
      filtered = filtered.filter(p => p.category === category)
    }

    filtered = filtered.filter(p => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1])

    if (sortOrder === "lowToHigh") {
      filtered.sort((a, b) => a.productPrice - b.productPrice)
    } else if (sortOrder === "highToLow") {
      filtered.sort((a, b) => b.productPrice - a.productPrice)
    }

    dispatch(setProducts(filtered))
  }, [search, category, sortOrder, priceRange, allProducts, dispatch])

  return (
    <div className='bg-[#fff5f7] min-h-screen pt-8 pb-12'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex flex-col md:flex-row gap-6'>
          <FilterSidebar
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            allProducts={allProducts}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />

          <div className='flex-1'>
            <div className='md:hidden mb-4 space-y-3'>
              <Input
                type='text'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search fabrics'
                className='bg-white rounded-lg'
              />
              <div className='flex items-center gap-2 overflow-x-auto pb-1'>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className='w-[150px] rounded-full bg-white border-pink-200 shrink-0'>
                    <SelectValue placeholder='Category' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categories.map((item) => (
                        <SelectItem key={item} value={item}>{item}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Select onValueChange={(value) => setSortOrder(value)}>
                  <SelectTrigger className='w-[150px] rounded-full bg-white border-pink-200 shrink-0'>
                    <SelectValue placeholder='Sort by price' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value='lowToHigh'>Low to high</SelectItem>
                      <SelectItem value='highToLow'>High to low</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Select
                  value={`${priceRange[0]}-${priceRange[1]}`}
                  onValueChange={(value) => {
                    const [min, max] = value.split('-').map(Number)
                    setPriceRange([min, max])
                  }}
                >
                  <SelectTrigger className='w-[150px] rounded-full bg-white border-pink-200 shrink-0'>
                    <SelectValue placeholder='Price range' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value='0-10000'>All prices</SelectItem>
                      <SelectItem value='0-500'>Under INR 500</SelectItem>
                      <SelectItem value='500-1000'>INR 500 - 1000</SelectItem>
                      <SelectItem value='1000-2000'>INR 1000 - 2000</SelectItem>
                      <SelectItem value='2000-10000'>Above INR 2000</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Button
                  type='button'
                  variant='outline'
                  className='rounded-full border-pink-200 shrink-0'
                  onClick={() => {
                    setSearch("")
                    setCategory("All")
                    setPriceRange([0, 10000])
                    setSortOrder('')
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
            <div className='flex flex-wrap items-center justify-between gap-4 mb-6 sticky top-24 bg-[#fff5f7] py-2 z-10'>
              <div>
                <h1 className='text-xl font-semibold text-slate-900'>All Fabrics</h1>
                <p className='text-sm text-slate-500'>Choose by category, price, and color.</p>
              </div>
              <Select onValueChange={(value) => setSortOrder(value)}>
                <SelectTrigger className='hidden md:flex w-full sm:w-[200px] bg-white rounded-lg'>
                  <SelectValue placeholder='Sort by price' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value='lowToHigh'>Price: Low to high</SelectItem>
                    <SelectItem value='highToLow'>Price: High to low</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div id='scroll' className='max-h-[calc(100vh-150px)] overflow-y-auto pr-2'>
              {loading && (
                <div className='text-sm text-slate-500 mb-4'>Loading products...</div>
              )}
              {products.length === 0 && !loading ? (
                <div className='rounded-xl border border-dashed border-pink-200 bg-white p-10 text-center'>
                  <h2 className='text-lg font-semibold text-slate-700'>No products found</h2>
                  <p className='text-sm text-slate-500 mt-2'>Try adjusting filters or search terms.</p>
                </div>
              ) : (
                <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5'>
                  {products.filter(Boolean).map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products
