import { ShoppingBagIcon } from 'lucide-react'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '@/redux/userSlice'
import { toast } from 'sonner'

const Navbar = () => {
  const { user } = useSelector(store => store.user)
  const { cart } = useSelector(store => store.product)
  const cartCount = Array.isArray(cart)
    ? cart.length
    : (cart?.items?.reduce((acc, item) => acc + (item?.quantity ?? 0), 0) ?? 0)
  const accessToken = localStorage.getItem('accessToken')
  const admin = user?.role === "admin" ? true : false
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const logoutHandler = async () => {
    try {
      const res = await axios.post(`http://localhost:8000/api/v1/user/logout`, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.data.success) {
        dispatch(setUser(null))
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <header className='sticky top-0 z-40 bg-white border-b border-pink-100'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex items-center justify-between py-3'>
          <Link to='/' className='flex items-center gap-3'>
            <img src='/Diya.png' alt='Diya Fashion' className='h-10 w-10 object-contain' />
            <div className='leading-tight'>
              <p className='text-lg font-semibold text-slate-900'>Diya Fashion</p>
              <p className='text-xs text-slate-500'>Women&apos;s Fabrics</p>
            </div>
          </Link>

          <nav className='hidden md:flex items-center gap-6 text-sm font-medium text-slate-700'>
            <Link to='/' className='hover:text-pink-600'>Home</Link>
            <Link to='/products' className='hover:text-pink-600'>Fabrics</Link>
            {user && (
              <Link to={`/profile/${user._id}`} className='hover:text-pink-600'>
                My Account
              </Link>
            )}
            {admin && (
              <Link to='/dashboard/sales' className='hover:text-pink-600'>Admin</Link>
            )}
          </nav>

          <div className='flex items-center gap-3'>
            <Link to='/cart' className='relative rounded-full p-2 hover:bg-pink-50'>
              <ShoppingBagIcon className='h-5 w-5' />
              <span className='absolute -top-1 -right-1 min-w-5 h-5 rounded-full bg-pink-500 text-white text-xs grid place-items-center px-1'>
                {cartCount}
              </span>
            </Link>
            {user ? (
              <Button onClick={logoutHandler} className='bg-slate-900 text-white hover:bg-slate-800'>
                Logout
              </Button>
            ) : (
              <Button onClick={() => navigate('/login')} className='bg-pink-600 text-white hover:bg-pink-700'>
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
