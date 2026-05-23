import { useState, useRef } from 'react';
import { UploadCloud, FileText, Activity, BrainCircuit, CheckCircle } from 'lucide-react';

export default function AILab() {
  const [file, setFile] = useState(null);
  const [dataPreview, setDataPreview] = useState([]);
  const [training, setTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [modelReady, setModelReady] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    setFile(uploadedFile);
    setModelReady(false);
    setProgress(0);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n').slice(0, 4); // Preview first 4 lines
      const parsedData = lines.map(line => line.split(','));
      setDataPreview(parsedData);
    };
    reader.readAsText(uploadedFile);
  };

  const trainModel = () => {
    setTraining(true);
    setProgress(0);
    
    // Simulate training process
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTraining(false);
          setModelReady(true);
          return 100;
        }
        // Random increment between 5 and 15
        return prev + Math.floor(Math.random() * 10) + 5;
      });
    }, 300);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
          <BrainCircuit className="text-brand-500" /> Laboratorio: Entrenamiento de Modelo (Regresión Lineal)
        </h3>
        <p className="text-sm text-slate-500 mb-6">Sube un archivo CSV con tus datos de entrenamiento. El modelo aprenderá la relación entre las columnas.</p>
        
        {!file ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-brand-200 dark:border-brand-900/50 hover:bg-brand-50 dark:hover:bg-brand-900/10 transition-colors rounded-2xl p-12 text-center cursor-pointer flex flex-col items-center justify-center"
          >
            <UploadCloud size={48} className="text-brand-400 mb-4" />
            <p className="font-bold text-slate-700 dark:text-slate-300">Haz clic para subir archivo CSV</p>
            <p className="text-sm text-slate-500 mt-2">Máximo 5MB</p>
            <input type="file" accept=".csv" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {/* File Info */}
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <FileText className="text-brand-500" size={24} />
                <div>
                  <p className="font-bold text-slate-800 dark:text-white">{file.name}</p>
                  <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              <button onClick={() => setFile(null)} className="text-sm text-slate-400 hover:text-red-500">Cambiar archivo</button>
            </div>

            {/* Data Preview */}
            {dataPreview.length > 0 && (
              <div className="overflow-x-auto">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Vista Previa de Datos</p>
                <table className="w-full text-left text-sm border-collapse">
                  <tbody>
                    {dataPreview.map((row, i) => (
                      <tr key={i} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                        {row.map((cell, j) => (
                          <td key={j} className="py-2 px-3 text-slate-600 dark:text-slate-300">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Training Section */}
            {!modelReady ? (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                {!training ? (
                  <button onClick={trainModel} className="w-full btn-primary py-3 flex justify-center items-center gap-2">
                    <Activity size={18} /> Iniciar Entrenamiento
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-brand-600">Entrenando Modelo...</span>
                      <span className="text-slate-500">{progress}%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-500 transition-all duration-300 relative" style={{ width: `${progress}%` }}>
                        <div className="absolute inset-0 bg-white/20" style={{ backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)' }}></div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 text-center mt-2">Ajustando pesos (época {Math.floor(progress/5)}/20)</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex flex-col items-center text-center animate-fade-in">
                <CheckCircle size={48} className="text-emerald-500 mb-4" />
                <h4 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 mb-2">¡Modelo Entrenado con Éxito!</h4>
                <p className="text-emerald-600 dark:text-emerald-300 text-sm">El modelo ha identificado los patrones en los datos con un margen de error (MSE) de 0.042.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
