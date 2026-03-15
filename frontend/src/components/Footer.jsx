import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaPinterest, FaTwitterSquare } from 'react-icons/fa'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const Footer = () => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  return (
    
    <footer className='bg-white border-t border-pink-100'>
      <div className='max-w-7xl mx-auto px-4 py-12 grid gap-8 md:grid-cols-4'>
        <div className='space-y-3'>
          <Link to='/' className='flex items-center gap-3'>
            <img src='/Diya.png' alt='Diya Fashion' className='h-10 w-10 object-contain' />
            <div>
              <p className='text-lg font-semibold text-slate-900'>Diya Fashion</p>
              <p className='text-xs text-slate-500'>Women&apos;s Fabrics</p>
            </div>
          </Link>
          <p className='text-sm text-slate-600'>Everyday fabrics for women, available in multiple colors, prints, and textures.</p>
          <div className='text-sm text-slate-500 space-y-1'>
            <p>Lohar vaas gali, near Govt. Hospital, Kalandri, Rajasthan 307802</p>
            <p>Email: diyafashion@gmail.com</p>
            <p>Phone: 6377235823</p>
          </div>
        </div>

        <div className='space-y-3'>
          <h3 className='text-sm font-semibold text-slate-900'>Customer Care</h3>
          <ul className='text-sm text-slate-600 space-y-2'>
            <li className='cursor-pointer' onClick={() => setOpen(true)}>Contact Us</li>
            <li className='cursor-pointer' onClick={() => navigate(`/cart`)}>Shipping and Returns</li>
            <li>FAQs</li>
            <li className='cursor-pointer' onClick={() => navigate(`/profile/:`)}>Order Tracking</li>
          </ul>
        </div>



        <div className='space-y-3'>
          <h3 className='text-sm font-semibold text-slate-900'>Popular Fabrics</h3>
          <ul className='text-sm text-slate-600 space-y-2'>
            <li className='cursor-pointer' onClick={() => navigate(`/products`)}>Cotton</li>
            <li className='cursor-pointer' onClick={() => navigate(`/products`)}>Chiffon</li>
            <li className='cursor-pointer' onClick={() => navigate(`/products`)}>Georgette</li>
            <li className='cursor-pointer' onClick={() => navigate(`/products`)}>Silk Blend</li>
          </ul>
        </div>


        <div className='space-y-3'>
          <h3 className='text-sm font-semibold text-slate-900'>Stay Updated</h3>
          <p className='text-sm text-slate-600'>Subscribe for new arrivals and offers.</p>
          <form className='flex w-full rounded-lg border border-pink-200 overflow-hidden'>
            <input
              type='email'
              placeholder='Your email'
              className='w-full px-3 py-2 text-sm text-slate-700 focus:outline-none'
            />
            <button type='submit' className='bg-pink-600 px-4 text-sm font-semibold text-white'>Subscribe</button>
          </form>
          <div className='flex items-center gap-3 text-xl text-pink-500'>
            <a target='_blank' href="https://www.instagram.com/diyafashion_kalandri/">

              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
      <div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className='font-bold text-center text-2xl'>Contact Us <br /><br /></DialogTitle>
                <DialogDescription>
                  <h4 className=' font-semibold text-xl'>Contact: <span className='text-gray-500 font-light'>6377235823</span></h4>
                  <br />
                  <h4 className='inline font-semibold text-xl'>Visit Us:
                    <span className='text-gray-500 font-light'>  Lohar vaas gali, near Govt. Hospital, Kalandri, Rajasthan 307802</span>
                  </h4> <br /> <br />
                  <a className='font-semibold text-xl' target='_blank' href="https://www.instagram.com/diyafashion_kalandri/"><FaInstagram  className='inline'/> Diya Fashion Kalandri </a>



                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

      <div className='border-t border-pink-100 py-4 text-center text-xs text-slate-500'>
        <p>&copy; {new Date().getFullYear()} Diya Fashion. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
