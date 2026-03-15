import { Input } from '@/components/ui/input'
import axios from 'axios'
import API_BASE_URL from '@/utils/apiBase'
import { Edit, Eye, Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import UserLogo from "../../assets/user.png"
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  const getAllUsers = async () => {
    const accessToken = localStorage.getItem("accessToken")
    try {
      const res = await axios.get(`${API_BASE_URL}/api/v1/user/all-user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.data.success) {
        setUsers(res.data.users)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    getAllUsers()
  }, [])

  return (
    <div className='px-4 sm:px-6 lg:px-9 pt-8 sm:pt-10 pb-12'>
      <div className='flex flex-wrap items-center justify-between gap-4 mb-6'>
        <div>
          <h1 className='text-lg font-semibold text-slate-900'>User Management</h1>
          <p className='text-sm text-slate-500'>View and manage registered customers.</p>
        </div>

        <div className='relative w-full sm:w-[240px]'>
          <Search className='absolute left-3 top-2.5 text-slate-400 w-4' />
          <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className='pl-9 rounded-lg' placeholder='Search users...' />
        </div>
      </div>

      <div className='grid gap-5 md:grid-cols-2 xl:grid-cols-3'>
        {filteredUsers.map((user, index) => (
          <div key={index} className='bg-white p-4 rounded-xl border border-pink-100'>
            <div className='flex items-center gap-3'>
              <img
                src={user?.profilePic || UserLogo}
                alt=''
                className='rounded-full w-12 h-12 object-cover border border-pink-200'
              />
              <div>
                <h1 className='font-medium text-slate-800'>{user?.firstName} {user?.lastName}</h1>
                <h3 className='text-sm text-slate-500'>{user?.email}</h3>
              </div>
            </div>

            <div className='flex gap-3 mt-4'>
              <Button onClick={() => navigate(`/dashboard/users/${user._id}`)} variant='outline' className='rounded-lg'>
                <Edit className='w-4 h-4 mr-1' /> Edit
              </Button>
              <Button onClick={() => navigate(`/dashboard/orders/${user._id}`)} className='rounded-lg bg-pink-600 hover:bg-pink-700 text-white'>
                <Eye className='w-4 h-4 mr-1' /> Orders
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminUsers
