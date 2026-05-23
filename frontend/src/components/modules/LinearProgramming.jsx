
import { useState } from 'react';
import { Play, TrendingUp, Maximize, AlertCircle } from 'lucide-react';

export default function LinearProgramming() {
  const [xVal, setXVal] = useState(5);
  const [yVal, setYVal] = useState(5);
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState(null);

  // Simulated problem: Maximize Z = 3x + 4y
  // Constraints: x + y <= 10; 2x + y <= 15; x, y >= 0

  const handleSolve = () => {
    setCalculating(true);
    setResult(null);
    setTimeout(() => {
      // Logic for generic simple solving visually
      const z = (3 * xVal) + (4 * yVal);
      // check constraints
      const c1 = (xVal + yVal) <= 10;
      const c2 = ((2 * xVal) + yVal) <= 15;
      const valid = c1 && c2;

      setResult({
        z, valid, x: xVal, y: yVal
      });
      setCalculating(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Simulador: Método Gráfico</h3>
        <p className="text-sm text-slate-500 mb-6">Problema: <strong>Maximizar Z = 3X + 4Y</strong><br />Sujeto a: X + Y ≤ 10, 2X + Y ≤ 15, X≥0, Y≥0.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            <div>
              <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <span>Valor de X (Producción A)</span>
                <span className="text-brand-600 font-bold">{xVal} unidades</span>
              </label>
              <input type="range" min="0" max="15" value={xVal} onChange={(e) => setXVal(Number(e.target.value))} className="w-full accent-brand-500" />
            </div>

            <div>
              <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <span>Valor de Y (Producción B)</span>
                <span className="text-brand-600 font-bold">{yVal} unidades</span>
              </label>
              <input type="range" min="0" max="15" value={yVal} onChange={(e) => setYVal(Number(e.target.value))} className="w-full accent-brand-500" />
            </div>

            <button
              onClick={handleSolve}
              disabled={calculating}
              className="w-full btn-primary py-3 flex justify-center items-center gap-2"
            >
              {calculating ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <><Play size={18} /> Evaluar Solución</>
              )}
            </button>
          </div>

          {/* Visualization / Results */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700 flex flex-col justify-center">
            {!result ? (
              <div className="text-center text-slate-400">
                <Maximize size={48} className="mx-auto mb-4 opacity-50" />
                <p>Ajusta las variables y haz clic en Evaluar para ver el impacto en la función objetivo.</p>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 font-medium">Función Objetivo (Z)</span>
                  <span className="text-3xl font-black text-brand-600">${result.z}</span>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Restricciones:</h4>
                  <div className={`flex items-center justify-between p-3 rounded-lg text-sm ${result.x + result.y <= 10 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    <span>Recurso 1 (X + Y ≤ 10)</span>
                    <span className="font-bold">{result.x + result.y} / 10</span>
                  </div>
                  <div className={`flex items-center justify-between p-3 rounded-lg text-sm ${2 * result.x + result.y <= 15 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    <span>Recurso 2 (2X + Y ≤ 15)</span>
                    <span className="font-bold">{2 * result.x + result.y} / 15</span>
                  </div>
                </div>

                {!result.valid && (
                  <div className="flex items-start gap-2 text-sm text-red-600 mt-4 bg-red-50 p-3 rounded-lg">
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <p>Esta combinación es inviable. Supera la capacidad máxima de los recursos.</p>
                  </div>
                )}
                {result.valid && (
                  <div className="flex items-start gap-2 text-sm text-emerald-600 mt-4 bg-emerald-50 p-3 rounded-lg">
                    <TrendingUp size={16} className="mt-0.5 flex-shrink-0" />
                    <p>Esta solución se encuentra dentro de la región factible.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
