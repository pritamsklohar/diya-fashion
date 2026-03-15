import React, { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import userLogo from "../assets/user.png"
import { toast } from 'sonner'
import { setUser } from '@/redux/userSlice'
import axios from 'axios'
import API_BASE_URL from '@/utils/apiBase'
import MyOrder from './MyOrder'

const Profile = () => {
  const { user } = useSelector(store => store.user)
  const params = useParams()
  const userId = params.userId
  const [updateUser, setUpdateUser] = useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    city: user?.city,
    phoneNo: user?.phoneNo,
    address: user?.address,
    zipCode: user?.zipCode,
    profilePic: user?.profilePic,
    role: user?.role
  })

  const [file, setFile] = useState(null)
  const dispatch = useDispatch()

  const handleChange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    setUpdateUser({ ...updateUser, profilePic: URL.createObjectURL(selectedFile) })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const accessToken = localStorage.getItem("accessToken")

    try {
      const formData = new FormData()
      formData.append("firstName", updateUser.firstName)
      formData.append("lastName", updateUser.lastName)
      formData.append("email", updateUser.email)
      formData.append("phoneNo", updateUser.phoneNo)
      formData.append("address", updateUser.address)
      formData.append("city", updateUser.city)
      formData.append("zipCode", updateUser.zipCode)
      formData.append("role", updateUser.role)

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
        dispatch(setUser(res.data.user))
      }
    } catch (error) {
      console.log(error)
      toast.error("failed to update profile")
    }
  }

  useEffect(() => {
    if (!user) return
    setUpdateUser({
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      city: user?.city,
      phoneNo: user?.phoneNo,
      address: user?.address,
      zipCode: user?.zipCode,
      profilePic: user?.profilePic,
      role: user?.role
    })
  }, [user])

  return (
    <div className='bg-[#fff5f7] min-h-screen pt-10 pb-12'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='mb-6'>
          <h1 className='text-xl font-semibold text-slate-900'>My Account</h1>
          <p className='text-sm text-slate-500'>Manage your profile and orders.</p>
        </div>

        <Tabs defaultValue='profile' className='w-full'>
          <TabsList className='bg-white rounded-lg border border-pink-100'>
            <TabsTrigger value='profile' className='rounded-lg px-6'>Profile</TabsTrigger>
            <TabsTrigger value='orders' className='rounded-lg px-6'>Orders</TabsTrigger>
          </TabsList>

          <TabsContent value='profile' className='mt-6'>
            <div className='grid gap-6 lg:grid-cols-[0.35fr_0.65fr] items-start'>
              <Card className='border border-pink-100'>
                <CardHeader>
                  <CardTitle>Profile Photo</CardTitle>
                  <CardDescription>Update your display photo.</CardDescription>
                </CardHeader>
                <CardContent className='flex flex-col items-center gap-4'>
                  <img
                    src={updateUser.profilePic || userLogo}
                    alt='profile'
                    className='w-24 h-24 rounded-full object-cover border-2 border-pink-200'
                  />
                  <Label className='cursor-pointer bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700'>
                    Change Picture
                    <input type='file' onChange={handleFileChange} accept='image/*' className='hidden' />
                  </Label>
                </CardContent>
              </Card>

              <form onSubmit={handleSubmit} className='space-y-4'>
                <Card className='border border-pink-100'>
                  <CardHeader>
                    <CardTitle>Personal Details</CardTitle>
                    <CardDescription>Keep your details up to date.</CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <Label className='block text-sm font-medium'>First Name</Label>
                        <Input
                          type='text'
                          placeholder='First name'
                          name='firstName'
                          value={updateUser.firstName}
                          onChange={handleChange}
                          className='mt-1'
                        />
                      </div>
                      <div>
                        <Label className='block text-sm font-medium'>Last Name</Label>
                        <Input
                          type='text'
                          placeholder='Last name'
                          name='lastName'
                          value={updateUser.lastName}
                          onChange={handleChange}
                          className='mt-1'
                        />
                      </div>
                    </div>
                    <div>
                      <Label className='block text-sm font-medium'>Email</Label>
                      <Input
                        type='email'
                        value={updateUser.email}
                        onChange={handleChange}
                        disabled
                        name='email'
                        className='mt-1 bg-slate-100 cursor-not-allowed'
                      />
                    </div>
                    <div>
                      <Label className='block text-sm font-medium'>Phone Number</Label>
                      <Input
                        type='text'
                        value={updateUser.phoneNo}
                        onChange={handleChange}
                        placeholder='Enter your contact number'
                        name='phoneNo'
                        className='mt-1'
                      />
                    </div>
                    <div>
                      <Label className='block text-sm font-medium'>Address</Label>
                      <Input
                        type='text'
                        value={updateUser.address}
                        onChange={handleChange}
                        placeholder='Enter your address'
                        name='address'
                        className='mt-1'
                      />
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <Label className='block text-sm font-medium'>City</Label>
                        <Input
                          type='text'
                          value={updateUser.city}
                          onChange={handleChange}
                          placeholder='Enter your city'
                          name='city'
                          className='mt-1'
                        />
                      </div>
                      <div>
                        <Label className='block text-sm font-medium'>Zip Code</Label>
                        <Input
                          type='text'
                          value={updateUser.zipCode}
                          onChange={handleChange}
                          placeholder='Enter your zip code'
                          name='zipCode'
                          className='mt-1'
                        />
                      </div>
                    </div>
                    <Button type='submit' className='w-full bg-pink-600 hover:bg-pink-700 text-white rounded-lg'>
                      Update Profile
                    </Button>
                  </CardContent>
                </Card>
              </form>
            </div>
          </TabsContent>

          <TabsContent value='orders' className='mt-6'>
            <div className='rounded-xl border border-pink-100 bg-white p-5'>
              <MyOrder/>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Profile
