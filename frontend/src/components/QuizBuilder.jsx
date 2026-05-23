import { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, GripVertical } from 'lucide-react';

export default function QuizBuilder({ value, onChange }) {
  const [quizData, setQuizData] = useState({ descripcion: '', preguntas: [] });

  useEffect(() => {
    try {
      if (value) {
        setQuizData(JSON.parse(value));
      } else {
        setQuizData({ descripcion: '', preguntas: [] });
      }
    } catch (e) {
      setQuizData({ descripcion: '', preguntas: [] });
    }
  }, [value]);

  const updateData = (newData) => {
    setQuizData(newData);
    onChange(JSON.stringify(newData));
  };

  const addQuestion = () => {
    const newQuestions = [...quizData.preguntas, { texto: '', opciones: ['', ''], correcta: 0 }];
    updateData({ ...quizData, preguntas: newQuestions });
  };

  const updateQuestion = (index, field, val) => {
    const newQuestions = [...quizData.preguntas];
    newQuestions[index][field] = val;
    updateData({ ...quizData, preguntas: newQuestions });
  };

  const deleteQuestion = (index) => {
    const newQuestions = quizData.preguntas.filter((_, i) => i !== index);
    updateData({ ...quizData, preguntas: newQuestions });
  };

  const addOption = (qIndex) => {
    const newQuestions = [...quizData.preguntas];
    newQuestions[qIndex].opciones.push('');
    updateData({ ...quizData, preguntas: newQuestions });
  };

  const updateOption = (qIndex, oIndex, val) => {
    const newQuestions = [...quizData.preguntas];
    newQuestions[qIndex].opciones[oIndex] = val;
    updateData({ ...quizData, preguntas: newQuestions });
  };

  const deleteOption = (qIndex, oIndex) => {
    const newQuestions = [...quizData.preguntas];
    if (newQuestions[qIndex].opciones.length > 2) {
      newQuestions[qIndex].opciones = newQuestions[qIndex].opciones.filter((_, i) => i !== oIndex);
      if (newQuestions[qIndex].correcta >= newQuestions[qIndex].opciones.length) {
        newQuestions[qIndex].correcta = 0;
      }
      updateData({ ...quizData, preguntas: newQuestions });
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-6">
      <div>
        <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Instrucciones del Quiz</label>
        <textarea 
          value={quizData.descripcion} 
          onChange={e => updateData({...quizData, descripcion: e.target.value})}
          className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white"
          placeholder="Ej: Responde las siguientes preguntas para evaluar tu conocimiento..."
          rows="2"
        />
      </div>

      <div className="space-y-4">
        {quizData.preguntas.map((q, qIndex) => (
          <div key={qIndex} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm relative">
            <button type="button" onClick={() => deleteQuestion(qIndex)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500">
              <Trash2 size={18} />
            </button>
            <div className="mb-4 pr-8">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pregunta {qIndex + 1}</label>
              <input 
                type="text" 
                value={q.texto} 
                onChange={e => updateQuestion(qIndex, 'texto', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium dark:text-white"
                placeholder="Escribe la pregunta..."
              />
            </div>
            
            <div className="space-y-2 pl-4 border-l-2 border-brand-200 dark:border-brand-900/30">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Opciones (Selecciona la correcta)</label>
              {q.opciones.map((op, oIndex) => (
                <div key={oIndex} className="flex items-center gap-2">
                  <input 
                    type="radio" 
                    name={`correcta-${qIndex}`} 
                    checked={q.correcta === oIndex}
                    onChange={() => updateQuestion(qIndex, 'correcta', oIndex)}
                    className="w-4 h-4 accent-emerald-500"
                    title="Marcar como respuesta correcta"
                  />
                  <input 
                    type="text" 
                    value={op} 
                    onChange={e => updateOption(qIndex, oIndex, e.target.value)}
                    className={`flex-1 px-3 py-1.5 border rounded-lg text-sm dark:text-white transition-colors ${q.correcta === oIndex ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800' : 'bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-700'}`}
                    placeholder={`Opción ${oIndex + 1}`}
                  />
                  <button type="button" onClick={() => deleteOption(qIndex, oIndex)} disabled={q.opciones.length <= 2} className="p-1 text-slate-400 hover:text-red-500 disabled:opacity-30">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addOption(qIndex)} className="text-xs font-bold text-brand-500 hover:text-brand-600 mt-2 flex items-center gap-1">
                <Plus size={14} /> Añadir Opción
              </button>
            </div>
          </div>
        ))}
      </div>

      <button type="button" onClick={addQuestion} className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 hover:text-brand-600 hover:border-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900/10 font-bold flex items-center justify-center gap-2 transition-colors">
        <Plus size={18} /> Añadir Pregunta
      </button>
    </div>
  );
}
