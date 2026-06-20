export const documentacionHTML = `
<h1>Documento Explicativo &mdash; Soluci&oacute;n de Validaci&oacute;n de N&uacute;mero de Uniforme</h1>
<h2>Quito Highlanders FC</h2>
<hr>

<h2>1. Problema Identificado</h2>
<p>Actualmente, el proceso de registro de uniformes se realiza mediante un formulario de Google Forms. Cuando un representante ingresa el n&uacute;mero de camiseta, <strong>no existe una validaci&oacute;n autom&aacute;tica</strong> que verifique si ese n&uacute;mero ya est&aacute; ocupado. La validaci&oacute;n se hace manualmente contra una base de datos, lo que genera:</p>
<ul>
<li><strong>Errores humanos</strong>: se registran n&uacute;meros duplicados.</li>
<li><strong>Retrabajo</strong>: hay que contactar al representante, corregir el pedido y reprocesar.</li>
<li><strong>Fricci&oacute;n operativa</strong>: el departamento de talento humano pierde tiempo validando manualmente.</li>
<li><strong>Mala experiencia</strong>: el representante se entera despu&eacute;s de que el n&uacute;mero no estaba disponible.</li>
</ul>
<p><strong>Regla de negocio</strong>: la combinaci&oacute;n <code>N&uacute;mero de camiseta</code> + <code>Categor&iacute;a</code> + <code>Sede</code> debe ser &uacute;nica. Un n&uacute;mero puede repetirse si cambia la categor&iacute;a o la sede.</p>
<hr>

<h2>2. L&oacute;gica de la Soluci&oacute;n</h2>
<p>La soluci&oacute;n implementa una <strong>validaci&oacute;n en tiempo real</strong> en el frontend que verifica la disponibilidad mientras el usuario escribe o selecciona las opciones.</p>

<h3>Flujo de validaci&oacute;n</h3>
<pre>Usuario ingresa Categor&iacute;a, Sede y N&uacute;mero
         &darr;
&iquest;Est&aacute;n los tres campos completos?
  No  &rarr; Mensaje de advertencia o estado neutro
  S&iacute;  &rarr; Se dispara la funci&oacute;n de validaci&oacute;n (simulando latencia de red)
         &darr;
Consulta a la Base de Datos (Mock):
  - Verifica si existe un jugador activo con el mismo n&uacute;mero, categor&iacute;a y sede.
         &darr;
&iquest;Encontr&oacute; coincidencia?
  S&iacute;  &rarr; "N&uacute;mero no disponible &mdash; lo tiene: [Nombre]" (Bloquea env&iacute;o)
  No  &rarr; "N&uacute;mero disponible" (Permite env&iacute;o)</pre>

<h3>Validaciones adicionales</h3>
<ul>
<li><strong>Campos obligatorios</strong>: evaluados visualmente y al intentar enviar.</li>
<li><strong>Feedback as&iacute;ncrono</strong>: muestra un spinner simulando la consulta.</li>
<li><strong>Prevenci&oacute;n de env&iacute;o</strong>: el bot&oacute;n de env&iacute;o se deshabilita hasta que el n&uacute;mero sea v&aacute;lido.</li>
</ul>
<hr>

<h2>3. Arquitectura Elegida</h2>

<h3>Componentes del sistema</h3>
<table class="table table-bordered">
<thead><tr><th>Componente</th><th>Tecnología</th><th>Responsabilidad</th></tr></thead>
<tbody>
<tr><td><strong>Aplicación Web (SPA)</strong></td><td>React JS (Vite)</td><td>Gestión del estado complejo, renderizado dinámico, validaciones y UX fluida.</td></tr>
<tr><td><strong>Backend Ligero (API)</strong></td><td>PHP puro</td><td>Habilitar comunicación CORS segura y proveer los endpoints GET y POST.</td></tr>
<tr><td><strong>Base de Datos Dinámica</strong></td><td>JSON File</td><td>Persistir en tiempo real los registros guardados mediante el backend PHP, reemplazando los mocks estáticos.</td></tr>
<tr><td><strong>Notificaciones</strong></td><td>API WhatsApp (Externa)</td><td>Enviar automáticamente vía POST los resúmenes de pedidos al número del representante o al club.</td></tr>
</tbody>
</table>

<h3>Diagrama de arquitectura</h3>
<pre>
NAVEGADOR (Cliente React)
  FormPage (Validación y UX) &harr; useJugadores (Custom Hook Asíncrono)
        &darr; (POST WhatsApp)             &darr; (Fetch API GET/POST)
   easysplus.com (WhatsApp)        api.php (Backend Local)
                                         &darr;
                                 jugadores.json (Persistencia)
</pre>
<hr>

<h2>4. &iquest;Por qu&eacute; esta arquitectura?</h2>

<h3>Alternativas consideradas</h3>
<table class="table table-bordered">
<thead><tr><th>Alternativa</th><th>Ventajas</th><th>Desventajas</th><th>Decisi&oacute;n</th></tr></thead>
<tbody>
<tr><td>Google Forms nativo</td><td>F&aacute;cil implementaci&oacute;n</td><td>No permite validaci&oacute;n en tiempo real contra BD.</td><td>Descartada</td></tr>
<tr><td>Google Apps Script (Web App)</td><td>Gratis y se conecta directo a Sheets</td><td>Desarrollo UI m&aacute;s r&iacute;gido, UX menos fluida.</td><td>Descartada</td></tr>
<tr><td><strong>React JS (Custom App)</strong></td><td>UX Premium, m&aacute;xima flexibilidad, escalable</td><td>Requiere hosting independiente (Vercel/Netlify)</td><td><strong>Elegida</strong></td></tr>
</tbody>
</table>

<h3>Razones de la elección</h3>
<ol>
<li><strong>Experiencia de Usuario (UX)</strong>: React permite validaciones ultra rápidas, estados de carga elegantes y un diseño profesional que Forms no ofrece.</li>
<li><strong>Arquitectura Escalable</strong>: El sistema ya no es estático; el formulario ahora lee y escribe de forma asíncrona mediante un API (<code>api.php</code>) a un archivo de persistencia real (<code>jugadores.json</code>).</li>
<li><strong>Automatización Inmediata</strong>: Se integró una llamada POST a una API externa de WhatsApp (<code>whatsappnotif.easysplus.com</code>) para notificación inmediata, cerrando el ciclo del proceso.</li>
</ol>
<hr>

<h2>5. Tiempo de desarrollo</h2>
<table class="table table-bordered">
<thead><tr><th>Actividad</th><th>Tiempo</th></tr></thead>
<tbody>
<tr><td>An&aacute;lisis del problema y reglas</td><td>30 min</td></tr>
<tr><td>Dise&ntilde;o UI / UX y arquitectura</td><td>45 min</td></tr>
<tr><td>Desarrollo Frontend React (Componentes)</td><td>2 h</td></tr>
<tr><td>L&oacute;gica de validaci&oacute;n y Mock Data</td><td>1 h</td></tr>
<tr><td>Documentaci&oacute;n y refactorizaci&oacute;n</td><td>1 h</td></tr>
<tr><td><strong>Total</strong></td><td><strong>~5 horas 15 min</strong></td></tr>
</tbody>
</table>
<hr>

<h2>6. Limitaciones actuales</h2>
<ol>
<li><strong>Persistencia Basada en Archivos</strong>: Se usa un archivo <code>jugadores.json</code> para base de datos. Para gran volumen de datos concurrentes, debería migrarse a una base SQL (ej. MySQL/Laravel).</li>
<li><strong>Seguridad del Backend</strong>: El archivo <code>api.php</code> actual acepta tráfico CORS libre (Access-Control-Allow-Origin: *) para facilitar el demo en desarrollo con Vite. En producción requeriría restricción por dominio.</li>
</ol>
<hr>

<h2>7. Mejoras futuras</h2>
<ol>
<li><strong>Integración a Google Sheets Nativo</strong>: Si la empresa desea mantener el Google Sheets original, se puede reemplazar el endpoint de <code>api.php</code> por una llamada directa a un Web App de Google Apps Script.</li>
<li><strong>Autenticación y Panel de Admin</strong>: Crear un dashboard cerrado para que el departamento de Talento Humano apruebe o rechace pedidos sin tocar la base de datos cruda.</li>
</ol>
<hr>

<h2>8. Conclusi&oacute;n</h2>
<p>La soluci&oacute;n implementada mediante <strong>React JS</strong> demuestra c&oacute;mo elevar la experiencia del usuario superando las limitaciones t&eacute;cnicas de los formularios tradicionales. La validaci&oacute;n din&aacute;mica en tiempo real garantiza que la regla de negocio (N&uacute;mero + Categor&iacute;a + Sede = &Uacute;nico) se cumpla estrictamente <em>antes</em> de enviar la informaci&oacute;n, eliminando el retrabajo operativo y brindando una soluci&oacute;n moderna, escalable y eficiente.</p>
`
