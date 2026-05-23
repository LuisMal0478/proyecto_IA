import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { UserPlus, Mail, User, ArrowLeft, CheckCircle } from 'lucide-react'
import api from '../api/axios'

export default function Register() {
  const token = localStorage.getItem('token')
  if (token) {
    return <Navigate to="/dashboard" replace />
  }

  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nombre: '',
    email: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [registeredCredentials, setRegisteredCredentials] = useState(null)

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')
    try {
      const res = await api.post('/auth/register', formData)
      if (res.data && res.data.password_plain) {
        setRegisteredCredentials(res.data)
      } else {
        setMessage('¡Cuenta creada! Revisa tu correo para ver tu contraseña.')
        setTimeout(() => navigate('/login'), 4000)
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al registrar')
    } finally {
      setLoading(false)
    }
  }

  if (registeredCredentials) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg p-4 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/20 dark:bg-emerald-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-300/20 dark:bg-brand-400/10 rounded-full blur-3xl" />
        
        <div className="w-full max-w-md relative z-10 animate-slide-up">
          <div className="glass-card p-8 sm:p-10 border-t-4 border-t-emerald-500">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl flex items-center justify-center text-emerald-550 dark:text-emerald-400 mx-auto mb-4 animate-bounce">
                <CheckCircle size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">¡Registro Exitoso!</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Tu cuenta ha sido creada. Debido a restricciones del proveedor de internet, el correo de credenciales podría fallar. <strong>Guarda tus credenciales de acceso ahora mismo:</strong>
              </p>
            </div>

            <div className="space-y-4 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div>
                <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-505 uppercase tracking-wider mb-1">Correo Electrónico</span>
                <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 select-all">{registeredCredentials.email}</span>
              </div>
              
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-505 uppercase tracking-wider mb-1">Contraseña Generada</span>
                <div className="flex justify-between items-center gap-2">
                  <span className="font-mono font-bold text-base text-brand-600 dark:text-brand-400 select-all bg-brand-500/5 dark:bg-brand-500/10 px-2.5 py-1 rounded">
                    {registeredCredentials.password_plain}
                  </span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(registeredCredentials.password_plain)
                      alert("¡Contraseña copiada al portapapeles!")
                    }}
                    className="text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 px-2 py-1 bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:shadow active:scale-95 transition-all"
                  >
                    Copiar
                  </button>
                </div>
              </div>
            </div>

            <button 
              onClick={() => navigate('/login')} 
              className="w-full btn-primary flex justify-center items-center gap-2 mt-6"
            >
              Ir al Inicio de Sesión
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg p-4 relative overflow-hidden">
      {/* Botón Volver al Inicio */}
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-brand-500 font-medium transition-colors z-20 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700">
        <ArrowLeft size={18} /> Volver al Inicio
      </Link>
      {/* Background decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-500/20 dark:bg-brand-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-300/20 dark:bg-brand-400/10 rounded-full blur-3xl" />
      
      <div className="w-full max-w-md relative z-10 animate-slide-up">
        <div className="glass-card p-8 sm:p-10">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Crea tu cuenta</h2>
            <p className="text-slate-600 dark:text-slate-400">Únete y recibe tu contraseña por correo electrónico</p>
          </div>

          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm text-center">{error}</div>}
          {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-xl text-sm text-center">{message}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Nombre Completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-slate-50 dark:bg-dark-bg dark:border-slate-700 dark:text-white transition-colors"
                  placeholder="Juan Pérez"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Correo Electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-slate-50 dark:bg-dark-bg dark:border-slate-700 dark:text-white transition-colors"
                  placeholder="tu@correo.com"
                  required
                />
              </div>
            </div>

            <button type="submit" className="w-full btn-primary flex justify-center items-center gap-2 mt-2">
              <UserPlus size={20} />
              Registrarse
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400">
              Inicia sesión aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
