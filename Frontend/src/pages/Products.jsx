import FilterSidebar from '@/components/FilterSidebar'
import React, { useEffect, useState } from 'react'
import ProductCart from '@/components/ProductCart'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from 'sonner'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setProducts } from '@/redux/productSlice'

const Products = () => {
    const { products } = useSelector((store) => store.product)
    const [allProducts, setAllProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("All")
    const [brand, setBrand] = useState("All")
    const [priceRange, setPriceRange] = useState([0, 999999])
    const [sortOrder, setSortOrder] = useState("")
    const dispatch = useDispatch()

    const getAllProducts = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`http://localhost:3000/api/product/getAllProducts`)
            if (response.data.success) {
                setAllProducts(response.data.products)
                dispatch(setProducts(response.data.products))
            }
            console.log(response.data)
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)

        } finally {
            setLoading(false)
        }
    }

   useEffect(()=>{
    if(allProducts.length === 0) {
        dispatch(setProducts([]))
        return;
    }

    let filtered = [...allProducts];

    if(search.trim() !== ""){
        const searchTerm = search.toLowerCase().trim();
        // Check if search term matches any category exactly (case-insensitive)
        const categories = [...new Set(allProducts.map(p => p.category).filter(cat => cat != null && cat !== ""))];
        const matchingCategory = categories.find(cat => cat?.toLowerCase().trim() === searchTerm);
        
        if(matchingCategory){
            // If search matches a category, filter by category
            filtered = filtered.filter(p=>p.category?.toLowerCase().trim() === searchTerm)
        } else {
            // Otherwise, search in product names
            filtered = filtered.filter(p=>p.productName.toLowerCase().includes(searchTerm))
        }
    }

    if(category !== "All"){
        filtered = filtered.filter(p=>p.category?.toLowerCase().trim() === category.toLowerCase().trim())
    }

    if(brand !== "All"){
        filtered = filtered.filter(p=>p.brand === brand)
    }
    filtered = filtered.filter(p=>p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1])
    
    if(sortOrder === "lowToHigh"){
        filtered = filtered.sort((a,b)=>a.productPrice - b.productPrice)
    }
    else if(sortOrder === "highToLow"){
        filtered = filtered.sort((a,b)=>b.productPrice - a.productPrice)
    }
    dispatch(setProducts(filtered))
   },[search, category, brand, priceRange, sortOrder, dispatch, allProducts])

    useEffect(() => {
        getAllProducts()
    }, [])

    console.log(allProducts)

    return (
        <div className='pt-20 pb-10'>
            <div className='max-w-7xl mx-auto px-4'>
                <div className='flex gap-7'>
                    {/* Filter Sidebar */}
                    <FilterSidebar
                        allProducts={allProducts}
                        priceRange={priceRange}
                        category={category}
                        brand={brand}
                        search={search}
                        setSearch={setSearch}
                        setCategory={setCategory}
                        setBrand={setBrand}
                        setPriceRange={setPriceRange} />
                    {/* Main Product section */}
                    <div className='flex flex-col flex-1'>
                        <div className='flex justify-end mb-4'>
                            <Select value={sortOrder} onValueChange={setSortOrder}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Sort by Price" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
                                        <SelectItem value="highToLow">Price: High to Low</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        {/* Product Grid */}
                        <div className='grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-7'>
                            {
                                loading ? (
                                    <div className="col-span-full text-center py-10">Loading products...</div>
                                ) : products.length === 0 ? (
                                    <div className="col-span-full text-center py-10 text-gray-500">No products found</div>
                                ) : (
                                    products.map((product) => (
                                        <ProductCart key={product._id} product={product} loading={loading} />
                                    ))
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Products 