import { useState, useMemo } from 'react';
import { Activity, Target, AlertCircle } from 'lucide-react';

export default function LinearRegression() {
  const [m, setM] = useState(1);
  const [b, setB] = useState(0);

  // Simulated dataset (X, Y)
  const dataPoints = [
    { x: 1, y: 3 },
    { x: 2, y: 5 },
    { x: 3, y: 7 },
    { x: 4, y: 10 },
    { x: 5, y: 11 },
    { x: 6, y: 14 },
    { x: 7, y: 15 }
  ];

  const calculateMSE = () => {
    let error = 0;
    dataPoints.forEach(point => {
      const predictedY = (m * point.x) + b;
      error += Math.pow(predictedY - point.y, 2);
    });
    return (error / dataPoints.length).toFixed(2);
  };

  const mse = calculateMSE();
  const isOptimal = mse < 1.0;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Simulador: Regresión Lineal</h3>
        <p className="text-sm text-slate-500 mb-6">Ajusta la pendiente (m) y la intersección (b) para encontrar la línea de mejor ajuste que minimice el Error Cuadrático Medio (MSE).</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Controles */}
          <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <h4 className="text-center font-mono text-xl font-bold text-brand-600 mb-4">
                y = {m}x {b >= 0 ? '+' : ''} {b}
              </h4>
              
              <div className="space-y-6">
                <div>
                  <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    <span>Pendiente (m)</span>
                    <span className="font-bold">{m}</span>
                  </label>
                  <input type="range" min="-5" max="5" step="0.1" value={m} onChange={(e) => setM(Number(e.target.value))} className="w-full accent-brand-500" />
                </div>
                
                <div>
                  <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    <span>Intersección (b)</span>
                    <span className="font-bold">{b}</span>
                  </label>
                  <input type="range" min="-10" max="10" step="0.5" value={b} onChange={(e) => setB(Number(e.target.value))} className="w-full accent-brand-500" />
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl flex items-center justify-between border ${isOptimal ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800' : 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800'}`}>
              <div className="flex items-center gap-3">
                {isOptimal ? <Target className="text-emerald-500" /> : <Activity className="text-amber-500" />}
                <div>
                  <p className={`text-sm font-bold ${isOptimal ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>Error (MSE)</p>
                  <p className="text-xs text-slate-500">{isOptimal ? '¡Ajuste óptimo!' : 'Intenta reducir el error a menos de 1.0'}</p>
                </div>
              </div>
              <span className={`text-2xl font-black ${isOptimal ? 'text-emerald-600' : 'text-amber-600'}`}>
                {mse}
              </span>
            </div>
          </div>

          {/* Visualización Visual Simplificada */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700 relative h-64 flex items-end">
            <div className="absolute inset-0 p-6 flex items-end">
              {/* Ejes */}
              <div className="absolute left-6 bottom-6 top-6 w-px bg-slate-300 dark:bg-slate-700"></div>
              <div className="absolute left-6 bottom-6 right-6 h-px bg-slate-300 dark:bg-slate-700"></div>
              
              {/* Puntos (escalados para visualización, max Y ~ 20, max X ~ 10) */}
              {dataPoints.map((pt, i) => {
                const leftPos = (pt.x / 10) * 100;
                const botPos = (pt.y / 20) * 100;
                return (
                  <div key={i} className="absolute w-3 h-3 bg-slate-800 dark:bg-white rounded-full -ml-1.5 -mb-1.5" style={{ left: `${leftPos}%`, bottom: `${botPos}%` }}></div>
                );
              })}

              {/* Línea de regresión (calculando dos puntos extremos) */}
              <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
                 {/* 
                   x = 0 -> left = 0%, bottom = (m(0)+b)/20 * 100%
                   x = 10 -> left = 100%, bottom = (m(10)+b)/20 * 100%
                   SVG y is inverted, so y1 = 100% - bottom%
                 */}
                 <line 
                   x1="0%" 
                   y1={`${100 - ((b)/20 * 100)}%`} 
                   x2="100%" 
                   y2={`${100 - (((m * 10) + b)/20 * 100)}%`} 
                   stroke="#3b82f6" 
                   strokeWidth="3"
                   strokeDasharray="5,5"
                 />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
