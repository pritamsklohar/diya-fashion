import FilterSidebar from '@/components/FilterSidebar'
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
import axios from 'axios'
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

    const getAllProducts = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`http://localhost:8000/api/v1/product/getallproducts`)
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

    useEffect(()=>{
        if(allProducts.length === 0) return

        let filtered = [...allProducts]

        if(search.trim() !== ""){
            filtered = filtered.filter(p=>p.productName?.toLowerCase().includes(search.toLowerCase())) 

        }

        if(category !== "All"){
            filtered = filtered.filter(p=>p.category === category)
        }

        filtered = filtered.filter(p=>p.productPrice>= priceRange[0] && p.productPrice <= priceRange[1])

        if(sortOrder === "lowToHigh"){
            filtered.sort((a, b)=>a.productPrice -b.productPrice)
        } else if(sortOrder === "highToLow" ){
            filtered.sort((a, b)=>b.productPrice -a.productPrice)
        }

        dispatch(setProducts(filtered))
    }, [search, category, sortOrder, priceRange, allProducts, dispatch])


    return (
        <div className='pt-30 pb-10'>
            <div className='max-w-7xl mx-auto flex gap-7'>
                {/* sidebar */}
                <FilterSidebar
                search={search} 
                setSearch={setSearch}
                category={category}
                setCategory={setCategory}
                allProducts={allProducts} 
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                
                />

                {/* Main product section */}
                <div className='flex flex-col flex-1'>
                    <div className='flex justify-end mb-4'>
                        <Select onValueChange={(value)=>setSortOrder(value)}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Short by price" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="lowToHigh">Price: Low to high</SelectItem>
                                    <SelectItem value="highToLow">Price: High to low</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-7'>
                        {
                            products.filter(Boolean).map((product) => {
                                return <ProductCard key={product._id} product={product} loading={loading} />
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Products
