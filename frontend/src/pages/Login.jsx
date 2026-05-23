import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { LogIn, Mail, Lock, ArrowLeft } from 'lucide-react'
import api from '../api/axios'

export default function Login() {
  const token = localStorage.getItem('token')
  if (token) {
    return <Navigate to="/dashboard" replace />
  }

  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const formParams = new URLSearchParams()
      formParams.append('username', email)
      formParams.append('password', password)

      const response = await api.post('/auth/login', formParams, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      localStorage.setItem('token', response.data.access_token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg p-4 relative overflow-hidden">
      {/* Botón Volver al Inicio */}
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-brand-500 font-medium transition-colors z-20 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700">
        <ArrowLeft size={18} /> Volver al Inicio
      </Link>
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-400/20 dark:bg-brand-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-300/20 dark:bg-brand-500/10 rounded-full blur-3xl" />
      
      <div className="w-full max-w-md relative z-10 animate-slide-up">
        <div className="glass-card p-8 sm:p-10">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Bienvenido de nuevo</h2>
            <p className="text-slate-600 dark:text-slate-400">Inicia sesión en tu cuenta para continuar aprendiendo</p>
          </div>

          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm text-center">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Correo Electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-slate-50 dark:bg-dark-bg dark:border-slate-700 dark:text-white transition-colors"
                  placeholder="tu@correo.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-slate-50 dark:bg-dark-bg dark:border-slate-700 dark:text-white transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" className="w-full btn-primary flex justify-center items-center gap-2">
              <LogIn size={20} />
              Iniciar Sesión
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400">
              Regístrate aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
