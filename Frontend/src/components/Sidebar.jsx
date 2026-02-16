import { LayoutDashboard, PackagePlus, PackageSearch, ShoppingCart, Users } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router-dom'

function Sidebar() {
    return (
        <div className='hidden fixed md:block border-r bg-purple-50 border-purple-200 x-10 w-[300px] p-10 space-y-2 h-screen'>
            <div className='text-center pt-10 px-3 space-y-2'>
                <NavLink to='/dashboard/sales' className={({ isActive }) => `text-xl ${isActive ? 'bg-purple-500 text-gray-200' : 'bg-transparent'}
                flex items-center gap-2 p-2 rounded-2xl cursor-pointer p-3 w-full`}>
                <LayoutDashboard /> <span>Dashboard</span> </NavLink>

                <NavLink to='/dashboard/add-product' className={({ isActive }) => `text-xl ${isActive ? 'bg-purple-500 text-gray-200' : 'bg-transparent'}
                flex items-center gap-2 p-2 rounded-2xl cursor-pointer p-3 w-full`}>
                <PackagePlus /> <span>Add Product</span> </NavLink>

                <NavLink to='/dashboard/products' className={({ isActive }) => `text-xl ${isActive ? 'bg-purple-500 text-gray-200' : 'bg-transparent'}
                flex items-center gap-2 p-2 rounded-2xl cursor-pointer p-3 w-full`}>
                <PackageSearch /> <span>Products</span> </NavLink>

                <NavLink to='/dashboard/users' className={({ isActive }) => `text-xl ${isActive ? 'bg-purple-500 text-gray-200' : 'bg-transparent'} 
                flex items-center gap-2 p-2 rounded-2xl cursor-pointer p-3 w-full`}>
                <Users /> <span>Users</span> </NavLink>

                <NavLink to='/dashboard/orders' className={({ isActive }) => `text-xl ${isActive ? 'bg-purple-500 text-gray-200' : 'bg-transparent'} 
                flex items-center gap-2 p-2 rounded-2xl cursor-pointer p-3 w-full`}>
                <ShoppingCart /> <span>Orders</span> </NavLink>
            </div>
        </div>
    )
}

export default Sidebar