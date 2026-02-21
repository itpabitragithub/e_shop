import { LayoutDashboard, PackagePlus, PackageSearch, ShoppingCart, Users } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router-dom'

const iconClass = 'h-5 w-5 shrink-0'

function Sidebar() {
    return (
        <div className='hidden fixed md:block border-r bg-purple-50 border-purple-200 left-0 w-[200px] p-4 top-16 h-[calc(100vh-4rem)]'>
            <div className='pt-4 px-2 space-y-1'>
                <NavLink to='/dashboard/sales' className={({ isActive }) => `text-sm flex items-center gap-2 py-2 px-3 rounded-xl cursor-pointer w-full ${isActive ? 'bg-purple-500 text-white' : 'bg-transparent text-gray-800 hover:bg-purple-100'}`}>
                    <LayoutDashboard className={iconClass} /> <span>Dashboard</span>
                </NavLink>

                <NavLink to='/dashboard/add-product' className={({ isActive }) => `text-sm flex items-center gap-2 py-2 px-3 rounded-xl cursor-pointer w-full ${isActive ? 'bg-purple-500 text-white' : 'bg-transparent text-gray-800 hover:bg-purple-100'}`}>
                    <PackagePlus className={iconClass} /> <span>Add Product</span>
                </NavLink>

                <NavLink to='/dashboard/products' className={({ isActive }) => `text-sm flex items-center gap-2 py-2 px-3 rounded-xl cursor-pointer w-full ${isActive ? 'bg-purple-500 text-white' : 'bg-transparent text-gray-800 hover:bg-purple-100'}`}>
                    <PackageSearch className={iconClass} /> <span>Products</span>
                </NavLink>

                <NavLink to='/dashboard/users' className={({ isActive }) => `text-sm flex items-center gap-2 py-2 px-3 rounded-xl cursor-pointer w-full ${isActive ? 'bg-purple-500 text-white' : 'bg-transparent text-gray-800 hover:bg-purple-100'}`}>
                    <Users className={iconClass} /> <span>Users</span>
                </NavLink>

                <NavLink to='/dashboard/orders' className={({ isActive }) => `text-sm flex items-center gap-2 py-2 px-3 rounded-xl cursor-pointer w-full ${isActive ? 'bg-purple-500 text-white' : 'bg-transparent text-gray-800 hover:bg-purple-100'}`}>
                    <ShoppingCart className={iconClass} /> <span>Orders</span>
                </NavLink>
            </div>
        </div>
    )
}

export default Sidebar