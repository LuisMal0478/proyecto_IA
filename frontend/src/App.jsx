import { useEffect } from 'react'
import { Routes, Route, Outlet, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CourseViewer from './pages/CourseViewer'
import CourseEditor from './pages/CourseEditor'
import Profile from './pages/Profile'

function PublicLayout() {
  return (
    <main>
      <Outlet />
    </main>
  )
}

function App() {
  const location = useLocation()

  useEffect(() => {
    const path = location.pathname
    let title = "Proyecto IA"

    if (path === '/') {
      title = "Inicio | Proyecto IA"
    } else if (path === '/login') {
      title = "Iniciar Sesión | Proyecto IA"
    } else if (path === '/register') {
      title = "Registrarse | Proyecto IA"
    } else if (path === '/dashboard') {
      title = "Dashboard | Proyecto IA"
    } else if (path.startsWith('/course/')) {
      title = "Cargando Curso... | Proyecto IA"
    } else if (path.includes('/admin/course/') && path.endsWith('/edit')) {
      title = "Editar Curso | Proyecto IA"
    } else if (path === '/profile') {
      title = "Mi Perfil | Proyecto IA"
    }

    document.title = title
  }, [location])

  return (
    <div className="min-h-screen">
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/course/:id" element={<CourseViewer />} />
        <Route path="/admin/course/:id/edit" element={<CourseEditor />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  )
}

export default App
