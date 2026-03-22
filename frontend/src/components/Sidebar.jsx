import { LayoutDashboard, PackagePlus, PackageSearch, Users, MoreVertical } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";

const Sidebar = () => {
    const linkBase = 'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition';
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const { pathname } = useLocation();
    const links = [
        { to: '/dashboard/sales', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/dashboard/add-product', label: 'Add Product', icon: PackagePlus },
        { to: '/dashboard/products', label: 'Products', icon: PackageSearch },
        { to: '/dashboard/users', label: 'Users', icon: Users },
        { to: '/dashboard/orders', label: 'Orders', icon: FaRegEdit },
    ];
    const activeLink = links.find((link) => pathname.startsWith(link.to)) || links[0];
    const ActiveIcon = activeLink.icon;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        if (menuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuOpen]);

    return (
        <>
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
                    {links.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `${linkBase} ${isActive ? "bg-pink-600 text-white shadow-sm" : "text-slate-600 hover:bg-pink-50"}`
                            }
                        >
                            <Icon className='h-5 w-5' /> <span>{label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>

            <div className='md:hidden sticky top-16 z-20 border-b border-pink-100 bg-white/95 backdrop-blur-sm px-3 py-2'>
                <div className='relative flex items-center justify-between' ref={menuRef}>
                    <div className='inline-flex items-center gap-2 rounded-lg bg-pink-50 text-slate-800 px-3 py-2 text-xs font-semibold'>
                        <ActiveIcon className='h-4 w-4' />
                        <span>{activeLink.label}</span>
                    </div>

                    <button
                        type='button'
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className='rounded-lg border border-pink-200 bg-white p-2 text-slate-700'
                        aria-label='Open admin tabs'
                    >
                        <MoreVertical className='h-4 w-4' />
                    </button>

                    {menuOpen && (
                        <div className='absolute right-0 top-11 w-44 rounded-lg border border-pink-100 bg-white p-1 shadow-lg'>
                            {links.map(({ to, label, icon: Icon }) => (
                                <NavLink
                                    key={to}
                                    to={to}
                                    onClick={() => setMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 rounded-md px-2.5 py-2 text-xs font-semibold transition ${
                                            isActive ? "bg-pink-600 text-white" : "text-slate-700 hover:bg-pink-50"
                                        }`
                                    }
                                >
                                    <Icon className='h-4 w-4' />
                                    <span>{label}</span>
                                </NavLink>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Sidebar;
