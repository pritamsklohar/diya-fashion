import { ShoppingBag, ShoppingBagIcon, ShoppingCart } from 'lucide-react'
import React from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '@/redux/userSlice'
import { toast } from 'sonner'

const Navbar = () => {
  const {user} = useSelector(store=>store.user)
  const {cart} = useSelector(store=>store.product)
  const cartCount = Array.isArray(cart)
    ? cart.length
    : (cart?.items?.reduce((acc, item) => acc + (item?.quantity ?? 0), 0) ?? 0)
  const accessToken = localStorage.getItem('accessToken')
  const admin = user?.role === "admin" ? true : false
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const logoutHandler = async()=>{
    try {
      const res = await axios.post(`http://localhost:8000/api/v1/user/logout`, {}, {
        headers:{
          Authorization: `Bearer ${accessToken}`
        }
      })
      if(res.data.success){
        dispatch(setUser(null))
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <header className='bg-pink-50 fixed w-full z-20 border-b border-pink-200'>
      <div className='max-w-7xl mx-auto flex justify-between items-center py-3'>
        <div>
          <img src="/Diya.png" alt=""  className='w-100px'/>
        </div>
        <nav className='flex gap-10 justify-between items-center'>
          <ul className='flex gap-7 items-center text-xl font-semibold'>
            <Link to={'/'}><li>Home</li></Link>
            <Link to={'/products'}><li>Shopping</li></Link>
            {
              user && <Link to={`/profile/${user._id}`}><li>Hello, {user.firstName}</li></Link>
            }
            {
              admin && <Link to={`/dashboard/sales`}><li></li>Dashboard</Link>
            }
          </ul>
          <Link to={'/cart'}className='relative'>
          <ShoppingBagIcon/>
          <span className='bg-pink-500 rounded-full absolute text-white -top-3 -right-5 px-2'>{cartCount}</span>
          </Link>
          {
            user ? <Button onClick={logoutHandler} className='bg-pink-600 text-white cursor-pointer'>Logout</Button>: <Button onClick={()=>navigate('/login')}className='bg-gradient-to-tl from-blue-600 to-purple-600 text-white cursor-pointer'>Login</Button>
          }
        </nav>
      </div>
    </header>
  )
}

export default Navbar
