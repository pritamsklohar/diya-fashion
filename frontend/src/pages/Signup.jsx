import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'

const Signup = () => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  })
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await axios.post(`http://localhost:8000/api/v1/user/register`, formData, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      if (res.data.success) {
        navigate('/verify')
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-[#fff5f7] flex items-center justify-center px-4'>
      <Card className='w-full max-w-lg border border-pink-100'>
        <CardHeader className='space-y-2'>
          <CardTitle className='text-xl'>Create account</CardTitle>
          <CardDescription>Sign up to start shopping fabrics.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor='firstName'>First Name</Label>
                <Input
                  id='firstName'
                  name='firstName'
                  type='text'
                  placeholder='First name'
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='lastName'>Last Name</Label>
                <Input
                  id='lastName'
                  name='lastName'
                  type='text'
                  placeholder='Last name'
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                name='email'
                type='email'
                placeholder='m@example.com'
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                name='password'
                placeholder='Create a password'
                type='password'
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className='flex-col gap-3'>
          <Button onClick={submitHandler} type='submit' className='w-full bg-pink-600 hover:bg-pink-700'>
            {loading ? (
              <span className='flex gap-2 items-center'>
                <Loader2 className='h-4 w-4 animate-spin' /> Please wait
              </span>
            ) : (
              'Create account'
            )}
          </Button>
          <p className='text-slate-600 text-sm'>
            Already have an account?{' '}
            <Link to='/login' className='text-pink-600 font-semibold hover:underline'>
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Signup
