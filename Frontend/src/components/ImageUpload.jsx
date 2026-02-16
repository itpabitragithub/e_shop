import { Label } from '@/components/ui/label'
import React from 'react'
import { Button } from './ui/button'
import { ImageIcon, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

function ImageUpload({ productData, setProductData }) {
    const handleFiles = (e) => {
        const files = Array.from(e.target.files || []);
        if(files.length){
            setProductData((prev) => ({
                ...prev,
                ProductImg: [...prev.ProductImg, ...files]
            }));
        }
    }

    const removeImage = (index) => {
        setProductData((prev) => {
           const updatedImages = prev.ProductImg.filter((_, i) => i !== index)
           return {
            ...prev,
            ProductImg: updatedImages
           }
        });
    }

    return (
        <div className='grid gap-2'>
            <Label>Product Images</Label>
            <input
                className='hidden'
                type='file'
                id='file-upload'
                accept='image/*'
                multiple
                onChange={handleFiles}
            />
            <Button variant='outline'>
                <label htmlFor='file-upload' className='cursor-pointer'>Upload Images</label>
            </Button>

            {/* image preview */}
            {
                productData.ProductImg && productData.ProductImg.length > 0 && (
                    <div className='grid grid-cols-2 gap-4 mt-3 sm:grid-cols-3'>
                        {
                            productData.ProductImg.map((file, idx) => {
                                //check if file alredy a file (from input) or a DB object/string
                                let preview
                                if(file instanceof File){
                                    preview = URL.createObjectURL(file)
                                }else if(typeof file === 'string'){
                                    preview = file
                                }else if (file?.url){
                                    preview = file.url
                                }else{
                                    return null
                                }

                                return (
                                    <Card key={idx} className='relative group overflow-hidden'>
                                        <CardHeader>
                                            <CardTitle>Product Image {idx + 1}</CardTitle>
                                        </CardHeader>
                                        <CardContent className='relative'>
                                            <img src={preview} alt= "" width={200} height={200} className='w-full h-32 object-cover rounded-md' />
                                            
                                            {/* Remove button */}
                                            <button 
                                                onClick={() => removeImage(idx)} 
                                                className='absolute top-0 right-2 bg-gray-400 hover:bg-gray-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10'
                                            >
                                                <X size={16} />
                                            </button>
                                        </CardContent>
                                    </Card>
                                )
                          })
                        }
                    </div>
                )
            }
        </div>
    )
}

export default ImageUpload