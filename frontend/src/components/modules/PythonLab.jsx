import { useState, useEffect } from 'react';
import { Play, Code2, Terminal, CheckCircle2, AlertTriangle, RefreshCw, BookOpen } from 'lucide-react';

const CHALLENGES = [
  {
    id: 1,
    title: '1. ¡Hola, Python!',
    description: 'Escribe un programa que imprima el texto "Hola, Mundo!" en la consola usando la función print().',
    defaultCode: '# Escribe tu código aquí\nprint("Hola, Mundo!")',
    validate: (code, output) => {
      return output.includes('Hola, Mundo!');
    },
    expectedOutput: 'Hola, Mundo!',
    hint: 'Usa exactamente print("Hola, Mundo!")'
  },
  {
    id: 2,
    title: '2. Operaciones Matemáticas',
    description: 'Declara dos variables, a = 10 y b = 5, súmalas e imprime el resultado.',
    defaultCode: '# Declara las variables y calcula la suma\na = 10\nb = 5\nsuma = a + b\nprint(suma)',
    validate: (code, output) => {
      return output.trim() === '15';
    },
    expectedOutput: '15',
    hint: 'Define a=10, b=5 y ejecuta print(a + b)'
  },
  {
    id: 3,
    title: '3. Bucles y Repeticiones',
    description: 'Usa un bucle "for" e "range" para imprimir los números del 1 al 5 uno debajo del otro.',
    defaultCode: '# Escribe un bucle for que imprima de 1 a 5\nfor i in range(1, 6):\n    print(i)',
    validate: (code, output) => {
      const lines = output.trim().split('\n').map(l => l.trim());
      return lines.join(',') === '1,2,3,4,5';
    },
    expectedOutput: '1\n2\n3\n4\n5',
    hint: 'for i in range(1, 6): e imprime la i con indentación'
  },
  {
    id: 4,
    title: '4. Condiciones lógicas',
    description: 'Declara una variable "edad = 18". Si es mayor o igual a 18, imprime "Mayor de edad", de lo contrario imprime "Menor de edad".',
    defaultCode: 'edad = 18\nif edad >= 18:\n    print("Mayor de edad")\nelse:\n    print("Menor de edad")',
    validate: (code, output) => {
      return output.includes('Mayor de edad');
    },
    expectedOutput: 'Mayor de edad',
    hint: 'Usa if edad >= 18: con print("Mayor de edad")'
  }
];

export default function PythonLab() {
  const [activeChallengeIdx, setActiveChallengeIdx] = useState(0);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, success, error
  const [completedChallenges, setCompletedChallenges] = useState([]);

  const challenge = CHALLENGES[activeChallengeIdx];

  // Cargar código por defecto del desafío
  useEffect(() => {
    setCode(challenge.defaultCode);
    setOutput('');
    setStatus('idle');
  }, [activeChallengeIdx]);

  const handleReset = () => {
    setCode(challenge.defaultCode);
    setOutput('');
    setStatus('idle');
  };

  const handleRun = () => {
    setIsRunning(true);
    setStatus('idle');
    setOutput('Iniciando entorno Python virtual...\n');

    setTimeout(() => {
      // Intérprete simple / simulado de Python en Javascript para dar una experiencia de consola real
      let simulatedOutput = '';
      let hasError = false;

      try {
        const cleanedLines = code.split('\n').map(line => line.trim());
        
        // Simular ejecución analizando el código
        if (challenge.id === 1) {
          const match = code.match(/print\s*\(\s*["']([^"']+)["']\s*\)/);
          if (match) {
            simulatedOutput = match[1];
          } else {
            simulatedOutput = 'SyntaxError: invalid syntax. ¿Olvidaste llamar a print() correctamente?';
            hasError = true;
          }
        } else if (challenge.id === 2) {
          // Evaluar variables básicas si existen
          let a = 10, b = 5;
          if (code.includes('a =') || code.includes('b =')) {
            const sumMatch = code.includes('+');
            if (sumMatch && code.includes('print')) {
              simulatedOutput = '15';
            } else {
              simulatedOutput = 'Error: Tu código no suma las variables o no imprime el resultado.';
              hasError = true;
            }
          } else {
            simulatedOutput = 'NameError: name \'a\' is not defined';
            hasError = true;
          }
        } else if (challenge.id === 3) {
          if (code.includes('for') && code.includes('range') && code.includes('print')) {
            simulatedOutput = '1\n2\n3\n4\n5';
          } else {
            simulatedOutput = 'SyntaxError: expected an indented block. Revisa la sintaxis del bucle for.';
            hasError = true;
          }
        } else if (challenge.id === 4) {
          if (code.includes('if') && code.includes('18') && code.includes('print')) {
            simulatedOutput = 'Mayor de edad';
          } else {
            simulatedOutput = 'SyntaxError: invalid syntax. Recuerda poner dos puntos (:) en el if y else.';
            hasError = true;
          }
        }

        if (!simulatedOutput) {
          simulatedOutput = 'Salida de consola vacía. Agrega una instrucción print().';
          hasError = true;
        }

      } catch (err) {
        simulatedOutput = 'SyntaxError: ' + err.message;
        hasError = true;
      }

      setOutput(simulatedOutput);
      setIsRunning(false);

      if (!hasError && challenge.validate(code, simulatedOutput)) {
        setStatus('success');
        if (!completedChallenges.includes(challenge.id)) {
          setCompletedChallenges([...completedChallenges, challenge.id]);
        }
      } else {
        setStatus('error');
      }
    }, 900);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900 text-slate-100 rounded-2xl overflow-hidden border border-slate-800 p-1 md:p-2 shadow-2xl">
      {/* Sidebar de Desafíos */}
      <div className="lg:col-span-4 bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4 text-brand-400">
            <BookOpen size={18} />
            <h4 className="font-bold text-sm uppercase tracking-wider">Desafíos Python</h4>
          </div>
          
          <div className="space-y-2">
            {CHALLENGES.map((ch, idx) => {
              const isActive = activeChallengeIdx === idx;
              const isCompleted = completedChallenges.includes(ch.id);
              
              return (
                <button
                  key={ch.id}
                  onClick={() => setActiveChallengeIdx(idx)}
                  className={`w-full text-left p-3 rounded-lg flex items-center justify-between border transition-all text-xs font-bold ${
                    isActive 
                      ? 'bg-brand-500/10 border-brand-500 text-white' 
                      : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{ch.title}</span>
                  {isCompleted && <CheckCircle2 size={14} className="text-emerald-500" />}
                </button>
              );
            })}
          </div>

          <div className="mt-6 bg-slate-900/60 p-3.5 rounded-lg border border-slate-800/40 text-xs leading-relaxed">
            <span className="font-bold text-slate-200 block mb-1">Misión actual:</span>
            <p className="text-slate-400">{challenge.description}</p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <span className="text-[10px] text-slate-500 font-bold">PROGRESO PRÁCTICO</span>
          <div className="flex items-center gap-2 justify-center mt-1">
            <span className="text-xs font-mono font-bold text-emerald-400">{completedChallenges.length} / {CHALLENGES.length}</span>
            <div className="h-1.5 w-24 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${(completedChallenges.length / CHALLENGES.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Editor e Intérprete */}
      <div className="lg:col-span-8 flex flex-col space-y-4">
        {/* Editor de Código */}
        <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex-1 flex flex-col">
          <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex justify-between items-center text-xs">
            <div className="flex items-center gap-2 text-brand-400 font-bold">
              <Code2 size={16} />
              <span>editor.py</span>
            </div>
            <button 
              onClick={handleReset}
              className="text-slate-500 hover:text-slate-300 flex items-center gap-1 font-bold"
              title="Restablecer plantilla"
            >
              <RefreshCw size={12} />
              <span>Reiniciar</span>
            </button>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-4 bg-slate-950 font-mono text-sm text-emerald-400/90 focus:outline-none resize-none flex-1 min-h-[160px] leading-relaxed"
            style={{ tabSize: 4 }}
            placeholder="# Escribe tu código Python aquí..."
          />
        </div>

        {/* Consola / Terminal de Salida */}
        <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-800 h-44 flex flex-col">
          <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex justify-between items-center text-xs text-slate-400">
            <div className="flex items-center gap-2 font-bold">
              <Terminal size={14} />
              <span>Consola de Salida</span>
            </div>
          </div>
          
          <div className="p-4 flex-1 font-mono text-xs overflow-y-auto whitespace-pre-wrap leading-relaxed select-text">
            {isRunning ? (
              <span className="text-slate-400 animate-pulse">{">>> "}{output}</span>
            ) : output ? (
              <span className={status === 'error' ? 'text-red-400' : 'text-emerald-400'}>{output}</span>
            ) : (
              <span className="text-slate-600">{">>> "}Haz clic en Ejecutar para correr el script.</span>
            )}
          </div>
        </div>

        {/* Barra de Acciones */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-xs">
            {status === 'success' && (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                <CheckCircle2 size={14} /> ¡Reto Superado con éxito!
              </span>
            )}
            {status === 'error' && (
              <span className="text-red-400 font-bold flex items-center gap-1.5 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20">
                <AlertTriangle size={14} /> Revisa la pista: {challenge.hint}
              </span>
            )}
          </div>

          <button
            onClick={handleRun}
            disabled={isRunning}
            className={`w-full sm:w-auto px-6 py-2.5 bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-bold text-sm rounded-xl shadow-lg shadow-brand-500/15 flex items-center justify-center gap-2 transition-all ${
              isRunning ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isRunning ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play size={14} />
            )}
            <span>Ejecutar Código</span>
          </button>
        </div>
      </div>
    </div>
  );
}
