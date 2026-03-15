import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'

const FilterSidebar = ({ allProducts, priceRange, search, setSearch, category, setCategory, setPriceRange }) => {
  const Categories = allProducts.map(p => p.category)
  const UniqueCategory = ["All", ...new Set(Categories)]

  const handleCategoryClick = (val) => {
    setCategory(val)
  }

  const handleMinChange = (e) => {
    const value = Number(e.target.value)
    if (value <= priceRange[1]) setPriceRange([value, priceRange[1]])
  }

  const handleMaxChange = (e) => {
    const value = Number(e.target.value)
    if (value >= priceRange[0]) setPriceRange([priceRange[0], value])
  }

  const resetFilters = () => {
    setSearch("")
    setCategory("All")
    setPriceRange([0, 10000])
  }

  return (
    <aside className='hidden md:block w-72'>
      <div className='sticky top-24 space-y-5 rounded-xl border border-pink-100 bg-white p-5'>
        <div className='space-y-2'>
          <p className='text-xs font-semibold text-slate-700'>Search</p>
          <Input
            type='text'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search fabric...'
            className='bg-white rounded-lg'
          />
        </div>

        <div>
          <h3 className='text-sm font-semibold text-slate-700'>Category</h3>
          <div className='mt-3 space-y-2'>
            {UniqueCategory.map((item, index) => (
              <label key={index} className='flex items-center gap-2 text-sm text-slate-600'>
                <input
                  type='radio'
                  checked={category === item}
                  onChange={() => handleCategoryClick(item)}
                  className='accent-pink-600'
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className='text-sm font-semibold text-slate-700'>Price Range (INR)</h3>
          <p className='mt-2 text-sm text-slate-500'>INR {priceRange[0]} - INR {priceRange[1]}</p>
          <div className='mt-3 flex gap-2 items-center'>
            <input
              value={priceRange[0]}
              onChange={handleMinChange}
              type='number'
              min='0'
              max='5000'
              className='w-24 rounded-md border border-pink-100 px-2 py-1 text-sm'
            />
            <span className='text-slate-400'>-</span>
            <input
              type='number'
              min='0'
              max='10000'
              value={priceRange[1]}
              onChange={handleMaxChange}
              className='w-24 rounded-md border border-pink-100 px-2 py-1 text-sm'
            />
          </div>
          <div className='mt-3 space-y-2'>
            <input
              type='range'
              value={priceRange[0]}
              onChange={handleMinChange}
              min='0'
              max='5000'
              step='100'
              className='w-full accent-pink-500'
            />
            <input
              type='range'
              value={priceRange[1]}
              onChange={handleMaxChange}
              min='0'
              max='10000'
              step='100'
              className='w-full accent-pink-500'
            />
          </div>
        </div>

        <Button onClick={resetFilters} className='w-full bg-slate-900 text-white hover:bg-slate-800'>
          Reset Filters
        </Button>
      </div>
    </aside>
  )
}

export default FilterSidebar
