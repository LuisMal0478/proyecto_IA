import { useState, useEffect } from 'react'
import { Play, RotateCcw, Activity } from 'lucide-react'

export default function GeneticAlgorithms() {
  const [population, setPopulation] = useState([])
  const [generation, setGeneration] = useState(0)
  const [bestFitness, setBestFitness] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  // Simulación súper básica de evolución
  const initializePopulation = () => {
    const pop = Array.from({length: 10}, () => ({
      genes: Array.from({length: 8}, () => Math.round(Math.random())),
      fitness: 0
    }))
    setPopulation(pop)
    setGeneration(0)
    setBestFitness(0)
  }

  useEffect(() => {
    initializePopulation()
  }, [])

  useEffect(() => {
    let interval
    if (isRunning) {
      interval = setInterval(() => {
        evolve()
      }, 500) // cada medio segundo avanza una generación
    }
    return () => clearInterval(interval)
  }, [isRunning, population])

  const evolve = () => {
    // Target ficticio: [1,1,1,1,1,1,1,1]
    const currentPop = [...population]
    
    // Evaluar Fitness
    currentPop.forEach(ind => {
      ind.fitness = ind.genes.reduce((sum, val) => sum + val, 0)
    })
    
    // Encontrar mejor
    const best = Math.max(...currentPop.map(i => i.fitness))
    setBestFitness(best)
    if (best === 8) {
      setIsRunning(false)
      return
    }

    // Seleccionar y Cruzar (muy simplificado)
    const newPop = currentPop.map(ind => {
      // Mutación aleatoria leve si no es perfecto
      const newGenes = ind.genes.map(g => (Math.random() < 0.1 ? (g === 1 ? 0 : 1) : g))
      // Presión evolutiva: forzamos algunos 1s si tienen bajo fitness
      if (ind.fitness < 4) {
        newGenes[Math.floor(Math.random() * 8)] = 1
      }
      return { genes: newGenes, fitness: 0 }
    })

    setPopulation(newPop)
    setGeneration(g => g + 1)
  }

  return (
    <div className="bg-white dark:bg-dark-surface rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Activity className="text-brand-500" /> Simulador de Algoritmo Genético
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">El objetivo de esta simulación es que la población alcance el genoma perfecto [1,1,1,1,1,1,1,1].</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsRunning(!isRunning)} 
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-white transition-colors ${isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-brand-500 hover:bg-brand-600'}`}
          >
            <Play size={18} /> {isRunning ? 'Pausar' : 'Evolucionar'}
          </button>
          <button onClick={initializePopulation} className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <RotateCcw size={18} /> Resetear
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 text-center">
          <p className="text-slate-500 font-semibold mb-1 uppercase tracking-wider text-sm">Generación Actual</p>
          <p className="text-4xl font-black text-slate-800 dark:text-white">{generation}</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 text-center">
          <p className="text-slate-500 font-semibold mb-1 uppercase tracking-wider text-sm">Mejor Fitness</p>
          <p className="text-4xl font-black text-brand-500">{bestFitness} / 8</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 text-center">
          <p className="text-slate-500 font-semibold mb-1 uppercase tracking-wider text-sm">Estado</p>
          <p className={`text-xl font-black mt-2 ${bestFitness === 8 ? 'text-emerald-500' : isRunning ? 'text-amber-500' : 'text-slate-600 dark:text-slate-400'}`}>
            {bestFitness === 8 ? '¡Evolución Completada!' : isRunning ? 'Computando...' : 'En Pausa'}
          </p>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-slate-800 dark:text-white mb-4">Población (10 individuos)</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {population.map((ind, i) => (
            <div key={i} className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-3 rounded-lg justify-center">
              {ind.genes.map((g, gi) => (
                <div key={gi} className={`w-3 h-8 rounded-sm transition-colors duration-300 ${g === 1 ? 'bg-brand-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
