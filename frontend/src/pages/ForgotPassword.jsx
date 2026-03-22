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
import API_BASE_URL from '@/utils/apiBase'

const ForgotPassword = () => {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate()

  const sendOtpHandler = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await axios.post(`${API_BASE_URL}/api/v1/user/forgot-password`, { email })
      if (res.data.success) {
        toast.success(res.data.message || 'OTP sent successfully')
        setStep(2)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const resetPasswordHandler = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await axios.post(`${API_BASE_URL}/api/v1/user/verify-otp/${encodeURIComponent(email)}`, { otp })
      const resetRes = await axios.post(`${API_BASE_URL}/api/v1/user/change-password/${encodeURIComponent(email)}`, {
        newPassword,
        confirmPassword
      })

      if (resetRes.data.success) {
        toast.success(resetRes.data.message || 'Password changed successfully')
        navigate('/login')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-[#fff5f7] flex items-center justify-center px-4'>
      <Card className='w-full max-w-md border border-pink-100'>
        <CardHeader className='space-y-2'>
          <CardTitle className='text-xl'>Forgot Password</CardTitle>
          <CardDescription>
            {step === 1 ? 'Enter your email to receive OTP.' : 'Enter OTP and set a new password.'}
          </CardDescription>
        </CardHeader>

        {step === 1 ? (
          <form onSubmit={sendOtpHandler}>
            <CardContent>
              <div className='grid gap-2 mb-4'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='m@example.com'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className='flex-col gap-3'>
              <Button disabled={loading} type='submit' className='w-full bg-pink-600 hover:bg-pink-700'>
                {loading ? (
                  <span className='flex gap-2 items-center'>
                    <Loader2 className='h-4 w-4 animate-spin' /> Please wait
                  </span>
                ) : (
                  'Send OTP'
                )}
              </Button>
              <Link to='/login' className='text-sm text-pink-600 font-semibold hover:underline'>
                Back to Login
              </Link>
            </CardFooter>
          </form>
        ) : (
          <form onSubmit={resetPasswordHandler}>
            <CardContent>
              <div className='flex flex-col gap-4'>
                <div className='grid gap-2'>
                  <Label htmlFor='otp'>OTP</Label>
                  <Input
                    id='otp'
                    type='text'
                    placeholder='Enter OTP'
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='newPassword'>New Password</Label>
                  <Input
                    id='newPassword'
                    type='password'
                    placeholder='Enter new password'
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='confirmPassword'>Confirm Password</Label>
                  <Input
                    id='confirmPassword'
                    type='password'
                    placeholder='Confirm password'
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex-col gap-3 mt-4'>
              <Button disabled={loading} type='submit' className='w-full bg-pink-600 hover:bg-pink-700'>
                {loading ? (
                  <span className='flex gap-2 items-center'>
                    <Loader2 className='h-4 w-4 animate-spin' /> Please wait
                  </span>
                ) : (
                  'Reset Password'
                )}
              </Button>
              <button
                type='button'
                onClick={() => setStep(1)}
                className='text-sm text-slate-600 hover:text-pink-600'
              >
                Use another email
              </button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
}

export default ForgotPassword
