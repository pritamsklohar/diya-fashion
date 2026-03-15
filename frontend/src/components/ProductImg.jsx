import React, { useEffect, useState } from 'react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const ProductImg = ({ images = [] }) => {
  const [mainImg, setMainImg] = useState('')

  useEffect(() => {
    if (images.length > 0) {
      setMainImg(images[0].url || '')
    }
  }, [images])

  return (
    <div className='flex flex-col gap-4 lg:flex-row'>
      <div className='flex lg:flex-col gap-2 order-2 lg:order-1'>
        {images.map((img) => (
          <button
            key={img.url}
            type='button'
            onClick={() => setMainImg(img.url)}
            className={`h-20 w-20 overflow-hidden rounded-md border ${
              mainImg === img.url ? 'border-pink-500' : 'border-pink-100'
            }`}
          >
            <img src={img.url} alt='' className='h-full w-full object-cover' />
          </button>
        ))}
      </div>

      <div className='order-1 lg:order-2 flex-1'>
        <Zoom>
          <img
            src={mainImg}
            alt=''
            className='w-full max-w-xl rounded-xl border border-pink-100 bg-white object-cover'
          />
        </Zoom>
      </div>
    </div>
  )
}

export default ProductImg
