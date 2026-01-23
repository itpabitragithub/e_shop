import React from 'react'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'

const FilterSidebar = ({ allProducts, priceRange, category, brand, search, setSearch, setCategory, setBrand, setPriceRange }) => {

    const Categories = allProducts.map(p => p.category)
    const UniqueCategory = ["All", ...new Set(Categories)]

    const Brands = allProducts.map(p => p.brand)
    const UniqueBrand = ["All", ...new Set(Brands)]
    console.log(UniqueBrand);

    const handleCategoryClick = (item) => {
        setCategory(item)
    }
    const handleBrandChange = (e) => {
        setBrand(e.target.value)
    }
    const handleMinRange = (e) => {
        const value = Number(e.target.value)
        if (value < priceRange[1]) {
            setPriceRange([value, priceRange[1]])
        }
    }

    const handleMaxRange = (e) => {
        const value = Number(e.target.value)
        if (value > priceRange[0]) {
            setPriceRange([priceRange[0], value])
        }
    }

    const resetFilters = () => {
        setSearch("")
        setCategory("All")
        setBrand("All")
        setPriceRange([0, 999999])
    }
    return (
        <div className='bg-gray-100 p-4 rounded-md mt-10 h-max hidden md:block w-64'>
            {/* Search */}
            <Input
                type='text'
                placeholder='Search'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='mb-4 bg-white p-2 rounded-md border-gray-400 border-2 w-full' />
            {/* Categories */}
            <h1 className='text-xl font-semibold mt-5'>Category</h1>
            <div className='flex flex-col gap-2 mt-3'>
                {
                    UniqueCategory.map((item, index) => (
                        <div key={index} className='flex items-center gap-2'>
                            <input
                                type='radio'
                                // id={`category-${index}`}
                                name='category'
                                checked={category === item}
                                onChange={() => handleCategoryClick(item)} />
                            <label htmlFor="">{item}</label>
                        </div>
                    ))
                }
            </div>
            {/* brands */}
            <h1 className='text-xl font-semibold mt-5'>Brands</h1>
            <select 
                className='bg-white w-full p-2 border-gray-200 border-2 rounded-md'
                value={brand}
                onChange={handleBrandChange}>
                {
                    UniqueBrand.map((item, index) => {
                        return <option key={index} value={item}>{item.toUpperCase()}</option>
                    })
                }
            </select>
            {/* price range*/}
            <h1 className='text-xl font-semibold mt-5 mb-3'>Price Range</h1>
            <div className='flex flex-col gap-2'>
                <label>
                    Price Range: ₹{priceRange?.[0] || 0} - ₹{priceRange?.[1] || 999999}
                </label>
                <div className='flex items-center gap-2'>
                    <input
                        type='number'
                        min='0'
                        max='5000'
                        value={priceRange[0]}
                        onChange={handleMinRange}
                        className='w-20 p-1 border border-gray-300 rounded' />
                    <span>-</span>
                    <input
                        type='number'
                        min='0'
                        max='999999'
                        value={priceRange[1]}
                        onChange={handleMaxRange}
                        className='w-20 p-1 border border-gray-300 rounded' />
                </div>
                <input
                    type='range'
                    min='0'
                    max='5000'
                    step='100'
                    value={priceRange[0]}
                    onChange={handleMinRange}
                    className='w-full' />
                <input
                    type='range'
                    min='0'
                    max='999999'
                    step='100'
                    value={priceRange[1]}
                    onChange={handleMaxRange}
                    className='w-full' />
            </div>
            {/* Reset button */}
            <Button 
                onClick={resetFilters}
                className='w-full mt-5 bg-pink-500 text-white cursor-pointer hover:bg-pink-600'>
                Reset
            </Button>
        </div>
    )
}

export default FilterSidebar