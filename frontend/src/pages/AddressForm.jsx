import { Input } from '@/components/ui/input'
import { Label } from 'radix-ui'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

const AddressForm = () => {
    const [fomrData, setFormData] = useState({
        fullName:"",
        phone:"",
        email:"",
        address:"",
        city:"",
        state:"",
        zip:"",
        country:"",
    
    })
    const {addresses, selectedAddresses} = useSelector((store)=>store.product)
    const [showForm, setShowForm] = useState(addresses?.length > 0 ? false : true)

    const handleChange = (e)=>{
        setFormData({...formData, [e.target.name]:e.target.value})
    }
  return (
    <div className='max-w-7xl mx-auto grid place-items-center p-10'>
        <div className='grid grid-cols-2 items-start gap-20 mt-10 max-w-7xl mx-auto'>
            <div className='space-y-4 p-6 bg-white'>
                {
                    showForm ? (
                        <>
                        <div>
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" name="fullName" required placeholder=""/>
                        </div>
                        </>
                    ):(
                        <div>  </div>
                    )
                }
            </div>
        </div>
    </div>
  )
}

export default AddressForm