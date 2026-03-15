import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import userLogo from '../../assets/user.png'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import API_BASE_URL from '@/utils/apiBase'
import { toast } from 'sonner'
import { setUser } from '@/redux/userSlice'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

const UserInfo = () => {
  const navigate = useNavigate()
  const emptyUser = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    address: "",
    city: "",
    zipCode: "",
    role: "user",
    profilePic: ""
  }
  const [updateUser, setUpdateUser] = useState(emptyUser)
  const [file, setFile] = useState(null)

  const { user } = useSelector(store => store.user)

  const params = useParams()
  const dispatch = useDispatch()

  const userId = params.id

  const handleChange = (e) => {
    setUpdateUser(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    setUpdateUser(prev => ({ ...prev, profilePic: URL.createObjectURL(selectedFile) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const accessToken = localStorage.getItem("accessToken")

    try {
      const formData = new FormData()
      formData.append("firstName", updateUser.firstName || "")
      formData.append("lastName", updateUser.lastName || "")
      formData.append("email", updateUser.email || "")
      formData.append("phoneNo", updateUser.phoneNo || "")
      formData.append("address", updateUser.address || "")
      formData.append("city", updateUser.city || "")
      formData.append("zipCode", updateUser.zipCode || "")
      formData.append("role", updateUser.role || "user")

      if (file) {
        formData.append("file", file)
      }

      const res = await axios.put(`${API_BASE_URL}/api/v1/user/update/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data"
        }
      })
      if (res.data.success) {
        toast.success(res.data.message)
        if (user?._id === res.data.user?._id) {
          dispatch(setUser(res.data.user))
        }
      }
    } catch (error) {
      console.log(error)
      toast.error("failed to update profile")
    }
  }

  const getUserDetails = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/v1/user/get-user/${userId}`)
      if (res.data.success) {
        setUpdateUser({ ...emptyUser, ...res.data.user })
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getUserDetails()
  }, [])

  return (
    <div className='px-4 sm:px-6 lg:px-9 pt-8 sm:pt-10 pb-12'>
      <div className='max-w-5xl'>
        <div className='flex items-center gap-4 mb-6'>
          <Button onClick={() => navigate(-1)} variant='outline' className='rounded-lg'>
            <ArrowLeft />
          </Button>
          <div>
            <h1 className='text-lg font-semibold text-slate-900'>Update User</h1>
            <p className='text-sm text-slate-500'>Edit user profile and role.</p>
          </div>
        </div>

        <div className='grid gap-6 lg:grid-cols-[0.35fr_0.65fr] items-start'>
          <div className='bg-white border border-pink-100 rounded-xl p-5 flex flex-col items-center gap-4'>
            <img src={updateUser?.profilePic || userLogo} alt='profile' className='w-24 h-24 rounded-full object-cover border-2 border-pink-200' />
            <Label className='cursor-pointer bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700'>
              Change Picture
              <input type='file' onChange={handleFileChange} accept='image/*' className='hidden' />
            </Label>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='bg-white border border-pink-100 rounded-xl p-5 space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <Label className='block text-sm font-medium'>First Name</Label>
                  <Input type='text' placeholder='First name' name='firstName' value={updateUser.firstName} onChange={handleChange} className='mt-1' />
                </div>
                <div>
                  <Label className='block text-sm font-medium'>Last Name</Label>
                  <Input type='text' placeholder='Last name' name='lastName' value={updateUser.lastName} onChange={handleChange} className='mt-1' />
                </div>
              </div>
              <div>
                <Label className='block text-sm font-medium'>Email</Label>
                <Input type='email' value={updateUser.email} onChange={handleChange} disabled name='email' className='mt-1 bg-slate-100 cursor-not-allowed' />
              </div>
              <div>
                <Label className='block text-sm font-medium'>Phone Number</Label>
                <Input type='text' value={updateUser.phoneNo} onChange={handleChange} placeholder='Enter contact number' name='phoneNo' className='mt-1' />
              </div>
              <div>
                <Label className='block text-sm font-medium'>Address</Label>
                <Input type='text' value={updateUser.address} onChange={handleChange} placeholder='Enter address' name='address' className='mt-1' />
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <Label className='block text-sm font-medium'>City</Label>
                  <Input type='text' value={updateUser.city} onChange={handleChange} placeholder='Enter city' name='city' className='mt-1' />
                </div>
                <div>
                  <Label className='block text-sm font-medium'>Zip Code</Label>
                  <Input type='text' value={updateUser.zipCode} onChange={handleChange} placeholder='Enter zip code' name='zipCode' className='mt-1' />
                </div>
              </div>
              <div className='flex flex-wrap gap-3 items-center'>
                <Label className='block text-sm font-medium'>Role</Label>
                <RadioGroup value={updateUser.role || "user"} onValueChange={(value) => setUpdateUser(prev => ({ ...prev, role: value }))} className='flex items-center gap-4'>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='user' id='user' />
                    <Label htmlFor='user'>User</Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='admin' id='admin' />
                    <Label htmlFor='admin'>Admin</Label>
                  </div>
                </RadioGroup>
              </div>
              <Button type='submit' className='w-full bg-pink-600 hover:bg-pink-700 text-white rounded-lg'>
                Update Profile
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UserInfo
