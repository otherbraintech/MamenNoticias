# Frontend: Páginas y Lógica de Estado

La interfaz de usuario está construida con **Next.js 13+ (App Router)** y **Tailwind CSS**, enfocada en la velocidad y la facilidad de gestión.

## Páginas Principales (`src/app/`)

### 1. Landing Page (`/`)

- Punto de entrada que verifica si el usuario está autenticado.
- Redirige al Dashboard o al formulario de Login.

### 2. Dashboard (`/dashboard`)

- **Panel de Control Diario**: Muestra las noticias extraídas en el día actual.
- **Acciones**: Botón para iniciar scraping (Webhook), botón para generar PDF y accesos rápidos al historial.
- **Categorización**: Separa las noticias en secciones dinámicas para facilitar la revisión.

### 3. Historial (`/historial`)

- **Consulta Retroactiva**: Permite ver noticias de cualquier fecha anterior mediante un selector de rango.
- **Revisión**: Permite cambiar estados de noticias pasadas si es necesario.
- **Botón de retorno**: Facilita la navegación de vuelta al Dashboard.

### 4. Autenticación (`/auth/login`)

- Formulario de acceso seguro mediante `next-auth`.

## Hooks Personalizados (`src/hooks/`)

### `useNews.jsx`

- Encabeza la lógica de obtención de datos.
- Maneja el estado optimista al aprobar/rechazar noticias (la UI se actualiza inmediatamente mientras se envía la petición al servidor).
- Controla el temporizador de recarga y el estado de la conexión con el webhook de scraping.

### `usePDFGenerator.jsx`

- Contiene toda la lógica para construir el boletín informativo.
- Filtra solo las noticias aprobadas.
- Utiliza `jsPDF` para layout y `jspdf-autotable` para organizar el contenido.
- Maneja la conversión de imágenes a Base64 mediante un proxy interno.

---

_El frontend separa estrictamente la visualización de la lógica compleja, delegando el manejo de datos a los hooks personalizados._
