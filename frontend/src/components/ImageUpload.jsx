import React from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { X } from 'lucide-react'

const ImageUpload = ({ productData, setProductData }) => {
  const handleFiles = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length) {
      setProductData((prev) => ({
        ...prev,
        productImg: [...(prev?.productImg || []), ...files]
      }))
    }
  }

  const removeImage = (index) => {
    setProductData((prev) => ({
      ...prev,
      productImg: (prev?.productImg || []).filter((_, i) => i !== index)
    }))
  }

  return (
    <div className='grid gap-3'>
      <Label>Product Images</Label>
      <Input
        type='file'
        id='file-upload'
        className='hidden'
        accept='image/*'
        multiple
        onChange={handleFiles}
      />
      <Button variant='outline' asChild className='w-max rounded-full'>
        <label htmlFor='file-upload' className='cursor-pointer'>Upload Images</label>
      </Button>

      {(productData?.productImg || []).length > 0 && (
        <div className='grid grid-cols-2 gap-4 mt-1 sm:grid-cols-3'>
          {(productData?.productImg || []).map((file, idx) => {
            let preview
            if (file instanceof File) {
              preview = URL.createObjectURL(file)
            } else if (typeof file === 'string') {
              preview = file
            } else if (file?.url) {
              preview = file.url
            } else {
              return null
            }

            return (
              <Card key={idx} className='relative group overflow-hidden border border-slate-200'>
                <CardContent className='p-0'>
                  <img
                    src={preview}
                    alt=''
                    width={200}
                    height={200}
                    className='w-full h-32 object-cover'
                  />

                  <button
                    type='button'
                    onClick={() => removeImage(idx)}
                    className='absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition'
                  >
                    <X size={14} />
                  </button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ImageUpload
