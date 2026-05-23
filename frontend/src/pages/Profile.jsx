import { useState, useEffect } from 'react'
import { User, Lock, Save, Camera } from 'lucide-react'
import api from '../api/axios'
import DashboardLayout from '../components/DashboardLayout'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [name, setName] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [msg, setMsg] = useState({ text: '', type: '' })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/users/me')
        setUser(res.data)
        setName(res.data.nombre)
      } catch (err) {
        console.error(err)
      }
    }
    fetchUser()
  }, [])

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    try {
      await api.put('/users/me', { nombre: name })
      setMsg({ text: 'Perfil actualizado correctamente', type: 'success' })
      setTimeout(() => setMsg({ text: '', type: '' }), 3000)
    } catch (err) {
      setMsg({ text: 'Error al actualizar perfil', type: 'error' })
    }
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    try {
      await api.put('/users/me/password', { current_password: currentPassword, new_password: newPassword })
      setMsg({ text: 'Contraseña actualizada correctamente', type: 'success' })
      setCurrentPassword('')
      setNewPassword('')
      setTimeout(() => setMsg({ text: '', type: '' }), 3000)
    } catch (err) {
      setMsg({ text: err.response?.data?.detail || 'Error al cambiar contraseña', type: 'error' })
    }
  }

  if (!user) return <DashboardLayout user={{nombre: 'Cargando...', email: '', rol: 'student'}}><div className="p-8">Cargando...</div></DashboardLayout>

  return (
    <DashboardLayout user={user}>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-8">Mi Perfil</h1>

        {msg.text && (
          <div className={`p-4 rounded-xl font-medium mb-6 ${msg.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
            {msg.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tarjeta Info General */}
          <div className="bg-white dark:bg-dark-surface p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <User className="text-brand-500" /> Información General
            </h2>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-20 h-20 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center text-3xl font-black relative overflow-hidden group">
                {user.nombre.charAt(0).toUpperCase()}
                <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center cursor-pointer transition-all text-white">
                  <Camera size={24} />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-500 uppercase tracking-wider">{user.rol === 'admin' ? 'Administrador' : 'Estudiante'}</p>
                <p className="text-slate-500">{user.email}</p>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre Completo</label>
                <input required value={name} onChange={e => setName(e.target.value)} type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all" />
              </div>
              <button type="submit" className="w-full btn-primary py-3 flex justify-center items-center gap-2">
                <Save size={20} /> Guardar Cambios
              </button>
            </form>
          </div>

          {/* Tarjeta Seguridad */}
          <div className="bg-white dark:bg-dark-surface p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 h-fit">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <Lock className="text-brand-500" /> Seguridad
            </h2>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contraseña Actual</label>
                <input required value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nueva Contraseña</label>
                <input required value={newPassword} onChange={e => setNewPassword(e.target.value)} type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all" />
              </div>
              <button type="submit" className="w-full bg-slate-900 dark:bg-slate-700 text-white font-bold rounded-xl py-3 hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors mt-2">
                Actualizar Contraseña
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
