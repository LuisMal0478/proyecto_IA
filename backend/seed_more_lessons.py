import sqlite3

def add_more_lessons():
    c = sqlite3.connect('sql_app.db')
    cur = c.cursor()
    
    # Helpers
    def get_course_id(name_fragment):
        cur.execute("SELECT id FROM cursos WHERE titulo LIKE ?", ('%' + name_fragment + '%',))
        res = cur.fetchone()
        return res[0] if res else None

    def get_module_id(course_id, order):
        cur.execute("SELECT id FROM modulos WHERE curso_id = ? AND orden = ?", (course_id, order))
        res = cur.fetchone()
        return res[0] if res else None

    def insert_module(course_id, titulo, desc, orden):
        cur.execute("INSERT INTO modulos (curso_id, titulo, descripcion, orden) VALUES (?, ?, ?, ?)", (course_id, titulo, desc, orden))
        return cur.lastrowid

    def insert_lesson(mod_id, tipo, titulo, contenido, orden):
        cur.execute("INSERT INTO lecciones (modulo_id, tipo, titulo, contenido, orden) VALUES (?, ?, ?, ?, ?)", (mod_id, tipo, titulo, contenido, orden))

    # --- ALGORITMOS GENETICOS ---
    c_gen = get_course_id('Genéticos')
    if c_gen:
        m1_gen = get_module_id(c_gen, 1)
        m2_gen = get_module_id(c_gen, 2)
        if m1_gen:
            insert_lesson(m1_gen, 'text', 'Glosario de Términos', '<h1>Conceptos Clave</h1><ul><li><strong>Gen:</strong> Una unidad de información.</li><li><strong>Cromosoma:</strong> Conjunto de genes que representan una posible solución.</li><li><strong>Población:</strong> Conjunto de cromosomas.</li></ul>', 2)
            insert_lesson(m1_gen, 'quiz', 'Quiz: Fundamentos', '', 3)
        if m2_gen:
            insert_lesson(m2_gen, 'text', 'Profundizando en el Cruce (Crossover)', '<h2>Métodos de Cruce</h2><p>El cruce en un punto intercambia segmentos de dos padres a partir de un punto aleatorio. El cruce uniforme decide gen por gen qué padre hereda.</p>', 2)
            insert_lesson(m2_gen, 'text', 'El rol de la Mutación', '<p>Sin mutación, un algoritmo genético puede quedarse estancado en un óptimo local. La mutación introduce diversidad aleatoria.</p>', 3)
        
        m4_gen = insert_module(c_gen, 'Aplicaciones Reales', 'Casos de uso en la industria.', 4)
        insert_lesson(m4_gen, 'text', 'Optimización de Rutas', '<p>Empresas de logística usan AG para resolver el problema del vendedor viajero (TSP), ahorrando millones en combustible.</p>', 1)
        insert_lesson(m4_gen, 'video', 'Video: AG en Robótica', 'https://www.youtube.com/embed/XPZqD4_yH6I', 2)

    # --- REGRESION LINEAL ---
    c_reg = get_course_id('Regresion Lineal')
    if c_reg:
        m1_reg = get_module_id(c_reg, 1)
        m2_reg = get_module_id(c_reg, 2)
        if m1_reg:
            insert_lesson(m1_reg, 'text', 'Mínimos Cuadrados Ordinarios', '<h2>MCO (OLS)</h2><p>Es un método para estimar los parámetros desconocidos en un modelo de regresión lineal. Se minimiza la suma de las distancias verticales al cuadrado entre los valores observados y los valores pronosticados.</p>', 2)
            insert_lesson(m1_reg, 'quiz', 'Quiz: Matemáticas Básicas', '', 3)
        if m2_reg:
            insert_lesson(m2_reg, 'text', 'Interpretación del R-Cuadrado (R2)', '<p>El R² es una medida estadística de qué tan cerca están los datos de la línea de regresión ajustada. Varía entre 0 y 1.</p>', 2)

        m4_reg = insert_module(c_reg, 'Regresión Múltiple', 'Cuando hay más de una variable independiente.', 4)
        insert_lesson(m4_reg, 'text', 'Concepto de Variables Múltiples', '<p>En la vida real, un resultado depende de múltiples factores. La regresión lineal múltiple usa la fórmula Y = m1x1 + m2x2 ... + b.</p>', 1)
        insert_lesson(m4_reg, 'quiz', 'Evaluación Final', '', 2)

    # --- MACHINE LEARNING ---
    c_ml = get_course_id('Machine Learning')
    if c_ml:
        m1_ml = get_module_id(c_ml, 1)
        m2_ml = get_module_id(c_ml, 2)
        if m1_ml:
            insert_lesson(m1_ml, 'video', 'Historia de la IA', 'https://www.youtube.com/embed/kWmX3pd1f10', 2)
            insert_lesson(m1_ml, 'text', 'Algoritmos no supervisados', '<h2>Clustering</h2><p>El aprendizaje no supervisado busca encontrar estructuras ocultas en datos no etiquetados (ej. agrupar clientes por comportamiento).</p>', 3)
        if m2_ml:
            insert_lesson(m2_ml, 'text', 'El Perceptrón', '<p>La unidad básica de una red neuronal es el perceptrón. Recibe entradas, aplica pesos, suma un sesgo y pasa el resultado por una función de activación.</p>', 2)
            insert_lesson(m2_ml, 'video', 'Entendiendo el Deep Learning', 'https://www.youtube.com/embed/aircAruvnKk', 3)
        
        m4_ml = insert_module(c_ml, 'Ética en la IA', 'Sesgos y responsabilidad.', 4)
        insert_lesson(m4_ml, 'text', 'Sesgos en los Datos', '<p>Si entrenamos a una IA con datos que contienen prejuicios humanos, la IA aprenderá y amplificará esos prejuicios.</p>', 1)
        insert_lesson(m4_ml, 'quiz', 'Reflexión Ética', '', 2)

    c.commit()
    c.close()
    print("Mas lecciones agregadas correctamente.")

if __name__ == "__main__":
    add_more_lessons()
