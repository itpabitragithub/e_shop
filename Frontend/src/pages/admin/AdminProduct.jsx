import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Edit, Trash2, Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useDispatch, useSelector } from 'react-redux'
import { Card } from '@/components/ui/card'
import { setProducts } from '@/redux/productSlice'
import axios from 'axios'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import ImageUpload from '@/components/ImageUpload'

function AdminProduct() {
    const { products } = useSelector((state) => state.product)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")
    const [sortOrder, setSortOrder] = useState("")
    const [filteredProducts, setFilteredProducts] = useState([])
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [editLoading, setEditLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [productData, setProductData] = useState({
        productName: '',
        productPrice: 0,
        productDesc: '',
        ProductImg: [],
        brand: '',
        category: ''
    })

    // Fetch products from API
    const getAllProducts = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`http://localhost:3000/api/product/getAllProducts`)
            if (response.data.success) {
                dispatch(setProducts(response.data.products))
                setFilteredProducts(response.data.products)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'Failed to fetch products')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllProducts()
    }, [])

    // Filter and sort products
    useEffect(() => {
        let filtered = [...products]

        // Apply search filter
        if (search.trim() !== "") {
            const searchTerm = search.toLowerCase().trim()
            filtered = filtered.filter(p => 
                p.productName?.toLowerCase().includes(searchTerm) ||
                p.category?.toLowerCase().includes(searchTerm) ||
                p.brand?.toLowerCase().includes(searchTerm)
            )
        }

        // Apply sort
        if (sortOrder === "lowToHigh") {
            filtered = filtered.sort((a, b) => (a.productPrice || 0) - (b.productPrice || 0))
        } else if (sortOrder === "highToLow") {
            filtered = filtered.sort((a, b) => (b.productPrice || 0) - (a.productPrice || 0))
        }

        setFilteredProducts(filtered)
    }, [search, sortOrder, products])

    // Handle edit product
    const handleEditClick = (product) => {
        setSelectedProduct(product)
        setProductData({
            productName: product.productName || '',
            productPrice: product.productPrice || 0,
            productDesc: product.productDesc || '',
            ProductImg: product.productImg || [],
            brand: product.brand || '',
            category: product.category || ''
        })
        setEditDialogOpen(true)
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleUpdateProduct = async () => {
        if (!selectedProduct) return

        const accessToken = localStorage.getItem('token');
        if (!accessToken) {
            toast.error('Please login to update products');
            return;
        }

        const formData = new FormData();
        formData.append('productName', productData.productName);
        formData.append('productPrice', productData.productPrice);
        formData.append('productDesc', productData.productDesc);
        formData.append('brand', productData.brand);
        formData.append('category', productData.category);

        // Only append new images if they are File objects
        productData.ProductImg.forEach((img) => {
            if (img instanceof File) {
                formData.append('files', img);
            }
        })

        try {
            setEditLoading(true)
            const response = await axios.put(
                `http://localhost:3000/api/product/update/${selectedProduct._id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.success) {
                toast.success('Product updated successfully');
                setEditDialogOpen(false)
                getAllProducts() // Refresh products
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update product');
            console.log(error);
        } finally {
            setEditLoading(false)
        }
    }

    // Handle delete product
    const handleDeleteClick = (product) => {
        setSelectedProduct(product)
        setDeleteDialogOpen(true)
    }

    const handleDeleteProduct = async () => {
        if (!selectedProduct) return

        const accessToken = localStorage.getItem('token');
        if (!accessToken) {
            toast.error('Please login to delete products');
            return;
        }

        try {
            setDeleteLoading(true)
            const response = await axios.delete(
                `http://localhost:3000/api/product/delete/${selectedProduct._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );

            if (response.data.success) {
                toast.success('Product deleted successfully');
                setDeleteDialogOpen(false)
                getAllProducts() // Refresh products
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete product');
            console.log(error);
        } finally {
            setDeleteLoading(false)
        }
    }

    return (
        <div className='pl-[350px] py-20 pr-20 flex flex-col gap-4 bg-gray-100 min-h-screen'>
            <div className='flex justify-between'>
                <div className='relative bg-white rounded-lg'>
                    <Input 
                        type='text' 
                        placeholder='Search Products...' 
                        className='w-[400px] bg-white pr-10' 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Search className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none' />
                </div>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="w-[200px] bg-white">
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
            
            {loading ? (
                <div className='text-center py-10 text-gray-500'>Loading products...</div>
            ) : filteredProducts.length === 0 ? (
                <div className='text-center py-10 text-gray-500'>
                    {products.length === 0 ? 'No products found' : 'No products match your search'}
                </div>
            ) : (
                <div className='grid grid-cols-1 gap-4'>
                    {filteredProducts.map((product) => (
                        <Card 
                            key={product._id} 
                            className='px-6 py-4 hover:shadow-lg transition-shadow cursor-pointer'
                            onClick={() => navigate(`/products/${product._id}`)}
                        >
                            <div className='flex justify-between items-center gap-4'>
                                <div className='flex items-center gap-4 flex-1'>
                                    {product.productImg && product.productImg.length > 0 ? (
                                        <img 
                                            src={product.productImg[0].url} 
                                            alt={product.productName}
                                            className='w-20 h-20 object-cover rounded-lg'
                                        />
                                    ) : (
                                        <div className='w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400'>
                                            No Image
                                        </div>
                                    )}
                                    <div className='flex-1'>
                                        <h3 className='font-semibold text-lg'>{product.productName}</h3>
                                        <p className='text-sm text-gray-600 line-clamp-2'>{product.productDesc}</p>
                                        <div className='flex gap-4 mt-2 text-sm text-gray-500'>
                                            {product.category && (
                                                <span>Category: {product.category}</span>
                                            )}
                                            {product.brand && (
                                                <span>Brand: {product.brand}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className='text-right flex flex-col items-end gap-2'>
                                    <p className='font-bold text-xl text-purple-600'>
                                        ${product.productPrice || 0}
                                    </p>
                                    <div className='flex gap-2'>
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                navigate(`/products/${product._id}`)
                                            }}
                                        >
                                            View
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleEditClick(product)
                                            }}
                                        >
                                            <Edit className='h-4 w-4' />
                                        </Button>
                                        <Button 
                                            variant="destructive" 
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDeleteClick(product)
                                            }}
                                        >
                                            <Trash2 className='h-4 w-4' />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Edit Product Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                        <DialogDescription>
                            Update the product details below
                        </DialogDescription>
                    </DialogHeader>
                    <div className='flex gap-2 flex-col py-4'>
                        <div className='grid gap-2'>
                            <Label>Product Name</Label>
                            <Input
                                type='text'
                                name='productName'
                                value={productData.productName}
                                onChange={handleChange}
                                placeholder='Ex-Iphone'
                                required
                            />
                        </div>
                        <div className='grid gap-2'>
                            <Label>Price</Label>
                            <Input
                                type='number'
                                name='productPrice'
                                value={productData.productPrice}
                                onChange={handleChange}
                                placeholder=''
                                required
                            />
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                            <div className='grid gap-2'>
                                <Label>Brand</Label>
                                <Input
                                    type='text'
                                    name='brand'
                                    value={productData.brand}
                                    onChange={handleChange}
                                    placeholder='Ex-apple'
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
                                    placeholder='Ex-mobile'
                                    required
                                />
                            </div>
                        </div>
                        <div className='grid gap-2'>
                            <Label>Description</Label>
                            <Textarea
                                name='productDesc'
                                value={productData.productDesc}
                                onChange={handleChange}
                                placeholder='Enter brief description of the product'
                                required
                            />
                        </div>
                        <ImageUpload productData={productData} setProductData={setProductData} />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setEditDialogOpen(false)}
                            disabled={editLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdateProduct}
                            disabled={editLoading}
                            className='bg-purple-500 text-white hover:bg-purple-600'
                        >
                            {editLoading ? (
                                <span className='flex items-center gap-2'>
                                    <Loader2 className='animate-spin h-4 w-4' />
                                    Updating...
                                </span>
                            ) : (
                                'Update Product'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the product
                            <strong> "{selectedProduct?.productName}"</strong> and remove all associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteProduct}
                            disabled={deleteLoading}
                            className='bg-destructive text-white hover:bg-destructive/90'
                        >
                            {deleteLoading ? (
                                <span className='flex items-center gap-2'>
                                    <Loader2 className='animate-spin h-4 w-4' />
                                    Deleting...
                                </span>
                            ) : (
                                'Delete'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default AdminProduct
