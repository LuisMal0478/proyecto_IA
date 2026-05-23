import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                <BookOpen size={20} className="text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900 dark:text-white">EduPlatform</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-slate-600 hover:text-brand-500 dark:text-slate-300 transition-colors font-medium">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="bg-brand-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-600 transition-colors">
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
