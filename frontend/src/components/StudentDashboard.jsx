import { useState, useEffect } from 'react'
import api from '../api/axios'
import { Link } from 'react-router-dom'
import { BookOpen, CheckCircle, Clock, XCircle, Award, Sparkles, ArrowRight, PlayCircle, ShieldAlert } from 'lucide-react'
import CertificateModal from './CertificateModal'

export default function StudentDashboard({ user }) {
  const [courses, setCourses] = useState([])
  const [myRequests, setMyRequests] = useState([])
  const [courseProgress, setCourseProgress] = useState({})
  const [loading, setLoading] = useState(false)
  const [showCertModal, setShowCertModal] = useState(false)
  const [selectedCertificateCourse, setSelectedCertificateCourse] = useState(null)

  const fetchData = async () => {
    try {
      const [coursesRes, requestsRes] = await Promise.all([
        api.get('/courses/'),
        api.get('/enrollments/my-requests')
      ])
      setCourses(coursesRes.data)
      setMyRequests(requestsRes.data)
      
      // Fetch progress for approved courses
      const approvedRequests = requestsRes.data.filter(r => r.estado === 'approved')
      const progressData = {}
      await Promise.all(approvedRequests.map(async (req) => {
        try {
          const progRes = await api.get(`/courses/${req.curso_id}/progress`)
          progressData[req.curso_id] = progRes.data // Array of completed lesson IDs
        } catch (e) {
          console.error(`Error fetching progress for course ${req.curso_id}`, e)
        }
      }))
      setCourseProgress(progressData)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const requestEnrollment = async (courseId) => {
    setLoading(true)
    try {
      await api.post('/enrollments/request', { curso_id: courseId })
      alert("Solicitud enviada exitosamente")
      fetchData() // Refrescar para ver la nueva solicitud
    } catch (err) {
      alert(err.response?.data?.detail || "Error al solicitar inscripción")
    } finally {
      setLoading(false)
    }
  }

  const getRequestStatus = (courseId) => {
    return myRequests.find(req => req.curso_id === courseId)
  }

  // Stats calculations
  const approvedRequests = myRequests.filter(req => req.estado === 'approved')
  const pendingRequests = myRequests.filter(req => req.estado === 'pending')
  
  // Calculate completed courses
  const completedCoursesCount = approvedRequests.filter(req => {
    const courseDetails = courses.find(c => c.id === req.curso_id)
    if (!courseDetails) return false
    const totalLessons = courseDetails.modulos?.reduce((acc, mod) => acc + mod.lecciones.length, 0) || 0
    const completedCount = courseProgress[req.curso_id]?.length || 0
    return totalLessons > 0 && completedCount === totalLessons
  }).length

  // Filter out inactive courses for the Catalog section
  const activeCourses = courses.filter(course => course.is_active !== false)

  return (
    <div className="animate-fade-in space-y-10 pb-16">
      
      {/* Banner de Bienvenida */}
      <div className="relative overflow-hidden bg-gradient-to-r from-brand-600 via-sky-600 to-indigo-600 text-white rounded-3xl p-8 md:p-10 shadow-lg shadow-brand-500/20">
        {/* Decorative floating blurred layers */}
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/4 -mb-10 w-48 h-48 bg-sky-400/20 rounded-full blur-3xl animate-float" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 border border-white/10">
            <Sparkles size={10} className="animate-float" />
            <span>Panel del Estudiante</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
            ¡Hola, {user?.nombre || 'Estudiante'}! 👋
          </h2>
          <p className="text-sky-100 mt-2 text-sm md:text-base font-medium max-w-xl">
            Qué bueno tenerte de vuelta. Revisa tus cursos inscritos o explora el catálogo para seguir expandiendo tus conocimientos en Inteligencia Artificial y más.
          </p>
        </div>
      </div>

      {/* Tarjetas de Estadísticas Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-5 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-500">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cursos Inscritos</p>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{approvedRequests.length}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-5 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-500">
            <Award size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cursos Completados</p>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{completedCoursesCount}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-5 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-500">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Solicitudes Pendientes</p>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{pendingRequests.length}</h4>
          </div>
        </div>
      </div>

      {/* Sección: Mis Cursos y Solicitudes */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <span>Mis Cursos y Solicitudes</span>
          <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-bold text-slate-500">
            {myRequests.length}
          </span>
        </h2>
        
        {myRequests.length === 0 ? (
          <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center text-slate-500 shadow-sm">
            <BookOpen size={48} className="mx-auto text-slate-300 mb-3" />
            <p className="font-medium text-slate-600 dark:text-slate-400">Aún no tienes solicitudes ni cursos.</p>
            <p className="text-sm text-slate-400 mt-1">¡Explora el catálogo abajo para solicitar tu primera inscripción!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myRequests.map(req => {
              const courseDetails = courses.find(c => c.id === req.curso_id)
              const totalLessons = courseDetails?.modulos?.reduce((acc, mod) => acc + mod.lecciones.length, 0) || 0
              const completedCount = courseProgress[req.curso_id]?.length || 0
              const progressPercent = totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100)
              
              return (
                <div 
                  key={req.id} 
                  className="bg-white dark:bg-dark-surface shadow-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden group"
                >
                  {/* Status Indicator Left Strip */}
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-1.5"
                    style={{
                      backgroundColor: req.estado === 'approved' ? '#10b981' : req.estado === 'pending' ? '#f59e0b' : '#ef4444'
                    }}
                  />
                  
                  <div className="pl-2">
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        req.estado === 'approved' 
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' 
                          : req.estado === 'pending' 
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400' 
                            : 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'
                      }`}>
                        {req.estado === 'approved' && <><CheckCircle size={12}/> Aprobado</>}
                        {req.estado === 'pending' && <><Clock size={12}/> Pendiente</>}
                        {req.estado === 'rejected' && <><XCircle size={12}/> Rechazado</>}
                      </span>
                      
                      {courseDetails?.nivel && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full uppercase tracking-wider">
                          {courseDetails.nivel}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-brand-500 transition-colors">
                      {req.curso?.titulo}
                    </h3>
                    
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 line-clamp-2 leading-relaxed">
                      {courseDetails?.descripcion || req.curso?.descripcion}
                    </p>
                  </div>
                  
                  <div className="pl-2 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/60">
                    {req.estado === 'approved' && (
                      <div className="space-y-4">
                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-bold text-slate-500">
                            <span>Progreso del Curso</span>
                            <span className="text-emerald-600 dark:text-emerald-400">{progressPercent}%</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 transition-all duration-500" 
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                            {completedCount} de {totalLessons} lecciones completadas
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Link 
                            to={`/course/${req.curso_id}`} 
                            className="flex-1 btn-primary py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
                          >
                            <PlayCircle size={16} />
                            <span>Entrar</span>
                          </Link>
                          {progressPercent === 100 && (
                            <button 
                              onClick={() => {
                                setSelectedCertificateCourse({
                                  courseTitle: courseDetails?.titulo || req.curso?.titulo,
                                  instructor: courseDetails?.instructor || "Instructor Principal",
                                  duracion: courseDetails?.duracion_estimada || "N/A"
                                })
                                setShowCertModal(true)
                              }}
                              className="px-3 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/15 hover:-translate-y-0.5 transition-all cursor-pointer shrink-0"
                              title="Generar Certificado"
                            >
                              <Award size={15} />
                              <span>Certificado</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {req.estado === 'pending' && (
                      <div className="py-2.5 px-3 bg-amber-500/5 border border-amber-500/10 rounded-xl text-center">
                        <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 leading-relaxed">
                          Tu solicitud está en revisión. El administrador la verificará pronto.
                        </p>
                      </div>
                    )}
                    
                    {req.estado === 'rejected' && (
                      <div className="py-2.5 px-3 bg-red-500/5 border border-red-500/10 rounded-xl text-center flex items-center justify-center gap-1.5">
                        <ShieldAlert size={14} className="text-red-500 shrink-0" />
                        <p className="text-xs font-semibold text-red-600 dark:text-red-400">
                          Tu solicitud ha sido rechazada.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Sección: Catálogo de Cursos */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <span>Catálogo de Cursos Disponibles</span>
          <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-bold text-slate-500">
            {activeCourses.length}
          </span>
        </h2>
        
        {activeCourses.length === 0 ? (
          <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center text-slate-500 shadow-sm">
            <BookOpen size={48} className="mx-auto text-slate-300 mb-3" />
            <p className="font-medium text-slate-600 dark:text-slate-400">No hay cursos disponibles en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCourses.map(course => {
              const reqStatus = getRequestStatus(course.id)
              return (
                <div 
                  key={course.id} 
                  className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl p-6 flex flex-col h-full hover:-translate-y-1 group"
                >
                  {/* Header Frame / Illustration placeholder */}
                  <div className="relative w-full h-32 bg-gradient-to-br from-brand-500/10 to-indigo-500/10 dark:from-brand-500/5 dark:to-indigo-500/5 rounded-xl flex items-center justify-center text-brand-500 mb-5 overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0ea5e9_1px,transparent_1px)] [background-size:16px_16px]" />
                    <BookOpen size={40} className="relative z-10 group-hover:scale-110 transition-transform duration-300 text-brand-500 dark:text-brand-400" />
                    
                    {course.nivel && (
                      <span className="absolute top-3 right-3 text-[9px] font-bold px-2.5 py-0.5 bg-brand-500 text-white rounded-full uppercase tracking-wider">
                        {course.nivel}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-brand-500 transition-colors">
                    {course.titulo}
                  </h3>
                  
                  <p className="text-slate-600 dark:text-slate-400 text-xs mb-6 flex-grow line-clamp-3 leading-relaxed">
                    {course.descripcion}
                  </p>
                  
                  {/* Metadata Row */}
                  <div className="grid grid-cols-2 gap-3 mb-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-slate-450 dark:text-slate-500" />
                      <span className="truncate font-semibold">{course.duracion_estimada || 'No especificada'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[9px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400 uppercase truncate">
                        Prof
                      </span>
                      <span className="truncate font-semibold">{course.instructor || 'Instructor'}</span>
                    </div>
                  </div>
                  
                  {reqStatus ? (
                    <button 
                      disabled 
                      className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 cursor-not-allowed flex items-center justify-center gap-1.5"
                    >
                      {reqStatus.estado === 'approved' && <><CheckCircle size={14} /> Inscrito</>}
                      {reqStatus.estado === 'pending' && <><Clock size={14} /> Solicitud Enviada</>}
                      {reqStatus.estado === 'rejected' && <><XCircle size={14} /> Rechazado</>}
                    </button>
                  ) : (
                    <button 
                      onClick={() => requestEnrollment(course.id)} 
                      disabled={loading}
                      className="w-full btn-primary py-2.5 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-brand-500/20"
                    >
                      <span>Solicitar Inscripción</span>
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {selectedCertificateCourse && (
        <CertificateModal
          isOpen={showCertModal}
          onClose={() => {
            setShowCertModal(false)
            setSelectedCertificateCourse(null)
          }}
          courseTitle={selectedCertificateCourse.courseTitle}
          studentName={user?.nombre || "Estudiante"}
          instructor={selectedCertificateCourse.instructor}
          duracion={selectedCertificateCourse.duracion}
        />
      )}

    </div>
  )
}
