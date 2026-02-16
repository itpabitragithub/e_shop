import React, { useState } from 'react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

function ProductImg({images}) {
    const [mainImage, setMainImage] = useState(images[0].url)
    
  return (
    <div className='flex flex-col sm:flex-row w-full gap-4'>
        <div className = 'gap-2 flex flex-row sm:flex-col justify-center sm:justify-start'>
            {
                images.map((img) => (
                    <img onClick={() => setMainImage(img.url)} src={img.url} alt="" className='cursor-pointer w-20 h-20 border shadow-lg rounded-md' />
                ))
            }
        </div>
        <Zoom>
        <img src={mainImage} alt="" className='w-full h-108 object-cover border shadow-lg rounded-md' />
        </Zoom>
    </div>
  )
}

export default ProductImg