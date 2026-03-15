import Sidebar from '@/components/Sidebar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div className='min-h-screen bg-[#fff5f7]'>
      <Sidebar />
      <div className='md:pl-[260px]'>
        <Outlet />
      </div>
    </div>
  )
}

export default Dashboard
