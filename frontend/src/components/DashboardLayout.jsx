import { useState } from 'react'
import { LogOut, BookOpen, LayoutDashboard, User, Menu, X } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function DashboardLayout({ user, children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const navLinks = [
    {
      to: '/dashboard',
      label: 'Panel Principal',
      icon: <LayoutDashboard size={20} />
    },
    {
      to: '/profile',
      label: 'Mi Perfil',
      icon: <User size={20} />
    }
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full w-64 bg-slate-900 text-slate-300 shrink-0">
      <div className="h-16 flex items-center justify-between px-6 bg-slate-950/50 border-b border-slate-800/30">
        <Link to="/dashboard" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
          <BookOpen className="text-brand-500 mr-3 animate-float" size={24} />
          <span className="text-white font-black text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">EduPlatform</span>
        </Link>
        <button 
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Menú Principal</p>
        <nav className="space-y-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to
            return (
              <Link 
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-brand-500/10 text-brand-400 border-l-4 border-brand-500 pl-3 font-semibold' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="p-4 bg-slate-950/30">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-800/40 border border-slate-800/50">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold shadow-md shadow-brand-500/10">
            {user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user.nombre}</p>
            <p className="text-xs text-slate-400 truncate capitalize">{user.rol === 'admin' ? 'Administrador' : 'Estudiante'}</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-dark-bg overflow-hidden transition-colors duration-300">
      
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden md:flex flex-col shrink-0 shadow-2xl z-20 border-r border-slate-800/10 dark:border-slate-800/40 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'w-0 overflow-hidden opacity-0 border-r-transparent' : 'w-64 opacity-100'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Drawer (Overlay backdrop) */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 w-64 z-50 md:hidden flex flex-col shadow-2xl transition-transform duration-300 ease-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-dark-surface border-b border-slate-200 dark:border-slate-800/60 flex items-center justify-between px-4 md:px-8 z-10 shrink-0 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                if (window.innerWidth < 768) {
                  setMobileMenuOpen(true)
                } else {
                  setSidebarCollapsed(!sidebarCollapsed)
                }
              }}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-300 transition-colors flex items-center justify-center"
              title={sidebarCollapsed ? "Expandir menú lateral" : "Colapsar menú lateral"}
            >
              <Menu size={22} />
            </button>
            <h1 className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {user.rol === 'admin' ? 'Panel de Administración' : 'Panel del Estudiante'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/5 border border-transparent hover:border-red-100 dark:hover:border-red-500/10"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-dark-bg p-4 md:p-8 transition-colors duration-300">
          <div className="max-w-6xl mx-auto">
             {children}
          </div>
        </main>
      </div>
    </div>
  )
}
