import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ProductCart from './ProductCart'
import { Skeleton } from './ui/skeleton'

function BestDeals() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBestDeals = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/product/getAllProducts`)
                if (response.data.success && response.data.products?.length > 0) {
                    const shuffled = [...response.data.products].sort(() => Math.random() - 0.5)
                    setProducts(shuffled.slice(0, 4))
                }
            } catch (error) {
                console.error('Failed to fetch best deals:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchBestDeals()
    }, [])

    return (
        <section id="best-deals" className="py-16 bg-white scroll-mt-20">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Best Deals</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="shadow-lg rounded-lg overflow-hidden">
                                <Skeleton className="w-full aspect-square rounded-lg" />
                                <div className="px-2 space-y-2 my-2">
                                    <Skeleton className="w-[200px] h-4" />
                                    <Skeleton className="w-[100px] h-4" />
                                    <Skeleton className="w-full h-8" />
                                </div>
                            </div>
                        ))
                    ) : products.length > 0 ? (
                        products.map((product) => (
                            <ProductCart key={product._id} product={product} loading={false} />
                        ))
                    ) : (
                        <p className="col-span-full text-center py-10 text-gray-500">No deals available at the moment</p>
                    )}
                </div>
            </div>
        </section>
    )
}

export default BestDeals
