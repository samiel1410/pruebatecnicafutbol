# Prueba Técnica de Selección - Quito Highlanders FC
*(Automatización de Validación de Número de Uniforme)*

## 1. CONTEXTO GENERAL
Actualmente, la empresa utiliza un formulario digital para que los representantes de los jugadores seleccionen:
- Nombre que irá en la camiseta
- Número de camiseta
- Otros datos relacionados al uniforme

Existen reglas operativas claras que deben cumplirse respecto al número de camiseta:

### 1.1. Reglas de disponibilidad del número
1. Dentro de una misma sede y una misma categoría, **NO puede repetirse un número**.
   - *Ejemplo*: En la Sede A – Categoría Sub 10 no pueden existir dos jugadores con el número 10.
2. El mismo número **SÍ puede repetirse** si cambia alguno de estos factores:
   - La categoría (aunque sea la misma sede).
     - *Ejemplo*: Sede A – Sub 8 → Número 10 ✔️ | Sede A – Sub 9 → Número 10 ✔️ | Sede A – Sub 10 → Número 10 ✔️
   - La sede (aunque sea la misma categoría).
     - *Ejemplo*: Sede A – Sub 10 → Número 10 ✔️ | Sede B – Sub 10 → Número 10 ✔️

👉 **En resumen:** La combinación `Número` + `Categoría` + `Sede` debe ser única.

Actualmente, esta validación se realiza de forma manual, revisando una base de datos de jugadores ya registrados, lo que genera errores, retrabajo y fricción operativa.

## 2. OBJETIVO DE LA PRUEBA
Diseñar e implementar una solución tecnológica que permita:
- Validar automáticamente, durante el llenado del formulario, si el número ingresado:
  - Está disponible → permitir continuar
  - NO está disponible → impedir continuar

La solución debe comportarse como una validación real de formulario, es decir:
- Si el número no está disponible, el sistema debe:
  - Mostrar un mensaje claro al usuario
  - Indicar que debe escoger otro número
  - No permitir el envío del formulario
- Si el usuario cambia el número:
  - La validación debe ejecutarse nuevamente
  - Repetirse cuantas veces sea necesario
  - Solo permitir avanzar cuando el número cumpla las reglas

## 3. INSUMOS QUE RECIBIRÁS
Se te entregarán dos enlaces:

### 3.1. Formulario de Google (Formulario de Uniformes)
Contiene las preguntas reales utilizadas actualmente. Incluye el campo donde el representante selecciona el número de camiseta. Este es el formulario que deberá ser validado por tu solución.
➤ 🔗 **Ver y descargar formulario de Google**: [https://docs.google.com/forms/d/e/1FAIpQLSeaYcA0jgeEtW9Q0A1LDpUzX0it6jGiI1DwF0oB5iRpU6b4sA/viewform?usp=sharing&ouid=116545108818209684030](https://docs.google.com/forms/d/e/1FAIpQLSeaYcA0jgeEtW9Q0A1LDpUzX0it6jGiI1DwF0oB5iRpU6b4sA/viewform?usp=sharing&ouid=116545108818209684030)

### 3.2. Base de Datos en Google Sheets (Base de Jugadores)
Contiene la información real de jugadores y su estructura actual. Incluye:
- Una hoja principal (matriz general de jugadores).
- Hojas separadas por categoría (Sub 5, Sub 6, Sub 7, etc.).

Estructura relevante de la hoja matriz:
- Código del jugador → Columna C
- Número de camiseta → Columna G
- Categoría → Columna Q
- Sede → Columna U
➤ 🔗 **Ver y descargar base de datos en Google Sheets**: [https://docs.google.com/spreadsheets/d/18f06MXe2253Gwio_J0loZhBv7zjRsLJElcTyPjE6-FI/edit?usp=sharing](https://docs.google.com/spreadsheets/d/18f06MXe2253Gwio_J0loZhBv7zjRsLJElcTyPjE6-FI/edit?usp=sharing)

⚠️ **Nota importante**: No se indicará cómo está implementado actualmente el sistema ni qué enfoque técnico debes utilizar. Se evaluará tu capacidad para analizar, decidir y diseñar la solución más eficiente.

## 4. LO QUE DEBES HACER
1. Analizar el formulario y la base de datos entregada.
2. Identificar correctamente las reglas de validación.
3. Diseñar una solución que:
   - Consulte los datos correctos.
   - Valide la combinación Número + Categoría + Sede.
   - Evite el registro de números no disponibles.
4. Implementar la solución utilizando Google Workspace (Apps Script, validaciones, lógica externa, u otras herramientas que consideres adecuadas).

## 5. CRITERIO CLAVE (MUY IMPORTANTE)
Existen más de un camino técnico posible para resolver este problema, por ejemplo:
- Validar directamente desde la hoja matriz general
- Validar accediendo primero a la pestaña específica de la categoría
- O cualquier otra arquitectura que consideres correcta

👉 **No se evaluará solo que funcione, sino también:**
- El criterio técnico
- La eficiencia del enfoque
- La simplicidad y claridad de la solución
- El uso responsable de recursos
- La cantidad de lógica y pasos necesarios para lograr el resultado

En tu explicación deberás justificar:
- Qué camino elegiste
- Por qué lo consideras el más adecuado
- Qué ventajas tiene frente a otras alternativas posibles

## 6. ENTREGABLES OBLIGATORIOS
Deberás entregar una carpeta principal con el siguiente contenido:

### 6.1. Solución Técnica
Todo lo que hayas creado, por ejemplo:
- Scripts (Apps Script u otros)
- Formularios ajustados o duplicados
- Hojas auxiliares
- Automatizaciones
- Validaciones
- Prototipos funcionales
La solución debe poder entenderse y probarse.

### 6.2. Documento Explicativo (Google Docs)
Un documento donde expliques claramente:
- El problema identificado
- La lógica de la solución
- La arquitectura elegida
- Por qué elegiste ese camino
- Qué valida cada parte del sistema
- Qué ocurre cuando el número no está disponible
- Qué ocurre cuando sí lo está

Además, incluir obligatoriamente:
- ⏱️ Tiempo total aproximado de desarrollo
- ⚠️ Limitaciones actuales
- 🚀 Posibles mejoras futuras
- 🧠 Alternativas técnicas consideradas (aunque no se hayan implementado)

## 7. FORMA DE ENTREGA
- Crear una carpeta en Google Drive
- Compartir el acceso con el correo indicado
- Estructura sugerida:
  - Carpeta: `01_Prueba_Tecnica`
    - Subcarpeta: `01_Solucion_Tecnica`
    - Documento: `Explicacion_Solucion`

## 8. NOTA FINAL
Esta prueba evalúa:
- Capacidad de entender procesos reales
- Lógica estructural
- Criterio técnico
- Eficiencia de diseño
- Capacidad de explicar decisiones
- Uso inteligente (no ciego) de inteligencia artificial

**Quito Highlanders FC**
Departamento de Talento Humano
“Guerreros de las alturas”
