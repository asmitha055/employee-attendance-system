import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth'

export default function ProtectedRoute({ role, children }) {
  const { token, user } = useAuthStore()
  if (!token) return <Navigate to="/login" />
  if (role && user?.role !== role) return <Navigate to="/login" />
  return children
}
