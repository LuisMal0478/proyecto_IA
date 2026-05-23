import { X, Printer, Award, ShieldCheck, Calendar } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function CertificateModal({ isOpen, onClose, courseTitle, studentName, instructor, duracion }) {
  const [certCode, setCertCode] = useState('')
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    if (isOpen) {
      // Generate a deterministic or random certificate code
      const code = 'EP-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase()
      setCertCode(code)
      
      // Format current date
      const date = new Date().toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
      setCurrentDate(date)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-dark-surface w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 print-modal-content">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center no-print">
          <div className="flex items-center gap-2 text-amber-500 font-bold">
            <Award size={20} className="animate-pulse" />
            <span>Vista Previa del Certificado</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body / Certificate Container */}
        <div className="p-6 md:p-10 flex flex-col items-center bg-slate-100 dark:bg-slate-950/40 print-body-wrapper">
          
          {/* Printable Certificate Frame */}
          <div 
            id="certificate-print-area" 
            className="w-full max-w-3xl aspect-[1.414/1] bg-white border-[12px] border-amber-600 p-8 md:p-12 relative flex flex-col justify-between items-center text-slate-850 shadow-lg text-center overflow-hidden"
            style={{ fontFamily: "'Times New Roman', serif" }}
          >
            {/* Ornamental Background Accents */}
            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
            <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-amber-500/30 pointer-events-none" />
            
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-amber-600 pointer-events-none" />
            <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-amber-600 pointer-events-none" />
            <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-amber-600 pointer-events-none" />
            <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-amber-600 pointer-events-none" />

            {/* Logo and Institution */}
            <div className="space-y-1">
              <h4 className="text-sm font-semibold tracking-widest text-amber-700 uppercase" style={{ fontFamily: 'var(--font-sans), sans-serif' }}>
                EDUPLATFORM • ACADEMIA DE INTELIGENCIA ARTIFICIAL
              </h4>
              <div className="h-0.5 w-24 bg-amber-600 mx-auto mt-2" />
            </div>

            {/* Main Header */}
            <div className="my-3 md:my-5">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-wider font-serif">
                CERTIFICADO DE APROBACIÓN
              </h2>
              <p className="text-slate-500 italic mt-2 text-sm md:text-base">
                Este documento oficial certifica que
              </p>
            </div>

            {/* Student Name */}
            <div className="my-2">
              <h1 className="text-3xl md:text-4xl font-bold text-amber-700 italic underline decoration-amber-500/30 decoration-wavy decoration-1 underline-offset-8">
                {studentName}
              </h1>
            </div>

            {/* Details and Course Title */}
            <div className="max-w-2xl mx-auto my-3 md:my-4 space-y-2">
              <p className="text-slate-650 text-sm md:text-base leading-relaxed">
                Ha completado y aprobado satisfactoriamente todas las lecciones, cuestionarios teóricos y prácticas del curso de especialización tecnológica:
              </p>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                {courseTitle}
              </h3>
              <p className="text-slate-500 text-xs md:text-sm">
                Con una intensidad horaria estimada de <strong className="text-slate-800">{duracion}</strong> de dedicación académica y práctica.
              </p>
            </div>

            {/* Signatures & Seal Row */}
            <div className="grid grid-cols-3 w-full items-end mt-4 md:mt-8 pt-4 border-t border-slate-100">
              
              {/* Left Signature */}
              <div className="flex flex-col items-center">
                <span className="text-sm md:text-base font-serif italic text-blue-700 mb-1" style={{ fontFamily: "'Dancing Script', cursive, serif" }}>
                  {instructor}
                </span>
                <div className="w-24 md:w-36 h-px bg-slate-300 mb-1" />
                <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                  Instructor del Curso
                </span>
              </div>

              {/* Gold Seal / Medallion */}
              <div className="flex flex-col items-center justify-center relative">
                <div className="w-14 h-14 md:w-18 md:h-18 bg-gradient-to-br from-yellow-400 via-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg relative border-4 border-white shadow-amber-600/30">
                  {/* Seal Ribbons */}
                  <div className="absolute top-full -mt-2 left-3 w-3 h-8 bg-amber-600 transform rotate-12 -z-10" />
                  <div className="absolute top-full -mt-2 right-3 w-3 h-8 bg-amber-500 transform -rotate-12 -z-10" />
                  <Award className="text-white" size={24} />
                </div>
                <span className="text-[9px] uppercase font-bold text-amber-700 mt-2 tracking-widest">
                  SELLO DE EXCELENCIA
                </span>
              </div>

              {/* Right Signature */}
              <div className="flex flex-col items-center">
                <span className="text-sm md:text-base font-serif italic text-blue-700 mb-1" style={{ fontFamily: "'Dancing Script', cursive, serif" }}>
                  Luis Maldonado
                </span>
                <div className="w-24 md:w-36 h-px bg-slate-300 mb-1" />
                <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                  Director EduPlatform
                </span>
              </div>

            </div>

            {/* Footer Metadata */}
            <div className="w-full flex justify-between text-[10px] text-slate-400 mt-4 md:mt-8 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1">
                <Calendar size={12} className="text-slate-400" />
                <span>Emitido el: {currentDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <ShieldCheck size={12} className="text-slate-400" />
                <span>CÓD. VERIFICACIÓN: {certCode}</span>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3 sm:justify-between items-center no-print">
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
            Puedes imprimirlo directamente en papel o guardarlo como PDF seleccionando "Guardar como PDF" en las opciones de tu impresora.
          </p>
          <div className="flex gap-3 w-full sm:w-auto">
            <button 
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-750 font-bold transition-all text-sm"
            >
              Cerrar
            </button>
            <button 
              onClick={handlePrint}
              className="flex-1 sm:flex-none btn-primary py-2.5 px-5 text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              <Printer size={18} />
              <span>Imprimir / Descargar</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
