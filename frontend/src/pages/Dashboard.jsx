import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import DashboardLayout from '../components/DashboardLayout'
import AdminDashboard from '../components/AdminDashboard'
import StudentDashboard from '../components/StudentDashboard'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/users/me')
        setUser(res.data)
      } catch (err) {
        localStorage.removeItem('token')
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [navigate])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center dark:bg-dark-bg text-slate-500">Cargando panel...</div>
  }

  return (
    <DashboardLayout user={user}>
      {user.rol === 'admin' ? <AdminDashboard /> : <StudentDashboard user={user} />}
    </DashboardLayout>
  )
}
