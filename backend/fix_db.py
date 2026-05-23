import sqlite3
c = sqlite3.connect('sql_app.db')
cur = c.cursor()
cur.execute("UPDATE cursos SET titulo='Regresion Lineal y Analisis de Datos', descripcion='Aprende a predecir valores y encontrar la linea de mejor ajuste utilizando el metodo de minimos cuadrados.' WHERE id=5")
c.commit()
c.close()
