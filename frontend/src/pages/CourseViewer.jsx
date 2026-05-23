import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, Video, Activity, CheckSquare, CheckCircle, ChevronDown, ChevronRight, Menu, X, Award } from 'lucide-react'
import api from '../api/axios'
import DashboardLayout from '../components/DashboardLayout'
import GeneticAlgorithms from '../components/modules/GeneticAlgorithms'
import LinearRegression from '../components/modules/LinearRegression'
import AILab from '../components/modules/AILab'
import PythonLab from '../components/modules/PythonLab'
import LinearProgramming from '../components/modules/LinearProgramming'
import CertificateModal from '../components/CertificateModal'

function QuizRenderer({ quizData, markCompleted, isCompleted }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(isCompleted);

  const handleSelect = (qIndex, oIndex) => {
    if (submitted) return;
    setAnswers({ ...answers, [qIndex]: oIndex });
  };

  const calculateScore = () => {
    let score = 0;
    quizData.preguntas.forEach((q, i) => {
      if (answers[i] === q.correcta) score++;
    });
    return score;
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < quizData.preguntas.length) {
      alert("Por favor responde todas las preguntas antes de enviar.");
      return;
    }
    setSubmitted(true);
    const score = calculateScore();
    if (score === quizData.preguntas.length) {
      markCompleted();
    }
  };

  if (!quizData || quizData.preguntas?.length === 0) {
    return (
      <div className="bg-white dark:bg-dark-surface p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-center">
        <p className="text-slate-500">Este quiz aún no tiene preguntas configuradas.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-surface p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><CheckSquare className="text-emerald-500" /> Evaluación de Conocimiento</h3>
      {quizData.descripcion && <p className="text-slate-600 dark:text-slate-400 mb-8">{quizData.descripcion}</p>}
      
      <div className="space-y-8">
        {quizData.preguntas.map((q, qIndex) => (
          <div key={qIndex} className="space-y-3">
            <h4 className="font-bold text-slate-800 dark:text-white">
              {qIndex + 1}. {q.texto}
            </h4>
            <div className="space-y-2">
              {q.opciones.map((op, oIndex) => {
                const isSelected = answers[qIndex] === oIndex;
                const isCorrect = q.correcta === oIndex;
                const isWrong = isSelected && !isCorrect;
                
                let borderClass = 'border-slate-200 dark:border-slate-700';
                let bgClass = 'hover:bg-slate-50 dark:hover:bg-slate-800/50';
                
                if (submitted) {
                  if (isCorrect) {
                    borderClass = 'border-emerald-500';
                    bgClass = 'bg-emerald-50 dark:bg-emerald-900/20';
                  } else if (isWrong) {
                    borderClass = 'border-red-500';
                    bgClass = 'bg-red-50 dark:bg-red-900/20';
                  } else {
                    bgClass = 'opacity-50';
                  }
                } else if (isSelected) {
                  borderClass = 'border-brand-500';
                  bgClass = 'bg-brand-50 dark:bg-brand-900/20';
                }

                return (
                  <label key={oIndex} className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${borderClass} ${bgClass}`}>
                    <input 
                      type="radio" 
                      name={`quiz-${qIndex}`} 
                      checked={isSelected}
                      onChange={() => handleSelect(qIndex, oIndex)}
                      disabled={submitted}
                      className="w-5 h-5 accent-brand-500" 
                    />
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{op}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
        {submitted ? (
          <div className="font-bold text-lg">
            Puntuación: <span className={calculateScore() === quizData.preguntas.length ? 'text-emerald-500' : 'text-red-500'}>{calculateScore()} / {quizData.preguntas.length}</span>
            {calculateScore() === quizData.preguntas.length ? (
              <p className="text-sm text-emerald-600 mt-1">¡Perfecto! Has aprobado el quiz.</p>
            ) : (
              <p className="text-sm text-red-600 mt-1">Debes tener todas las respuestas correctas. Intenta de nuevo.</p>
            )}
          </div>
        ) : (
          <div></div>
        )}
        
        <button 
          onClick={submitted && calculateScore() !== quizData.preguntas.length ? () => { setSubmitted(false); setAnswers({}); } : handleSubmit}
          disabled={submitted && calculateScore() === quizData.preguntas.length}
          className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${submitted && calculateScore() === quizData.preguntas.length ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700 text-white shadow-lg'}`}
        >
          {submitted && calculateScore() !== quizData.preguntas.length ? 'Reintentar Quiz' : 'Enviar Respuestas'}
        </button>
      </div>
    </div>
  );
}

export default function CourseViewer() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [user, setUser] = useState({nombre: 'Cargando...', rol: 'student'})
  const [completedLessons, setCompletedLessons] = useState([])
  const [activeLesson, setActiveLesson] = useState(null)
  const [expandedModules, setExpandedModules] = useState({})
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showCertModal, setShowCertModal] = useState(false)

  const allLessons = useMemo(() => {
    if (!course?.modulos) return []
    return course.modulos.reduce((acc, mod) => [...acc, ...mod.lecciones], [])
  }, [course])

  useEffect(() => {
    if (activeLesson && course?.modulos) {
      const mod = course.modulos.find(m => m.lecciones.some(l => l.id === activeLesson.id))
      if (mod) {
        setExpandedModules(prev => ({...prev, [mod.id]: true}))
      }
    }
  }, [activeLesson, course])

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [courseRes, userRes, progressRes] = await Promise.all([
          api.get(`/courses/${id}`),
          api.get('/users/me'),
          api.get(`/courses/${id}/progress`)
        ])
        setCourse(courseRes.data)
        setUser(userRes.data)
        setCompletedLessons(progressRes.data)
        
        if (courseRes.data.modulos?.length > 0) {
          const savedLessonId = sessionStorage.getItem(`course_${id}_lesson`)
          let lessonToSet = null
          
          if (savedLessonId) {
            // Find the saved lesson
            for (const mod of courseRes.data.modulos) {
              const found = mod.lecciones.find(l => l.id.toString() === savedLessonId)
              if (found) {
                lessonToSet = found
                setExpandedModules({ [mod.id]: true })
                break
              }
            }
          }
          
          // Fallback to first lesson
          if (!lessonToSet) {
            const firstMod = courseRes.data.modulos[0]
            setExpandedModules({ [firstMod.id]: true })
            if (firstMod.lecciones?.length > 0) {
              lessonToSet = firstMod.lecciones[0]
            }
          }
          
          setActiveLesson(lessonToSet)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchInitialData()
  }, [id])

  useEffect(() => {
    if (activeLesson) {
      sessionStorage.setItem(`course_${id}_lesson`, activeLesson.id)
    }
  }, [activeLesson, id])

  useEffect(() => {
    if (course) {
      if (activeLesson) {
        document.title = `${activeLesson.titulo} - ${course.titulo} | Proyecto IA`
      } else {
        document.title = `${course.titulo} | Proyecto IA`
      }
    }
  }, [course, activeLesson])

  const toggleModule = (modId) => {
    setExpandedModules(prev => ({...prev, [modId]: !prev[modId]}))
  }

  const markCompleted = async () => {
    if (!activeLesson) return
    try {
      await api.post(`/courses/${id}/progress/${activeLesson.id}`)
      if (!completedLessons.includes(activeLesson.id)) {
        setCompletedLessons(prev => [...prev, activeLesson.id])
      }
    } catch (err) {
      alert("Error al guardar el progreso")
    }
  }

  const getLessonIcon = (tipo, isCompleted) => {
    if (isCompleted) return <CheckCircle size={18} className="text-emerald-500" />
    switch(tipo) {
      case 'video': return <Video size={18} className="text-slate-400" />
      case 'lab': return <Activity size={18} className="text-brand-500" />
      case 'quiz': return <CheckSquare size={18} className="text-emerald-400" />
      default: return <BookOpen size={18} className="text-slate-400" />
    }
  }

  if (!course) return <DashboardLayout user={user}><div className="p-8">Cargando curso...</div></DashboardLayout>

  // Renderizador dinámico del contenido
  const renderContent = () => {
    if (!activeLesson) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-slate-500">
          <BookOpen size={48} className="mb-4 text-slate-300" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Bienvenido a {course.titulo}</h2>
          <p>Selecciona una lección del menú para comenzar.</p>
        </div>
      )
    }

    const isCourseCompleted = totalLessons > 0 && completedLessons.length === totalLessons;

    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        {isCourseCompleted && (
          <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 p-0.5 rounded-2xl shadow-lg shadow-amber-500/10 mb-8 animate-fade-in no-print">
            <div className="bg-white dark:bg-dark-surface p-5 md:p-6 rounded-[14px] flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 text-center md:text-left flex-col md:flex-row">
                <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center text-amber-500 shrink-0">
                  <Award size={28} className="animate-bounce" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2 justify-center md:justify-start">
                    ¡Felicitaciones, {user.nombre}! 🎓
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                    Has completado el 100% de las lecciones del curso. ¡Tu certificado oficial ya está disponible!
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowCertModal(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-amber-500/15 hover:-translate-y-0.5 transition-all cursor-pointer shrink-0"
              >
                <Award size={16} />
                <span>Ver Certificado</span>
              </button>
            </div>
          </div>
        )}

        <h1 className="text-3xl font-black text-slate-900 dark:text-white">{activeLesson.titulo}</h1>
        
        {activeLesson.tipo === 'text' && (
          <div className="prose dark:prose-invert max-w-none bg-white dark:bg-dark-surface p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            {activeLesson.contenido ? (
              <div dangerouslySetInnerHTML={{ __html: activeLesson.contenido.replace(/\n/g, '<br/>') }} />
            ) : (
              <p className="text-slate-500 italic">No hay contenido de texto añadido todavía.</p>
            )}
          </div>
        )}

        {activeLesson.tipo === 'video' && (
          <div className="aspect-video bg-black rounded-2xl overflow-hidden flex items-center justify-center shadow-lg relative">
             {/* If it's a youtube embed link, render iframe. Else placeholder */}
             {activeLesson.contenido && activeLesson.contenido.includes('http') ? (
               <iframe className="w-full h-full" src={activeLesson.contenido} title="Video Player" allowFullScreen></iframe>
             ) : (
               <div className="text-slate-500 flex flex-col items-center">
                 <Video size={48} className="mb-4" />
                 <p>El reproductor de video se mostrará aquí.</p>
                 <p className="text-sm">(Pega un enlace de video en la configuración de la lección)</p>
               </div>
             )}
          </div>
        )}

        {activeLesson.tipo === 'lab' && (() => {
          let simulador = 'none';
          let instrucciones = '';
          
          try {
            if (activeLesson.contenido && activeLesson.contenido.trim().startsWith('{')) {
              const parsed = JSON.parse(activeLesson.contenido);
              simulador = parsed.simulador || 'none';
              instrucciones = parsed.instrucciones || '';
            } else {
              // Backward compatibility: fallback to parsing course title
              instrucciones = activeLesson.contenido || '';
              const titleLower = course.titulo.toLowerCase();
              if (titleLower.includes('genético')) {
                simulador = 'genetic_algorithms';
              } else if (titleLower.includes('lineal') || titleLower.includes('regresión')) {
                simulador = 'linear_regression';
              } else if (titleLower.includes('artificial') || titleLower.includes('machine learning')) {
                simulador = 'ai_lab';
              } else if (titleLower.includes('python')) {
                simulador = 'python_lab';
              } else if (titleLower.includes('programación lineal') || titleLower.includes('método gráfico')) {
                simulador = 'linear_programming';
              }
            }
          } catch (e) {
            instrucciones = activeLesson.contenido || '';
          }

          let SimulatorComponent = null;
          switch (simulador) {
            case 'python_lab':
              SimulatorComponent = <PythonLab />;
              break;
            case 'ai_lab':
              SimulatorComponent = <AILab />;
              break;
            case 'linear_regression':
              SimulatorComponent = <LinearRegression />;
              break;
            case 'genetic_algorithms':
              SimulatorComponent = <GeneticAlgorithms />;
              break;
            case 'linear_programming':
              SimulatorComponent = <LinearProgramming />;
              break;
            default:
              SimulatorComponent = null;
          }

          return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
                {/* Panel de Instrucciones */}
                <div className={`bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 ${SimulatorComponent ? 'lg:col-span-4' : 'lg:col-span-12'}`}>
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-3 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                    📋 Guía y Objetivos
                  </h3>
                  {instrucciones ? (
                    <div className="prose dark:prose-invert prose-sm text-slate-655 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {instrucciones}
                    </div>
                  ) : (
                    <p className="text-slate-400 dark:text-slate-500 italic text-sm">
                      No se han proporcionado instrucciones específicas para esta práctica. Sigue las indicaciones del docente o interactúa directamente con el simulador.
                    </p>
                  )}
                </div>

                {/* Panel del Simulador Interactivo */}
                {SimulatorComponent && (
                  <div className="lg:col-span-8 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-4 bg-brand-600 text-white flex justify-between items-center">
                      <h3 className="font-bold flex items-center gap-2 text-sm md:text-base"><Activity size={20} /> Laboratorio Interactivo en Vivo</h3>
                      <span className="px-2 py-0.5 bg-white/20 rounded text-xs font-bold uppercase tracking-wider">Entorno Seguro</span>
                    </div>
                    <div className="p-6">
                      {SimulatorComponent}
                    </div>
                  </div>
                )}

                {!SimulatorComponent && simulador !== 'none' && (
                  <div className="lg:col-span-8 p-12 text-center text-slate-500 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-white dark:bg-dark-surface">
                    <div className="max-w-md mx-auto space-y-3">
                      <Activity size={48} className="mx-auto text-slate-300 dark:text-slate-750 animate-pulse" />
                      <h4 className="font-bold text-slate-800 dark:text-white">Simulador en Construcción</h4>
                      <p className="text-sm text-slate-500">Este laboratorio interactivo aún no cuenta con un simulador asignado o configurado.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {activeLesson.tipo === 'quiz' && (() => {
          let quizData = { descripcion: '', preguntas: [] };
          try {
            if (activeLesson.contenido) quizData = JSON.parse(activeLesson.contenido);
          } catch (e) {
            console.error("Error parsing quiz data", e);
          }

          // State for the quiz
          // We use activeLesson.id as key to force re-render/reset state when changing lessons
          return <QuizRenderer key={activeLesson.id} quizData={quizData} markCompleted={markCompleted} isCompleted={completedLessons.includes(activeLesson.id)} />;
        })()}

        {/* Action Bar */}
        <div className="flex justify-between items-center pt-8 mt-8 border-t border-slate-200 dark:border-slate-800">
          <button 
            onClick={() => prevLesson && setActiveLesson(prevLesson)}
            disabled={!prevLesson}
            className={`px-6 py-3 font-medium transition-colors ${prevLesson ? 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200' : 'text-slate-300 dark:text-slate-700 cursor-not-allowed'}`}
          >
            Lección Anterior
          </button>
          
          <button 
            onClick={markCompleted}
            disabled={completedLessons.includes(activeLesson.id)}
            className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${completedLessons.includes(activeLesson.id) ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700 text-white shadow-lg hover:shadow-brand-500/25'}`}
          >
            {completedLessons.includes(activeLesson.id) ? (
              <><CheckCircle size={20} /> Completada</>
            ) : (
              'Marcar como Completada'
            )}
          </button>

          <button 
            onClick={() => nextLesson && setActiveLesson(nextLesson)}
            disabled={!nextLesson}
            className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 ${nextLesson ? 'text-brand-600 hover:text-brand-700' : 'text-slate-300 dark:text-slate-700 cursor-not-allowed'}`}
          >
            Siguiente Lección <ArrowLeft className="rotate-180" size={18} />
          </button>
        </div>
      </div>
    )
  }

  const currentIndex = allLessons.findIndex(l => l.id === activeLesson?.id)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex !== -1 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  // Calculando progreso global
  const totalLessons = course.modulos?.reduce((acc, mod) => acc + mod.lecciones.length, 0) || 0
  const progressPercent = totalLessons === 0 ? 0 : Math.round((completedLessons.length / totalLessons) * 100)

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-dark-bg overflow-hidden text-slate-900 dark:text-white relative">
      
      {/* Mobile Drawer Overlay Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-25 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Indice de Contenidos) */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-80 bg-white dark:bg-dark-surface border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 ease-in-out
        md:static md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:w-0 md:border-r-0 md:overflow-hidden'}
      `}>
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
          <div className="flex justify-between items-start mb-4">
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 transition-colors">
              <ArrowLeft size={16} /> Volver al Panel
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <h2 className="text-xl font-black mb-4 line-clamp-2 leading-tight">{course.titulo}</h2>
          
          {/* Progress Bar Global */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>PROGRESO DEL CURSO</span>
              <span className="text-brand-600">{progressPercent}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-brand-500 transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {course.modulos?.map((mod, index) => (
            <div key={mod.id} className="border-b border-slate-100 dark:border-slate-800/50">
              <button 
                onClick={() => toggleModule(mod.id)}
                className="w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-brand-500 uppercase tracking-wider block mb-1">Módulo {index + 1}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{mod.titulo}</span>
                </div>
                {expandedModules[mod.id] ? <ChevronDown size={20} className="text-slate-400" /> : <ChevronRight size={20} className="text-slate-400" />}
              </button>
              
              {expandedModules[mod.id] && (
                <div className="pb-2">
                  {mod.lecciones?.map(lec => {
                    const isCompleted = completedLessons.includes(lec.id);
                    const isActive = activeLesson?.id === lec.id;
                    return (
                      <button
                        key={lec.id}
                        onClick={() => {
                          setActiveLesson(lec);
                          if (window.innerWidth < 768) {
                            setSidebarOpen(false);
                          }
                        }}
                        className={`w-full text-left pl-6 pr-4 py-3 text-sm flex items-start gap-3 transition-colors ${isActive ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 font-bold border-l-4 border-brand-500' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border-l-4 border-transparent'}`}
                      >
                        <div className="mt-0.5">
                          {getLessonIcon(lec.tipo, isCompleted)}
                        </div>
                        <span className="flex-1">{lec.titulo}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50 dark:bg-[#0B1120]">
        <header className="h-16 flex items-center px-4 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition-colors mr-4"
          >
            <Menu size={24} />
          </button>
          <span className="font-medium text-slate-500">{course.titulo}</span>
          <ChevronRight size={16} className="mx-2 text-slate-300" />
          <span className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{activeLesson?.titulo || 'Lección'}</span>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
          {renderContent()}
        </div>
      </main>

      {course && (
        <CertificateModal
          isOpen={showCertModal}
          onClose={() => setShowCertModal(false)}
          courseTitle={course.titulo}
          studentName={user.nombre}
          instructor={course.instructor || "Instructor Principal"}
          duracion={course.duracion_estimada || "N/A"}
        />
      )}

    </div>
  )
}
