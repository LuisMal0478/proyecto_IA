import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import api from '../api/axios'
import { PlusCircle, Check, X, UserPlus, Users, BookOpen, Clock, Pencil, RefreshCw, Copy, CheckCircle } from 'lucide-react'

export default function AdminDashboard() {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const initialTab = queryParams.get('tab') || 'usuarios'

  const [courses, setCourses] = useState([])
  const [requests, setRequests] = useState([])
  const [users, setUsers] = useState([])
  const [activeTab, setActiveTab] = useState(initialTab)
  const [newCourse, setNewCourse] = useState({ titulo: '', descripcion: '', nivel: '', duracion_estimada: '', instructor: '' })
  const [newUser, setNewUser] = useState({ nombre: '', email: '', password: '', rol: 'student' })
  const [loading, setLoading] = useState(false)
  const [createdUserCredentials, setCreatedUserCredentials] = useState(null)

  const generateRandomPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let pass = ""
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setNewUser(prev => ({ ...prev, password: pass }))
  }

  // Estados para la edición de un curso
  const [editingCourse, setEditingCourse] = useState(null)
  const [editLoading, setEditLoading] = useState(false)

  const fetchData = async () => {
    try {
      const [reqRes, curRes, userRes] = await Promise.all([
        api.get('/enrollments/requests'),
        api.get('/courses/'),
        api.get('/users/')
      ])
      setRequests(reqRes.data)
      setCourses(curRes.data)
      setUsers(userRes.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAction = async (id, action) => {
    try {
      await api.put(`/enrollments/${id}/${action}`)
      fetchData()
    } catch (err) {
      alert("Error procesando solicitud")
    }
  }

  const handleCreateCourse = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/courses/', newCourse)
      setNewCourse({ titulo: '', descripcion: '', nivel: '', duracion_estimada: '', instructor: '' })
      fetchData()
    } catch (err) {
      alert("Error creando curso")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/users/admin', newUser)
      setCreatedUserCredentials({
        nombre: newUser.nombre,
        email: newUser.email,
        password: newUser.password,
        rol: newUser.rol
      })
      setNewUser({ nombre: '', email: '', password: '', rol: 'student' })
      fetchData()
    } catch (err) {
      alert(err.response?.data?.detail || "Error creando usuario")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateCourseDetails = async (e) => {
    e.preventDefault()
    setEditLoading(true)
    try {
      await api.put(`/courses/${editingCourse.id}`, {
        titulo: editingCourse.titulo,
        descripcion: editingCourse.descripcion,
        nivel: editingCourse.nivel,
        duracion_estimada: editingCourse.duracion_estimada,
        instructor: editingCourse.instructor
      })
      setEditingCourse(null)
      fetchData()
    } catch (err) {
      alert("Error actualizando el curso")
    } finally {
      setEditLoading(false)
    }
  }

  const handleToggleCourseStatus = async (course) => {
    try {
      const newStatus = !course.is_active
      await api.put(`/courses/${course.id}`, {
        is_active: newStatus
      })
      // Optimistic update for seamless UX
      setCourses(prev => prev.map(c => c.id === course.id ? { ...c, is_active: newStatus } : c))
    } catch (err) {
      alert("Error al cambiar el estado del curso")
      fetchData()
    }
  }

  return (
    <div className="animate-fade-in space-y-8">
      {/* Tarjetas de Estadísticas Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-500">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Usuarios</p>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{users.length}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-brand-50 dark:bg-brand-900/30 rounded-xl flex items-center justify-center text-brand-500">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cursos Registrados</p>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{courses.length}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-500">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Solicitudes Pendientes</p>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {requests.filter(r => r.estado === 'pending').length}
            </h4>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800/40 rounded-xl border border-slate-200/50 dark:border-slate-800/50 max-w-lg">
        <button 
          onClick={() => setActiveTab('usuarios')}
          className={`flex-1 py-2.5 px-4 font-bold text-sm rounded-lg transition-all ${activeTab === 'usuarios' ? 'bg-white dark:bg-dark-surface text-brand-500 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
        >
          Usuarios
        </button>
        <button 
          onClick={() => setActiveTab('solicitudes')}
          className={`flex-1 py-2.5 px-4 font-bold text-sm rounded-lg transition-all ${activeTab === 'solicitudes' ? 'bg-white dark:bg-dark-surface text-brand-500 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
        >
          Solicitudes
        </button>
        <button 
          onClick={() => setActiveTab('cursos')}
          className={`flex-1 py-2.5 px-4 font-bold text-sm rounded-lg transition-all ${activeTab === 'cursos' ? 'bg-white dark:bg-dark-surface text-brand-500 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
        >
          Cursos (LMS)
        </button>
      </div>

      {/* Secciones */}
      {activeTab === 'usuarios' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 h-fit">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><UserPlus size={20} className="text-brand-500" /> Registrar Usuario</h3>
            {createdUserCredentials ? (
              <div className="space-y-4 animate-fade-in">
                <div className="text-center pb-2">
                  <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl flex items-center justify-center text-emerald-500 mx-auto mb-2">
                    <CheckCircle size={24} />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white">¡Usuario Registrado!</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Copia y envía estas credenciales manualmente si el correo de notificación falla.
                  </p>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-505 uppercase tracking-wider mb-0.5">Nombre</span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{createdUserCredentials.nombre}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-505 uppercase tracking-wider mb-0.5">Correo</span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 select-all">{createdUserCredentials.email}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-505 uppercase tracking-wider mb-0.5">Contraseña</span>
                    <div className="flex justify-between items-center gap-2">
                      <span className="font-mono font-bold text-sm text-brand-600 dark:text-brand-400 select-all bg-brand-500/5 dark:bg-brand-500/10 px-2 py-0.5 rounded">
                        {createdUserCredentials.password}
                      </span>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(createdUserCredentials.password)
                          alert("¡Contraseña copiada!")
                        }}
                        className="text-[10px] font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 px-2 py-1 bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm"
                      >
                        Copiar
                      </button>
                    </div>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-505 uppercase tracking-wider mb-0.5">Rol</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 capitalize">
                      {createdUserCredentials.rol === 'admin' ? 'Administrador' : 'Estudiante'}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => setCreatedUserCredentials(null)}
                  className="w-full btn-primary py-2 text-xs font-bold"
                >
                  Registrar Otro Usuario
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre Completo</label>
                  <input required value={newUser.nombre} onChange={e => setNewUser({...newUser, nombre: e.target.value})} type="text" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Correo Electrónico</label>
                  <input required value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} type="email" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contraseña</label>
                  <div className="flex gap-2">
                    <input required value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} type="text" minLength="6" className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none" />
                    <button 
                      type="button"
                      onClick={generateRandomPassword}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold border border-slate-200 dark:border-slate-700 text-xs flex items-center gap-1 transition-all"
                    >
                      <RefreshCw size={14} /> Generar
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rol</label>
                  <select value={newUser.rol} onChange={e => setNewUser({...newUser, rol: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none">
                    <option value="student">Estudiante</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <button disabled={loading} type="submit" className="w-full btn-primary py-2.5 flex justify-center items-center gap-2 text-sm font-bold shadow-lg shadow-brand-500/20">
                  <PlusCircle size={20} /> {loading ? 'Registrando...' : 'Registrar'}
                </button>
              </form>
            )}
          </div>
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2"><Users size={20} /> Directorio de Usuarios ({users.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-slate-100/50 dark:bg-slate-800/20 text-slate-600 dark:text-slate-400 text-sm">
                      <th className="p-4 border-b border-slate-200 dark:border-slate-800">Nombre</th>
                      <th className="p-4 border-b border-slate-200 dark:border-slate-800">Email</th>
                      <th className="p-4 border-b border-slate-200 dark:border-slate-800">Rol</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="border-b border-slate-100 dark:border-slate-800/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{u.nombre}</td>
                        <td className="p-4 text-slate-600 dark:text-slate-400">{u.email}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.rol === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                            {u.rol === 'admin' ? 'Admin' : 'Estudiante'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr><td colSpan="3" className="p-8 text-center text-slate-500">No hay usuarios registrados.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'solicitudes' && (
        <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-100/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 text-sm">
                  <th className="p-4 border-b border-slate-200 dark:border-slate-700">Estudiante</th>
                  <th className="p-4 border-b border-slate-200 dark:border-slate-700">Curso</th>
                  <th className="p-4 border-b border-slate-200 dark:border-slate-700">Estado</th>
                  <th className="p-4 border-b border-slate-200 dark:border-slate-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="p-4 dark:text-slate-200">
                      <div className="font-semibold">{req.usuario?.nombre}</div>
                      <div className="text-xs text-slate-500">{req.usuario?.email}</div>
                    </td>
                    <td className="p-4 text-slate-800 dark:text-slate-200 font-medium">{req.curso?.titulo}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${req.estado === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-400' : req.estado === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400'}`}>
                        {req.estado === 'pending' ? 'pendiente' : req.estado === 'approved' ? 'aprobado' : 'rechazado'}
                      </span>
                    </td>
                    <td className="p-4">
                      {req.estado === 'pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => handleAction(req.id, 'approve')} className="p-2 bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-950/30 dark:text-green-400 dark:hover:bg-green-900/40 rounded-xl transition-colors" title="Aprobar">
                            <Check size={18} />
                          </button>
                          <button onClick={() => handleAction(req.id, 'reject')} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/40 rounded-xl transition-colors" title="Rechazar">
                            <X size={18} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr><td colSpan="4" className="p-8 text-center text-slate-500">No hay solicitudes actualmente.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'cursos' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 h-fit">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Crear Nuevo Curso</h3>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Título</label>
                <input required value={newCourse.titulo} onChange={e => setNewCourse({...newCourse, titulo: e.target.value})} type="text" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nivel</label>
                  <select value={newCourse.nivel} onChange={e => setNewCourse({...newCourse, nivel: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none">
                    <option value="">Nivel</option>
                    <option value="Básico">Básico</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Duración</label>
                  <input placeholder="Ej. 10h" value={newCourse.duracion_estimada} onChange={e => setNewCourse({...newCourse, duracion_estimada: e.target.value})} type="text" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Instructor</label>
                <input placeholder="Nombre" value={newCourse.instructor} onChange={e => setNewCourse({...newCourse, instructor: e.target.value})} type="text" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Descripción</label>
                <textarea required value={newCourse.descripcion} onChange={e => setNewCourse({...newCourse, descripcion: e.target.value})} rows="3" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"></textarea>
              </div>
              <button disabled={loading} type="submit" className="w-full btn-primary py-2.5 flex justify-center items-center gap-2 text-sm font-bold shadow-lg shadow-brand-500/20">
                <PlusCircle size={20} /> {loading ? 'Creando...' : 'Crear Curso'}
              </button>
            </form>
          </div>
          
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Cursos LMS Existentes</h3>
            {courses.length === 0 ? (
              <p className="text-slate-500 italic">No hay cursos creados todavía.</p>
            ) : (
              <div className="space-y-4">
                {courses.map(course => (
                  <div key={course.id} className="bg-white dark:bg-dark-surface p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-slate-300 dark:hover:border-slate-700">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-slate-900 dark:text-white truncate text-base">{course.titulo}</h4>
                        {course.nivel && (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 bg-brand-100 text-brand-700 dark:bg-brand-950/40 dark:text-brand-400 rounded-full uppercase tracking-wider">{course.nivel}</span>
                        )}
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${course.is_active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${course.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                          {course.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2">{course.descripcion}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-2.5 flex gap-3 flex-wrap">
                        <span><strong>Duración:</strong> {course.duracion_estimada || 'No especificada'}</span>
                        <span>•</span>
                        <span><strong>Instructor:</strong> {course.instructor || 'No especificado'}</span>
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2.5 justify-end sm:shrink-0">
                      {/* Toggle Switch */}
                      <button 
                        onClick={() => handleToggleCourseStatus(course)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${course.is_active ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                        title={course.is_active ? 'Desactivar Curso' : 'Activar Curso'}
                      >
                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${course.is_active ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>

                      <button 
                        onClick={() => setEditingCourse(course)}
                        className="text-xs px-3 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-semibold border border-slate-200 dark:border-slate-700 transition-colors"
                      >
                        Editar Info
                      </button>
                      
                      <Link 
                        to={`/admin/course/${course.id}/edit`} 
                        className="text-xs px-3 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold shadow-sm shadow-brand-500/10 transition-colors"
                      >
                        Lecciones
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de Edición de Curso */}
      {editingCourse && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg relative shadow-2xl animate-scale-in">
            <button 
              onClick={() => setEditingCourse(null)}
              className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Editar Detalles del Curso</h3>
            <form onSubmit={handleUpdateCourseDetails} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Título</label>
                <input required value={editingCourse.titulo} onChange={e => setEditingCourse({...editingCourse, titulo: e.target.value})} type="text" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nivel</label>
                  <select value={editingCourse.nivel || ''} onChange={e => setEditingCourse({...editingCourse, nivel: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none">
                    <option value="">Selecciona Nivel</option>
                    <option value="Básico">Básico</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Duración</label>
                  <input placeholder="Ej. 10 horas" value={editingCourse.duracion_estimada || ''} onChange={e => setEditingCourse({...editingCourse, duracion_estimada: e.target.value})} type="text" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Instructor</label>
                <input placeholder="Nombre del Instructor" value={editingCourse.instructor || ''} onChange={e => setEditingCourse({...editingCourse, instructor: e.target.value})} type="text" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Descripción</label>
                <textarea required value={editingCourse.descripcion} onChange={e => setEditingCourse({...editingCourse, descripcion: e.target.value})} rows="4" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"></textarea>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditingCourse(null)} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium">Cancelar</button>
                <button disabled={editLoading} type="submit" className="btn-primary py-2 px-5 text-sm font-bold shadow-md shadow-brand-500/20">{editLoading ? 'Guardando...' : 'Guardar Cambios'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
