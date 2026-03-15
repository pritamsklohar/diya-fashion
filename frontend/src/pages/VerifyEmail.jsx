import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import API_BASE_URL from '@/utils/apiBase'

const VerifyEmail = () => {
  const { token } = useParams()
  const [status, setStatus] = useState("Verifying your email...")
  const navigate = useNavigate()

  const verifyEmail = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/v1/user/verify`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (res.data.success) {
        setStatus('Email verified successfully. Redirecting to login...')
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      }
    } catch (error) {
      console.log(error)
      setStatus("Verification failed. Please try again.")
    }
  }

  useEffect(() => {
    verifyEmail()
  }, [token])

  return (
    <div className='min-h-screen bg-[#fff5f7] flex items-center justify-center px-4'>
      <div className='bg-white p-6 rounded-xl shadow-sm w-full max-w-md text-center border border-pink-100'>
        <h2 className='text-sm font-semibold text-slate-800'>{status}</h2>
      </div>
    </div>
  )
}

export default VerifyEmail
