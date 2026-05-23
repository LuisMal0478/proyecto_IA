import sqlite3

def fix_intro():
    c = sqlite3.connect('sql_app.db')
    cur = c.cursor()
    
    # Buscamos el curso de algoritmos
    cur.execute("SELECT id FROM cursos WHERE titulo LIKE '%Genético%'")
    res = cur.fetchone()
    if res:
        course_id = res[0]
        # Buscamos el modulo 1
        cur.execute("SELECT id FROM modulos WHERE curso_id=? AND orden=1", (course_id,))
        mod_res = cur.fetchone()
        if mod_res:
            mod_id = mod_res[0]
            # Buscamos la lección "Introducción a la Evolución"
            cur.execute("SELECT id FROM lecciones WHERE modulo_id=? AND titulo LIKE '%Introducción%'", (mod_id,))
            lec_res = cur.fetchone()
            if lec_res:
                lec_id = lec_res[0]
                
                texto_completo = """
                <h1>¿Qué son los Algoritmos Genéticos?</h1>
                <p>Los algoritmos genéticos son metaheurísticas inspiradas en el proceso de selección natural, que pertenecen a las clases más grandes de algoritmos evolutivos.</p>
                <p>Se utilizan comúnmente para generar soluciones de alta calidad a problemas de optimización y búsqueda al depender de operadores de inspiración biológica como la <strong>mutación</strong>, el <strong>cruce</strong> y la <strong>selección</strong>.</p>
                <h2>El Proceso Básico</h2>
                <ol>
                    <li><strong>Inicialización:</strong> Se crea una población aleatoria de posibles soluciones (cromosomas).</li>
                    <li><strong>Evaluación (Fitness):</strong> Se evalúa qué tan buena es cada solución usando una función matemática.</li>
                    <li><strong>Selección:</strong> Las mejores soluciones sobreviven para reproducirse.</li>
                    <li><strong>Crossover (Cruce):</strong> Las características de los "padres" se combinan para crear una nueva generación de "hijos".</li>
                    <li><strong>Mutación:</strong> Se aplican cambios aleatorios a algunos genes para mantener la diversidad genética y evitar óptimos locales.</li>
                </ol>
                <p>¡Prepárate para aprender cómo programar tu propio proceso evolutivo en los siguientes módulos!</p>
                """
                cur.execute("UPDATE lecciones SET contenido=? WHERE id=?", (texto_completo, lec_id))
                c.commit()
                print("Introduccion arreglada exitosamente.")

if __name__ == "__main__":
    fix_intro()
