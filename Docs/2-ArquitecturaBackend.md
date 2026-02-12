# Arquitectura Backend y Flujo de Datos

La aplicación utiliza un enfoque híbrido entre la API de Next.js y una herramienta de automatización externa (n8n).

## 1. API Routes (Next.js)

Ubicadas en `src/app/api/`, gestionan la comunicación con la base de datos:

- **`/api/noticias`**:
  - `GET`: Recupera las noticias registradas, formateando las fechas a la zona horaria de Bolivia (`America/La_Paz`).
  - `PUT`: Actualiza el estado de una noticia (`APROBADA`, `RECHAZADA`, `PENDIENTE`).
- **`/api/noticias/historial`**:
  - `GET`: Permite filtrar noticias por rangos de fecha específicos.
- **`/api/articulos-brutos`**:
  - Gestiona el estado de los enlaces recolectados inicialmente.
- **`/api/proxy-image`**:
  - Actúa como intermediario para evitar problemas de CORS al intentar descargar imágenes para el PDF desde dominios externos.

## 2. Integración con n8n (Webhooks)

El proceso de scraping no ocurre dentro de Next.js para evitar sobrecarga y límites de ejecución.

1. La aplicación frontend llama a un webhook externo alojado en **n8n**.
2. n8n ejecuta el flujo de scraping:
   - Visita los periódicos registrados.
   - Extrae contenido nuevo.
   - Genera resúmenes usando IA.
   - Envía los datos de vuelta a la base de datos de la app.

## 3. Lógica de Negocio y Utilidades

- **Manejo de Fechas**: Se utiliza la librería `luxon` para garantizar que todas las marcas de tiempo se manejen correctamente entre el servidor (UTC) y el cliente (Bolivia).
- **Prisma Client**: Se utiliza una instancia única de Prisma (definida en `src/libs/prisma.js`) para optimizar las conexiones a la base de datos PostgreSQL.

---

_El backend está diseñado para ser ligero, delegando las tareas pesadas de scraping e IA a flujos especializados fuera de la aplicación principal._
