import React from 'react'

const Verify = () => {
  return (
    <div className='min-h-screen bg-[#fff5f7] flex items-center justify-center px-4'>
      <div className='bg-white p-6 rounded-xl shadow-sm w-full max-w-md text-center border border-pink-100'>
        <h2 className='text-lg font-semibold text-slate-800 mb-2'>Check Your Email</h2>
        <p className='text-sm text-slate-600'>
          We sent you a verification link. Open your email and click the link to verify.
        </p>
      </div>
    </div>
  )
}

export default Verify
