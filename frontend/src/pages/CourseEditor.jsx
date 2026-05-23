import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Save, BookOpen, Video, Activity, CheckSquare, Pencil, Trash2 } from 'lucide-react'
import SimpleEditor from '../components/SimpleEditor'
import QuizBuilder from '../components/QuizBuilder'
import api from '../api/axios'
import DashboardLayout from '../components/DashboardLayout'

export default function CourseEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState({nombre: 'Admin', rol: 'admin'})

  // Estados para formularios de creación
  const [newModule, setNewModule] = useState({ titulo: '', descripcion: '' })
  const [newLesson, setNewLesson] = useState({ modulo_id: null, titulo: '', tipo: 'text', contenido: '' })

  // Estados para edición
  const [editingModule, setEditingModule] = useState(null)
  const [editingLesson, setEditingLesson] = useState(null)

  const fetchCourse = async () => {
    try {
      const res = await api.get(`/courses/${id}`)
      setCourse(res.data)
      const userRes = await api.get('/users/me')
      setUser(userRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourse()
  }, [id])

  useEffect(() => {
    if (course) {
      document.title = `Editar: ${course.titulo} | Proyecto IA`
    }
  }, [course])

  const handleCreateModule = async (e) => {
    e.preventDefault()
    try {
      await api.post(`/courses/${id}/modules`, newModule)
      setNewModule({ titulo: '', descripcion: '' })
      fetchCourse()
    } catch (err) {
      alert("Error creando módulo")
    }
  }

  const handleCreateLesson = async (e, modulo_id) => {
    e.preventDefault()
    try {
      await api.post(`/courses/modules/${modulo_id}/lessons`, { ...newLesson, modulo_id })
      setNewLesson({ modulo_id: null, titulo: '', tipo: 'text', contenido: '' })
      fetchCourse()
    } catch (err) {
      alert("Error creando lección")
    }
  }

  const handleUpdateModule = async (e, modId) => {
    e.preventDefault()
    try {
      await api.put(`/courses/modules/${modId}`, editingModule)
      setEditingModule(null)
      fetchCourse()
    } catch (err) {
      alert("Error actualizando módulo")
    }
  }

  const handleUpdateLesson = async (e, lecId) => {
    e.preventDefault()
    try {
      await api.put(`/courses/lessons/${lecId}`, editingLesson)
      setEditingLesson(null)
      fetchCourse()
    } catch (err) {
      alert("Error actualizando lección")
    }
  }

  const handleDeleteModule = async (modId) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este módulo y todas sus lecciones de forma permanente?")) {
      return
    }
    try {
      await api.delete(`/courses/modules/${modId}`)
      fetchCourse()
    } catch (err) {
      alert("Error al eliminar el módulo")
    }
  }

  const handleDeleteLesson = async (lecId) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta lección permanentemente?")) {
      return
    }
    try {
      await api.delete(`/courses/lessons/${lecId}`)
      fetchCourse()
    } catch (err) {
      alert("Error al eliminar la lección")
    }
  }

  if (loading) return <DashboardLayout user={user}><div className="p-8">Cargando editor...</div></DashboardLayout>
  if (!course) return <DashboardLayout user={user}><div className="p-8">Curso no encontrado.</div></DashboardLayout>

  const getLessonIcon = (tipo) => {
    switch(tipo) {
      case 'video': return <Video size={16} className="text-blue-500" />
      case 'lab': return <Activity size={16} className="text-brand-500" />
      case 'quiz': return <CheckSquare size={16} className="text-emerald-500" />
      default: return <BookOpen size={16} className="text-slate-500" />
    }
  }

  return (
    <DashboardLayout user={user}>
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-700 pb-6">
          <Link to="/dashboard?tab=cursos" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Constructor LMS: {course.titulo}</h1>
            <p className="text-slate-500 text-sm">Agrega y edita módulos y lecciones de este curso.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Izquierda: Formulario Módulo */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Plus size={18} className="text-brand-500"/> Nuevo Módulo</h3>
              <form onSubmit={handleCreateModule} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-slate-300">Título del Módulo</label>
                  <input required value={newModule.titulo} onChange={e => setNewModule({...newModule, titulo: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-slate-300">Descripción (Opcional)</label>
                  <textarea value={newModule.descripcion} onChange={e => setNewModule({...newModule, descripcion: e.target.value})} rows="2" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white" />
                </div>
                <button type="submit" className="w-full btn-primary py-2 text-sm">Añadir Módulo</button>
              </form>
            </div>
          </div>

          {/* Columna Derecha: Estructura del Curso */}
          <div className="lg:col-span-2 space-y-6">
            {course.modulos?.length === 0 ? (
              <div className="text-center p-12 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-slate-500">
                Aún no hay módulos. Crea uno para empezar.
              </div>
            ) : (
              course.modulos?.map((mod, index) => (
                <div key={mod.id} className="bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start group">
                    {editingModule?.id === mod.id ? (
                      <form onSubmit={(e) => handleUpdateModule(e, mod.id)} className="flex-1 space-y-2">
                        <input required value={editingModule.titulo} onChange={e => setEditingModule({...editingModule, titulo: e.target.value})} className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white font-bold" />
                        <textarea value={editingModule.descripcion || ''} onChange={e => setEditingModule({...editingModule, descripcion: e.target.value})} className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white" rows="2" placeholder="Descripción del módulo..."></textarea>
                        <div className="flex gap-2 justify-end">
                          <button type="button" onClick={() => setEditingModule(null)} className="px-3 py-1 text-sm text-slate-500">Cancelar</button>
                          <button type="submit" className="px-3 py-1 text-sm bg-brand-500 text-white rounded-lg hover:bg-brand-600">Guardar</button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="flex-1 flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                              Módulo {index + 1}: {mod.titulo}
                              <button onClick={() => setEditingModule(mod)} className="text-slate-400 hover:text-brand-500 opacity-0 group-hover:opacity-100 transition-opacity" title="Editar Módulo"><Pencil size={14}/></button>
                            </h4>
                            {mod.descripcion && <p className="text-sm text-slate-500 mt-1">{mod.descripcion}</p>}
                          </div>
                          <button 
                            type="button" 
                            onClick={() => handleDeleteModule(mod.id)} 
                            className="text-slate-400 hover:text-red-500 p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            title="Eliminar Módulo completo"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="p-4 space-y-2">
                    {mod.lecciones?.length > 0 ? (
                      mod.lecciones.map(lec => (
                        <div key={lec.id} className="group flex flex-col p-3 bg-slate-50 dark:bg-slate-900/30 rounded-lg border border-slate-100 dark:border-slate-800">
                          
                          {editingLesson?.id === lec.id ? (
                            <form onSubmit={(e) => handleUpdateLesson(e, lec.id)} className="w-full space-y-3">
                              <div className="flex gap-2 items-center">
                                {getLessonIcon(lec.tipo)}
                                <input required value={editingLesson.titulo} onChange={e => setEditingLesson({...editingLesson, titulo: e.target.value})} className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white font-medium" />
                                <select value={editingLesson.tipo} onChange={e => setEditingLesson({...editingLesson, tipo: e.target.value})} className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white">
                                  <option value="text">Texto</option>
                                  <option value="video">Video</option>
                                  <option value="lab">Laboratorio</option>
                                  <option value="quiz">Quiz</option>
                                </select>
                              </div>
                              {editingLesson.tipo === 'text' ? (
                                <SimpleEditor 
                                  value={editingLesson.contenido || ''} 
                                  onChange={(content) => setEditingLesson({...editingLesson, contenido: content})}
                                />
                              ) : editingLesson.tipo === 'quiz' ? (
                                <QuizBuilder 
                                  value={editingLesson.contenido || ''} 
                                  onChange={(content) => setEditingLesson({...editingLesson, contenido: content})}
                                />
                              ) : editingLesson.tipo === 'lab' ? (
                                <div className="space-y-3">
                                  <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">ASIGNAR SIMULADOR EN VIVO</label>
                                    <select 
                                      value={(() => {
                                        try {
                                          if (editingLesson.contenido && editingLesson.contenido.trim().startsWith('{')) {
                                            return JSON.parse(editingLesson.contenido).simulador || 'none';
                                          }
                                        } catch(e) {}
                                        return 'none';
                                      })()}
                                      onChange={(e) => {
                                        let currentInst = '';
                                        try {
                                          if (editingLesson.contenido && editingLesson.contenido.trim().startsWith('{')) {
                                            currentInst = JSON.parse(editingLesson.contenido).instrucciones || '';
                                          } else {
                                            currentInst = editingLesson.contenido || '';
                                          }
                                        } catch(e) { currentInst = editingLesson.contenido || ''; }
                                        
                                        setEditingLesson({
                                          ...editingLesson,
                                          contenido: JSON.stringify({
                                            simulador: e.target.value,
                                            instrucciones: currentInst
                                          })
                                        });
                                      }}
                                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white font-bold"
                                    >
                                      <option value="none">Ninguno (Solo instrucciones de texto)</option>
                                      <option value="python_lab">Consola Interactiva de Python</option>
                                      <option value="ai_lab">Entrenador de Modelos IA (Sube CSV)</option>
                                      <option value="linear_regression">Ajuste Gráfico de Regresión Lineal</option>
                                      <option value="genetic_algorithms">Simulador de Algoritmos Genéticos</option>
                                      <option value="linear_programming">Método Gráfico (Programación Lineal)</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">INSTRUCCIONES DE LA PRÁCTICA</label>
                                    <textarea 
                                      placeholder="Describe lo que el alumno debe hacer en el laboratorio..."
                                      value={(() => {
                                        try {
                                          if (editingLesson.contenido && editingLesson.contenido.trim().startsWith('{')) {
                                            return JSON.parse(editingLesson.contenido).instrucciones || '';
                                          }
                                        } catch(e) {}
                                        return editingLesson.contenido || '';
                                      })()}
                                      onChange={(e) => {
                                        let currentSim = 'none';
                                        try {
                                          if (editingLesson.contenido && editingLesson.contenido.trim().startsWith('{')) {
                                            currentSim = JSON.parse(editingLesson.contenido).simulador || 'none';
                                          }
                                        } catch(e) {}
                                        
                                        setEditingLesson({
                                          ...editingLesson,
                                          contenido: JSON.stringify({
                                            simulador: currentSim,
                                            instrucciones: e.target.value
                                          })
                                        });
                                      }}
                                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white" 
                                      rows="3"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <textarea 
                                  value={editingLesson.contenido || ''} 
                                  onChange={e => setEditingLesson({...editingLesson, contenido: e.target.value})} 
                                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white font-mono" 
                                  rows="3" 
                                  placeholder="Contenido (URL de video o JSON)..."
                                ></textarea>
                              )}
                              <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setEditingLesson(null)} className="px-3 py-1.5 text-sm text-slate-500">Cancelar</button>
                                <button type="submit" className="px-3 py-1.5 text-sm bg-brand-500 text-white rounded-lg hover:bg-brand-600">Guardar Lección</button>
                              </div>
                            </form>
                          ) : (
                            <div className="flex items-center gap-3 w-full group/lesson">
                              {getLessonIcon(lec.tipo)}
                              <span className="font-medium text-slate-700 dark:text-slate-300">{lec.titulo}</span>
                              <div className="flex items-center gap-1.5 opacity-0 group-hover/lesson:opacity-100 transition-opacity">
                                <button onClick={() => setEditingLesson(lec)} className="text-slate-400 hover:text-brand-500 p-1" title="Editar Lección"><Pencil size={14}/></button>
                                <button type="button" onClick={() => handleDeleteLesson(lec.id)} className="text-slate-400 hover:text-red-500 p-1" title="Eliminar Lección"><Trash2 size={14}/></button>
                              </div>
                              <span className="text-xs px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded-full ml-auto uppercase text-slate-500 dark:text-slate-400">{lec.tipo}</span>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400 italic p-2">Sin lecciones en este módulo.</p>
                    )}

                    {/* Formulario rápido para añadir lección */}
                    {newLesson.modulo_id === mod.id ? (
                      <form onSubmit={(e) => handleCreateLesson(e, mod.id)} className="mt-4 p-4 bg-brand-50 dark:bg-brand-900/10 border border-brand-100 dark:border-brand-900/30 rounded-xl space-y-4">
                        <h5 className="font-bold text-sm text-brand-700 dark:text-brand-400">Crear Nueva Lección</h5>
                        
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">TÍTULO DE LA LECCIÓN</label>
                            <input required placeholder="Ej: Introducción a Redes Neuronales" value={newLesson.titulo} onChange={e => setNewLesson({...newLesson, titulo: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white" />
                          </div>
                          <div className="w-36">
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">TIPO DE LECCIÓN</label>
                            <select value={newLesson.tipo} onChange={e => setNewLesson({...newLesson, tipo: e.target.value, contenido: ''})} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white">
                              <option value="text">Texto / Artículo</option>
                              <option value="video">Video</option>
                              <option value="lab">Laboratorio</option>
                              <option value="quiz">Quiz / Cuestionario</option>
                            </select>
                          </div>
                        </div>

                        {/* Contenido / Desarrollo según el tipo de lección */}
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                            {newLesson.tipo === 'text' && "DESARROLLO DE LA LECCIÓN (TEXTO ENRIQUECIDO E IMÁGENES)"}
                            {newLesson.tipo === 'video' && "ENLACE DEL VIDEO (YOUTUBE / EMBED / MP4)"}
                            {newLesson.tipo === 'lab' && "CÓDIGO O DESCRIPCIÓN DEL LABORATORIO"}
                            {newLesson.tipo === 'quiz' && "CREACIÓN DEL CUESTIONARIO"}
                          </label>

                          {newLesson.tipo === 'text' ? (
                            <SimpleEditor 
                              value={newLesson.contenido || ''} 
                              onChange={(content) => setNewLesson({...newLesson, contenido: content})}
                              placeholder="Escribe el desarrollo completo de la lección aquí... Puedes dar formato e insertar imágenes usando el menú superior."
                            />
                          ) : newLesson.tipo === 'quiz' ? (
                            <QuizBuilder 
                              value={newLesson.contenido || ''} 
                              onChange={(content) => setNewLesson({...newLesson, contenido: content})}
                            />
                          ) : newLesson.tipo === 'video' ? (
                            <input 
                              type="url"
                              required
                              placeholder="Introduce la URL del video (ej: https://www.youtube.com/embed/...)" 
                              value={newLesson.contenido || ''} 
                              onChange={e => setNewLesson({...newLesson, contenido: e.target.value})} 
                              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white" 
                            />
                          ) : newLesson.tipo === 'lab' ? (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">ASIGNAR SIMULADOR EN VIVO</label>
                                <select 
                                  value={(() => {
                                    try {
                                      if (newLesson.contenido && newLesson.contenido.trim().startsWith('{')) {
                                        return JSON.parse(newLesson.contenido).simulador || 'none';
                                      }
                                    } catch(e) {}
                                    return 'none';
                                  })()}
                                  onChange={(e) => {
                                    let currentInst = '';
                                    try {
                                      if (newLesson.contenido && newLesson.contenido.trim().startsWith('{')) {
                                        currentInst = JSON.parse(newLesson.contenido).instrucciones || '';
                                      } else {
                                        currentInst = newLesson.contenido || '';
                                      }
                                    } catch(err) { currentInst = newLesson.contenido || ''; }
                                    
                                    setNewLesson({
                                      ...newLesson,
                                      contenido: JSON.stringify({
                                        simulador: e.target.value,
                                        instrucciones: currentInst
                                      })
                                    });
                                  }}
                                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white"
                                >
                                  <option value="none">Ninguno (Solo instrucciones de texto)</option>
                                  <option value="python_lab">Consola Interactiva de Python</option>
                                  <option value="ai_lab">Entrenador de Modelos IA (Sube CSV)</option>
                                  <option value="linear_regression">Ajuste Gráfico de Regresión Lineal</option>
                                  <option value="genetic_algorithms">Simulador de Algoritmos Genéticos</option>
                                  <option value="linear_programming">Método Gráfico (Programación Lineal)</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">INSTRUCCIONES DE LA PRÁCTICA</label>
                                <textarea 
                                  placeholder="Describe lo que el alumno debe hacer en el laboratorio..."
                                  value={(() => {
                                    try {
                                      if (newLesson.contenido && newLesson.contenido.trim().startsWith('{')) {
                                        return JSON.parse(newLesson.contenido).instrucciones || '';
                                      }
                                    } catch(e) {}
                                    return newLesson.contenido || '';
                                  })()}
                                  onChange={(e) => {
                                    let currentSim = 'none';
                                    try {
                                      if (newLesson.contenido && newLesson.contenido.trim().startsWith('{')) {
                                        currentSim = JSON.parse(newLesson.contenido).simulador || 'none';
                                      }
                                    } catch(err) {}
                                    
                                    setNewLesson({
                                      ...newLesson,
                                      contenido: JSON.stringify({
                                        simulador: currentSim,
                                        instrucciones: e.target.value
                                      })
                                    });
                                  }}
                                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white" 
                                  rows="3"
                                />
                              </div>
                            </div>
                          ) : (
                            <textarea 
                              placeholder="Introduce detalles, instrucciones o URL del entorno interactivo para este laboratorio..."
                              value={newLesson.contenido || ''} 
                              onChange={e => setNewLesson({...newLesson, contenido: e.target.value})} 
                              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white font-mono" 
                              rows="3"
                            />
                          )}
                          
                          {newLesson.tipo === 'text' && (
                            <p className="text-xs text-slate-400 mt-1">
                              💡 **Tip de imágenes**: Ahora puedes subir imágenes locales directamente desde tu explorador de archivos con el botón **"Subir Imagen"** del editor.
                            </p>
                          )}
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-850">
                          <button type="button" onClick={() => setNewLesson({modulo_id: null, titulo: '', tipo: 'text', contenido: ''})} className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700">Cancelar</button>
                          <button type="submit" className="px-5 py-2 text-sm font-bold bg-brand-500 text-white rounded-lg hover:bg-brand-600 shadow-md shadow-brand-500/10">Crear Lección</button>
                        </div>
                      </form>
                    ) : (
                      <button onClick={() => setNewLesson({...newLesson, modulo_id: mod.id})} className="mt-2 flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 p-2">
                        <Plus size={16} /> Añadir Lección
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
