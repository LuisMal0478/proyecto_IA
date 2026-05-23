import { Link, Navigate } from 'react-router-dom'
import { BookOpen, Award, Users, ArrowRight, Sparkles, Zap, BrainCircuit, CheckCircle } from 'lucide-react'

export default function Home() {
  const token = localStorage.getItem('token')
  if (token) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="h-screen w-full overflow-y-auto snap-y snap-mandatory bg-slate-50 dark:bg-dark-bg transition-colors duration-300 relative scroll-smooth">
      
      {/* Background Animated Orbs - Ahora fijos para que el scroll pase sobre ellos */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-400/30 dark:bg-brand-600/20 rounded-full blur-[120px] animate-pulse-glow pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-[120px] animate-pulse-glow pointer-events-none" style={{animationDelay: '2s'}} />

      {/* Sección 1: Hero */}
      <section className="snap-start h-screen w-full flex items-center justify-center relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="absolute top-20 left-[10%] hidden lg:flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg animate-float text-sm font-semibold text-slate-700 dark:text-slate-200">
            <Sparkles className="text-yellow-500" size={18} /> Cursos Premium
          </div>
          <div className="absolute top-40 right-[10%] hidden lg:flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg animate-float-delayed text-sm font-semibold text-slate-700 dark:text-slate-200">
            <BrainCircuit className="text-brand-500" size={18} /> Aprendizaje Práctico
          </div>

          <div className="animate-fade-in">
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tight mb-8 leading-tight">
              Aprende <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-purple-500 to-brand-400 animate-gradient-x">
                Nuevas Habilidades
              </span>
            </h1>
            <p className="mt-6 max-w-3xl text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-300 mx-auto mb-12 font-medium">
              Explora nuestro catálogo interactivo creado por expertos. 
              Domina cualquier área con herramientas en tiempo real y a tu propio ritmo.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6 animate-slide-up" style={{animationDelay: '0.2s'}}>
              <Link to="/register" className="group relative px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 shadow-2xl hover:shadow-brand-500/25 flex items-center justify-center gap-3">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center gap-2">Comenzar Gratis <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} /></span>
              </Link>
              <Link to="/login" className="px-8 py-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md text-slate-900 dark:text-white font-bold rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:scale-105 transition-all duration-300 flex items-center justify-center shadow-lg">
                Ya tengo cuenta
              </Link>
            </div>
            
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-400">
              <span className="text-sm tracking-widest uppercase font-semibold">Desliza para descubrir</span>
              <ArrowRight className="mx-auto mt-2 rotate-90" size={24} />
            </div>
          </div>
        </div>
      </section>

      {/* Sección 2: Features Cards */}
      <section className="snap-start h-screen w-full flex items-center justify-center relative z-10 px-4 sm:px-6 lg:px-8 bg-white/10 dark:bg-slate-900/10 backdrop-blur-md border-y border-white/20 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">¿Por qué elegirnos?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700/60 p-10 rounded-[2rem] shadow-xl hover:shadow-2xl hover:shadow-brand-500/20 hover:-translate-y-4 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-bl-full transition-transform group-hover:scale-110" />
              <div className="w-16 h-16 bg-gradient-to-br from-brand-400 to-brand-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                <Zap size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Contenido Dinámico</h3>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">Ejercicios interactivos y laboratorios en tiempo real para que compruebes tus conocimientos al instante.</p>
            </div>

            <div className="group bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700/60 p-10 rounded-[2rem] shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-4 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-bl-full transition-transform group-hover:scale-110" />
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
                <Users size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Comunidad Exclusiva</h3>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">Los cupos son gestionados por expertos para asegurar una atención y seguimiento hiper-personalizado.</p>
            </div>

            <div className="group bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700/60 p-10 rounded-[2rem] shadow-xl hover:shadow-2xl hover:shadow-pink-500/20 hover:-translate-y-4 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-bl-full transition-transform group-hover:scale-110" />
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                <Award size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Logros y Certificados</h3>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">Presenta exámenes prácticos y obtén certificaciones con valor curricular tras cada módulo completado.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 3: Más Información / Estadísticas */}
      <section className="snap-start h-screen w-full flex items-center justify-center relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 font-bold text-sm mb-6">
              <Sparkles size={16} /> Nuestra Metodología
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
              Aprendizaje basado en <span className="text-brand-500">Práctica Real</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Olvídate de las clases aburridas de pura teoría. Nuestra plataforma te sumerge directamente en código, bases de datos y algoritmos funcionales desde el primer día.
            </p>
            <ul className="space-y-4 text-lg font-medium text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-3"><CheckCircle className="text-green-500" size={24}/> Proyectos listos para tu portafolio</li>
              <li className="flex items-center gap-3"><CheckCircle className="text-green-500" size={24}/> Mentoría 1 a 1 por especialistas</li>
              <li className="flex items-center gap-3"><CheckCircle className="text-green-500" size={24}/> Acceso de por vida a los materiales</li>
            </ul>
          </div>
          
          <div className="flex-1 grid grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-gradient-to-br from-brand-400 to-brand-600 rounded-[2rem] p-8 text-white shadow-xl lg:-translate-y-8 hover:scale-105 transition-transform duration-300">
              <h4 className="text-5xl font-black mb-2">+10k</h4>
              <p className="text-brand-100 font-medium text-lg">Estudiantes Activos</p>
            </div>
            <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-[2rem] p-8 text-white shadow-xl lg:translate-y-8 hover:scale-105 transition-transform duration-300">
              <h4 className="text-5xl font-black mb-2">95%</h4>
              <p className="text-purple-100 font-medium text-lg">Tasa de Empleabilidad</p>
            </div>
            <div className="bg-gradient-to-br from-pink-400 to-pink-600 rounded-[2rem] p-8 text-white shadow-xl lg:-translate-y-8 hover:scale-105 transition-transform duration-300">
              <h4 className="text-5xl font-black mb-2">50+</h4>
              <p className="text-pink-100 font-medium text-lg">Cursos Exclusivos</p>
            </div>
            <div className="bg-slate-800 rounded-[2rem] p-8 text-white shadow-xl lg:translate-y-8 hover:scale-105 transition-transform duration-300 border border-slate-700">
              <h4 className="text-5xl font-black mb-2">24/7</h4>
              <p className="text-slate-400 font-medium text-lg">Soporte Técnico</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 4: Call To Action Final */}
      <section className="snap-start h-screen w-full flex items-center justify-center relative z-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/20 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="text-center max-w-4xl relative z-10">
          <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">¿Listo para transformar tu futuro profesional?</h2>
          <p className="text-xl md:text-2xl text-slate-400 mb-12 font-medium max-w-2xl mx-auto">Únete a nuestra plataforma hoy y comienza a construir el futuro que deseas con los mejores instructores de la industria tecnológica.</p>
          <Link to="/register" className="inline-flex items-center gap-3 px-12 py-6 bg-white text-slate-900 rounded-full font-black text-xl hover:scale-105 transition-transform shadow-[0_0_50px_rgba(255,255,255,0.3)]">
            Crear mi cuenta gratis <ArrowRight size={24} />
          </Link>
        </div>
      </section>

    </div>
  )
}
