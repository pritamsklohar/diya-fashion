import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import userLogo from '../../assets/user.png'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
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

  const {user} = useSelector(store=>store.user)

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

      const res = await axios.put(`http://localhost:8000/api/v1/user/update/${userId}`, formData, {
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

  const getUserDetails = async ()=>{
    try {
      const res = await axios.get(`http://localhost:8000/api/v1/user/get-user/${userId}`)
      if(res.data.success){
        setUpdateUser({ ...emptyUser, ...res.data.user })
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    getUserDetails()
  }, [])

  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex flex-col justify-center items-center min-h-screen bg-gray-100'>
          <div className='flex justify-between gap-10'>
            <Button onClick={() => navigate(-1)}><ArrowLeft /></Button>
            <h1 className='font-bold mb-7 text-2xl to-gray-800'>Update Profile</h1>
          </div>
          <div className='w-full flex gap-10 justify-between items-start px-7 max-w-2xl'>
            {/* profile picture */}
            <div className='flex flex-col items-center'>
              <img src={updateUser?.profilePic || userLogo} alt="profile" className='w-32 h-32 rounded-full object-cover border-4 border-pink-800' />
              <Label className='mt-4 cursor-pointer bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700'>Change Picture
                <input type="file" onChange={handleFileChange} accept='image/*' className='hidden' />
              </Label>
            </div>
            <form onSubmit={handleSubmit} className='space-y-4 shadow-lg p-5 rounded-lg bg-white'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label className='block text-sm font-medium'>First Name</Label>
                  <Input type='text'
                    placeholder='First name' name="firstName" value={updateUser.firstName}
                    onChange={handleChange} className='w-full  border rounded-lg px-3 py-2 mt-1' />
                </div>
                <div>
                  <Label className='block text-sm font-medium'>Last Name</Label>
                  <Input type='text'
                    placeholder='Last name' name="lastName" value={updateUser.lastName}
                    onChange={handleChange} className='w-full  border rounded-lg px-3 py-2 mt-1' />
                </div>
              </div>
              <div>
                <Label className='block text-sm font-medium'>Email</Label>
                <Input type='email'
                  value={updateUser.email}
                  onChange={handleChange}
                  disabled name="email" className='w-full  border rounded-lg px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed' />
              </div>
              <div>
                <Label className='block text-sm font-medium'>Phone Number</Label>
                <Input type='text'
                  value={updateUser.phoneNo}
                  onChange={handleChange}
                  placeholder='Enter you contact number' name="phoneNo" className='w-full  border rounded-lg px-3 py-2 mt-1 ' />
              </div>
              <div>
                <Label className='block text-sm font-medium'>Address</Label>
                <Input type='text'
                  value={updateUser.address}
                  onChange={handleChange}
                  placeholder='Enter you Address' name="address" className='w-full  border rounded-lg px-3 py-2 mt-1 ' />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label className='block text-sm font-medium'>City</Label>
                  <Input type='text'
                    value={updateUser.city}
                    onChange={handleChange}
                    placeholder='Enter you city' name="city" className='w-full  border rounded-lg px-3 py-2 mt-1 ' />
                </div>
                <div>
                  <Label className='block text-sm font-medium'>Zip Code</Label>
                  <Input type='text'
                    value={updateUser.zipCode}
                    onChange={handleChange}
                    placeholder='Enter you zip code' name="zipCode" className='w-full  border rounded-lg px-3 py-2 mt-1 ' />
                </div>

              </div>
              <div className='flex gap-3 items-center'>
                <Label className='block text-sm font-medium'>Role :</Label>
                <RadioGroup value={updateUser.role || "user"} onValueChange={(value)=>setUpdateUser(prev => ({...prev, role: value}))} className='flex items-center'>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value="user" id="user"/>
                    <Label htmlFor="user">User</Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value="admin" id="admin"/>
                    <Label htmlFor="admin">Admin</Label>
                  </div>
                </RadioGroup>
              </div>
              <Button type='submit' className='w-full mt-4 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-lg'>Update Profile</Button>
            </form>
          </div>
        </div>
      </div>

    </div>
  )
}

export default UserInfo
