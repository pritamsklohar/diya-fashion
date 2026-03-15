import { LayoutDashboard, PackagePlus, PackageSearch, Users } from 'lucide-react';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";

const Sidebar = () => {
    const linkBase = 'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition';
    return (
        <aside className='hidden fixed md:block border-r bg-white border-pink-100 z-10 w-[280px] h-screen px-6 pt-10'>
            <div className='mb-8'>
                <div className='flex items-center gap-3'>
                    <img src='/Diya.png' alt='Diya Fashion' className='h-9 w-9 object-contain' />
                    <div>
                        <p className='text-sm font-semibold text-slate-900'>Diya Fashion</p>
                        <p className='text-xs text-slate-500'>Admin Panel</p>
                    </div>
                </div>
            </div>

            <nav className='space-y-2'>
                <NavLink to='/dashboard/sales' className={({ isActive }) =>
                    `${linkBase} ${isActive ? "bg-pink-600 text-white shadow-sm" : "text-slate-600 hover:bg-pink-50"}`
                }>
                    <LayoutDashboard className='h-5 w-5' /> <span>Dashboard</span>
                </NavLink>

                <NavLink to='/dashboard/add-product' className={({ isActive }) =>
                    `${linkBase} ${isActive ? "bg-pink-600 text-white shadow-sm" : "text-slate-600 hover:bg-pink-50"}`
                }>
                    <PackagePlus className='h-5 w-5' /> <span>Add Product</span>
                </NavLink>

                <NavLink to='/dashboard/products' className={({ isActive }) =>
                    `${linkBase} ${isActive ? "bg-pink-600 text-white shadow-sm" : "text-slate-600 hover:bg-pink-50"}`
                }>
                    <PackageSearch className='h-5 w-5' /> <span>Products</span>
                </NavLink>

                <NavLink to='/dashboard/users' className={({ isActive }) =>
                    `${linkBase} ${isActive ? "bg-pink-600 text-white shadow-sm" : "text-slate-600 hover:bg-pink-50"}`
                }>
                    <Users className='h-5 w-5' /> <span>Users</span>
                </NavLink>

                <NavLink to='/dashboard/orders' className={({ isActive }) =>
                    `${linkBase} ${isActive ? "bg-pink-600 text-white shadow-sm" : "text-slate-600 hover:bg-pink-50"}`
                }>
                    <FaRegEdit /> <span>Orders</span>
                </NavLink>
            </nav>
        </aside>
    );
};

export default Sidebar;
