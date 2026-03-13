import React from 'react'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'

const FilterSidebar = ({ allProducts, priceRange, search, setSearch, category, setCategory, setPriceRange }) => {
    // Dynamically extract unique categories
    const Categories = allProducts.map(p => p.category)
    const UniqueCategory = ["All", ...new Set(Categories)]

    const handleCategoryClick =(val)=>{
        setCategory(val)
    }

    const handleMinChange = (e)=>{
        const value = Number(e.target.value)
        if(value <= priceRange[1]) setPriceRange([value, priceRange[1]])
    }

    const handleMaxChange = (e)=>{
        const value = Number(e.target.value)
        if(value >= priceRange[0]) setPriceRange([priceRange[0], value])
    }

    const resetFilters = ()=>{
        setSearch("")
        setCategory("All")
        setPriceRange([0, 10000])
    }




    return (
        <div className='bg-gray-100 mt-10 p-4 rounded-md h-max hidden md:block w-64'>
            {/* Search */}
            <Input type="text" value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search..." className="bg-white p-2 rounded-md border-gray-400 border-2 w-full" />

            {/* Category Section */}
            <h1 className='mt-5 font-semibold text-xl'>Category</h1>
            <div className='flex flex-col gap-2 mt-3'>
                {
                    UniqueCategory.map((item, index) => (
                        <div key={index} className='flex items-center gap-2'>
                            <input type="radio" checked={category === item} onChange={()=>handleCategoryClick(item)}/>
                            <label htmlFor="">{item}</label>
                        </div>
                    ))
                }
            </div>

            {/* Price Range Section */}
            <h1 className='mt-5 font-semibold text-xl mb-3'>Price Range</h1>
            <div className='flex flex-col gap-2'>
                <label>
                    Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                </label>
                <div className='flex gap-2 items-center'>
                    <input value={priceRange[0]} onChange={handleMinChange} type="number" min="0" max="5000" className='w-20 p-1 border border-gray-300 rounded' />
                    <span>-</span>
                    <input type="number" min="0" max="10000" value={priceRange[1]} onChange={handleMaxChange} className='w-20 p-1 border border-gray-300 rounded' />
                </div>
                <input type="range" value ={priceRange[0]} onChange={handleMinChange} min="0" max="5000" step="100" className='w-full' />
                <input type="range" value ={priceRange[1]} onChange={handleMaxChange} min="0" max="10000" step="100" className='w-full' />
            </div>

            {/* Reset Button */}
            <Button onClick={resetFilters} className="bg-pink-600 text-white mt-5 cursor-pointer w-full">
                Reset Filters
            </Button>
        </div>
    )
}

export default FilterSidebar
