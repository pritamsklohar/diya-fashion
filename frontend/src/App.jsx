import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import Verify from './pages/Verify'
import VerifyEmail from './pages/VerifyEmail'
import Footer from './components/Footer'
import Profile from './pages/Profile'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Dashboard from './pages/Dashboard'
import OrderSuccess from './pages/OrderSuccess'
import AdminSales from './pages/admin/AdminSales'
import AddProduct from './pages/admin/AddProduct'
import AdminOrders from './pages/admin/AdminOrders'
import AdminProduct from './pages/admin/AdminProduct'
import AdminUsers from './pages/admin/AdminUsers'
import ShowUserOrders from './pages/admin/ShowUserOrders'
import UserInfo from './pages/admin/UserInfo'
import ProtectedRoute from './components/ProtectedRoute'
import SingleProduct from './pages/SingleProduct'
import AddressForm from './pages/AddressForm'

const router = createBrowserRouter([
  {
    path:'/',
    element: <><Navbar/><Home/><Footer/></>
  },
  {
    path:'/signup',
    element: <><Signup/></>
  },
  {
    path:'/verify',
    element: <><Verify/></>
  },
  {
    path:'/login',
    element: <><Login/></>
  },
  {
    path:'/forgot-password',
    element: <><ForgotPassword/></>
  },
  {
    path:'/verify/:token',
    element: <><VerifyEmail/></>
  },
  {
    path:'/profile/:userId',
    element: <ProtectedRoute><Navbar/><Profile/></ProtectedRoute>
  },
  {
    path:'/products',
    element: <><Navbar/><Products/></>
  },
  {
    path:'/products/:id',
    element: <><Navbar/><SingleProduct/></>
  },
  {
    path:'/cart',
    element: <ProtectedRoute><Navbar/><Cart/></ProtectedRoute>
  },
  {
    path:'/address',
    element: <ProtectedRoute><AddressForm/></ProtectedRoute>
  },
  {
    path:'/order-success',
    element: <ProtectedRoute><OrderSuccess/></ProtectedRoute>
  },
  {
    path:'/dashboard',
    element: <ProtectedRoute adminOnly={true}><Navbar/><Dashboard/></ProtectedRoute>,
    children: [
      {
        path:"add-product",
        element: <AddProduct/>
      },
      {
        path:"orders",
        element: <AdminOrders/>
      },
      {
        path:"products",
        element: <AdminProduct/>
      },
      {
        path:"sales",
        element: <AdminSales/>
      },
      {
        path:"users",
        element: <AdminUsers/>
      },
      {
        path:"orders/:userId",
        element: <ShowUserOrders/>
      },
      {
        path:"users/:id",
        element: <UserInfo/>
      },
    ]
  },
])

const App = () => {
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
