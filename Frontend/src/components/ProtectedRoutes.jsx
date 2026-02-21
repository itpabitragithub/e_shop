import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

function ProtectedRoutes({ children, adminOnly = false, userOnly = false }) {
    const { user } = useSelector((state) => state.user)
    const location = useLocation()

    const userType = user?.user_type ?? (user?.role === 'ADMIN' ? 'admin' : 'user')

    if (!user) {
        const loginPath = adminOnly ? '/admin/login' : '/login'
        return <Navigate to={loginPath} state={{ from: location }} replace />
    }

    if (adminOnly && userType !== 'admin') {
        return <Navigate to="/" replace />
    }

    if (userOnly && userType !== 'user') {
        return <Navigate to="/dashboard/sales" replace />
    }
    return children
}

export default ProtectedRoutes