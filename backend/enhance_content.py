import sqlite3

def enhance_lessons():
    c = sqlite3.connect('sql_app.db')
    cur = c.cursor()

    updates = {
        # Algoritmos Genéticos
        "Introducción a la Evolución": """
            <h1>¿Qué son los Algoritmos Genéticos?</h1>
            <p>Los algoritmos genéticos (AG) son metaheurísticas inspiradas en el proceso de selección natural, que pertenecen a la clase más grande de algoritmos evolutivos (AE). Fueron introducidos por John Holland en los años 70 y se basan en la idea de que "el más fuerte sobrevive".</p>
            <img src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80" alt="Biología" style="border-radius: 8px; margin: 20px 0; max-height: 300px; width: 100%; object-fit: cover;"/>
            <h2>Analogía Biológica</h2>
            <ul>
                <li><strong>Genotipo:</strong> La estructura interna de una solución (el código).</li>
                <li><strong>Fenotipo:</strong> La manifestación física de la solución (el resultado).</li>
                <li><strong>Población:</strong> Un conjunto de posibles soluciones.</li>
            </ul>
            <h2>El Proceso Básico</h2>
            <ol>
                <li><strong>Inicialización:</strong> Se crea una población aleatoria de posibles soluciones (cromosomas).</li>
                <li><strong>Evaluación (Fitness):</strong> Se evalúa qué tan buena es cada solución usando una función matemática.</li>
                <li><strong>Selección:</strong> Las mejores soluciones sobreviven para reproducirse.</li>
                <li><strong>Crossover (Cruce):</strong> Las características de los "padres" se combinan para crear una nueva generación de "hijos".</li>
                <li><strong>Mutación:</strong> Se aplican cambios aleatorios a algunos genes para mantener la diversidad genética y evitar óptimos locales.</li>
            </ol>
            <p>En las próximas lecciones, profundizaremos matemáticamente en cómo se programa cada una de estas fases.</p>
        """,
        "Profundizando en el Cruce (Crossover)": """
            <h2>Mecanismos Avanzados de Cruce</h2>
            <p>El cruce o recombinación es el operador principal en un algoritmo genético. Su objetivo es tomar dos soluciones "padre" y combinarlas con la esperanza de que el "hijo" herede las mejores características de ambos.</p>
            <h3>Tipos de Cruce:</h3>
            <ul>
                <li><strong>Cruce de un punto (Single-Point):</strong> Se selecciona un punto aleatorio en el cromosoma. Todo lo que está a la derecha del punto se intercambia entre los padres. Es simple y rápido.</li>
                <li><strong>Cruce de múltiples puntos:</strong> Similar al anterior, pero se eligen dos o más puntos, dividiendo el cromosoma en varios segmentos que se alternan.</li>
                <li><strong>Cruce Uniforme:</strong> En lugar de segmentos, se evalúa gen por gen. Hay un 50% de probabilidad (o una tasa configurada) de heredar el gen del Padre 1 o del Padre 2. Mantiene una alta diversidad genética.</li>
            </ul>
            <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #3b82f6; margin-top: 20px; border-radius: 4px;">
                <strong>Nota del Instructor:</strong> La elección del método de cruce depende enteramente de la naturaleza del problema. En problemas de ruteo, el cruce de un punto a menudo genera soluciones inválidas, por lo que se requieren operadores especializados como el Cruce de Orden (OX).
            </div>
        """,
        "Optimización de Rutas": """
            <h2>El Problema del Vendedor Viajero (TSP)</h2>
            <p>Imagina que tienes una flota de camiones de reparto que deben visitar 50 ciudades y volver a su punto de origen. ¿Cuál es la ruta más corta?</p>
            <p>Este es el clásico <em>Traveling Salesman Problem</em>. Matemáticamente, encontrar la ruta óptima probando todas las combinaciones posibles es inviable. ¡Para 50 ciudades existen más combinaciones que átomos en el universo observable!</p>
            <h3>¿Cómo lo resuelve un Algoritmo Genético?</h3>
            <p>En lugar de buscar la solución perfecta probando todo, el AG crea 1000 rutas aleatorias (Población). Evalúa la distancia total de cada ruta (Fitness). Las rutas más cortas se cruzan entre sí para la siguiente generación.</p>
            <p>Tras unas pocas miles de generaciones (segundos en una computadora moderna), el algoritmo encontrará una ruta extraordinariamente eficiente, ahorrando tiempo y combustible en el mundo real.</p>
        """,

        # Regresión Lineal
        "Mínimos Cuadrados Ordinarios": """
            <h2>Mínimos Cuadrados Ordinarios (MCO)</h2>
            <p>El método de Mínimos Cuadrados Ordinarios es el motor matemático detrás de la regresión lineal. Su objetivo es trazar la "línea de mejor ajuste" a través de un conjunto de datos dispersos.</p>
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" alt="Gráfica de datos" style="border-radius: 8px; margin: 20px 0; max-height: 300px; width: 100%; object-fit: cover;"/>
            <h3>La Matemática (Simplificada)</h3>
            <p>Dada la ecuación de la recta <code>Y = mX + b</code>, queremos encontrar los valores óptimos para <strong>m (pendiente)</strong> y <strong>b (intersección)</strong>.</p>
            <p>Para lograrlo, el método calcula el "Error" (la distancia vertical entre cada punto de datos real y la línea predicha), eleva ese error al cuadrado (para evitar que los errores negativos y positivos se cancelen entre sí) y busca minimizar la suma total de esos cuadrados.</p>
            <div style="background-color: #f0fdf4; padding: 15px; border-left: 4px solid #22c55e; margin-top: 20px; border-radius: 4px; color: #166534;">
                <strong>Concepto Clave:</strong> Al elevar al cuadrado, penalizamos exponencialmente a la línea si se aleja mucho de un solo punto. Esto asegura que la línea se mantenga lo más centrada posible en la nube de datos.
            </div>
        """,
        "Interpretación del R-Cuadrado (R2)": """
            <h2>Entendiendo el Coeficiente de Determinación (R²)</h2>
            <p>Una vez que hemos trazado nuestra línea de regresión, la pregunta inevitable es: <em>¿Qué tan bueno es este modelo?</em> Aquí es donde entra el R².</p>
            <h3>Escala de Valores</h3>
            <ul>
                <li><strong>R² = 1.0 (100%):</strong> Ajuste perfecto. La línea pasa exactamente por todos y cada uno de los puntos. En el mundo real, esto casi nunca ocurre.</li>
                <li><strong>R² = 0.85 (85%):</strong> Un ajuste excelente. Significa que el 85% de la variabilidad de tus datos se explica por el modelo.</li>
                <li><strong>R² = 0.20 (20%):</strong> Un ajuste pobre. Los datos están muy dispersos y la línea no es una buena herramienta para hacer predicciones.</li>
            </ul>
            <p><strong>Cuidado con el Sobreajuste (Overfitting):</strong> Un R² demasiado alto en datos de entrenamiento puede significar que el modelo memorizó el ruido en lugar de aprender el patrón subyacente.</p>
        """,

        # Machine Learning
        "Algoritmos no supervisados": """
            <h2>El Aprendizaje No Supervisado</h2>
            <p>A diferencia del aprendizaje supervisado, aquí no tenemos etiquetas ni respuestas correctas. Le damos a la IA un montón de datos crudos y le pedimos: <em>"Encuentra patrones ocultos".</em></p>
            <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80" alt="IA Concepto" style="border-radius: 8px; margin: 20px 0; max-height: 300px; width: 100%; object-fit: cover;"/>
            <h3>Algoritmos Principales</h3>
            <ul>
                <li><strong>K-Means Clustering:</strong> Agrupa los datos en 'K' grupos distintos. Ideal para segmentación de clientes en marketing (ej. agrupar compradores por hábitos de gasto sin saber de antemano quiénes son).</li>
                <li><strong>Análisis de Componentes Principales (PCA):</strong> Reduce la dimensionalidad de los datos. Si tienes 100 variables, el PCA extrae las 3 o 4 variables subyacentes que realmente importan, facilitando la visualización y ahorrando poder de cómputo.</li>
            </ul>
            <p>Esta rama de la IA es fundamental para el descubrimiento de anomalías, como la detección de fraudes bancarios en tiempo real.</p>
        """,
        "El Perceptrón": """
            <h2>El Perceptrón: La Neurona Artificial</h2>
            <p>El perceptrón es el bloque de construcción fundamental de las Redes Neuronales y del Deep Learning. Fue inspirado directamente por la neurona biológica humana.</p>
            <h3>¿Cómo funciona?</h3>
            <ol>
                <li><strong>Entradas (Inputs):</strong> Recibe señales de entrada (datos).</li>
                <li><strong>Pesos (Weights):</strong> A cada entrada se le asigna un "peso" que determina su importancia.</li>
                <li><strong>Suma Ponderada:</strong> Multiplica cada entrada por su peso y las suma todas. Luego añade un "Sesgo" (Bias) para ajustar la sensibilidad.</li>
                <li><strong>Función de Activación:</strong> La suma pasa por una barrera matemática (como la función Escalón, Sigmoide o ReLU). Si la suma supera cierto umbral, la neurona "se dispara" (emite una señal).</li>
            </ol>
            <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #8b5cf6; margin-top: 20px; border-radius: 4px;">
                <strong>Dato Curioso:</strong> Un solo perceptrón solo puede resolver problemas lineales. Pero cuando conectas miles de ellos en múltiples capas (Capas Ocultas), obtienes una Red Neuronal Profunda capaz de reconocer rostros, traducir idiomas o conducir autos.
            </div>
        """
    }

    for title, content in updates.items():
        cur.execute("UPDATE lecciones SET contenido=? WHERE titulo=?", (content, title))

    c.commit()
    c.close()
    print("Contenido enriquecido exitosamente con imagenes y textos profesionales.")

if __name__ == "__main__":
    enhance_lessons()
