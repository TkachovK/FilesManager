import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '../providers/auth'

export const ProtectedRoute = () => {
  const { token } = useAuth()

  if (!token) {
    return <Navigate to="/" />
  }

  return <Outlet />
}
