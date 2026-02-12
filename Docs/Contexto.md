# Documentación del Proyecto: MamenNoticias

## Contexto del Proyecto

**MamenNoticias** es una plataforma web diseñada para el monitoreo y gestión de noticias relevantes sobre la gestión y candidatura de **Mamen Saavedra**. La aplicación automatiza la recolección de noticias desde diversas fuentes (scraping), permitiendo una revisión humana para filtrar y curar el contenido antes de su distribución.

## Funcionalidades Principales

1.  **Scraping y Registro**: Sistema automatizado que rastrea noticias en la web y las registra en una base de datos PostgreSQL mediante Prisma.
2.  **Resúmenes con IA**: Cada noticia incluye un resumen corto generado automáticamente por inteligencia artificial para facilitar una lectura rápida.
3.  **Gestión de Noticias (Dashboard)**:
    - Visualización de noticias extraídas hoy.
    - **Aprobación/Rechazo**: Los usuarios pueden aprobar o rechazar noticias manualmente. Solo las aprobadas forman parte del boletín final.
4.  **Historial y Filtros**:
    - Consulta de noticias de fechas anteriores.
    - Filtros dinámicos por rango de fechas para localizar información específica.
5.  **Generación de PDF**:
    - Creación de boletines informativos en formato PDF con las noticias aprobadas del periodo seleccionado.

---

## Estructura de Componentes Principal

### Componentes de Visualización

- **`NewsSection.jsx`**: Organiza las noticias por categorías (Mamen vs Otros).
- **`NewsCard.jsx`**: Renderiza la tarjeta individual de cada noticia, mostrando imagen, título, resumen de IA y controles de estado.
- **`Footer.jsx`**: Pie de página universal.
- **`Navbar.jsx`**: Barra de navegación superior.

### Componentes de Utilidad y Control

- **`ActionButtons.jsx`**: Botones principales para activar el scraping (webhook) y generar el PDF.
- **`Filters.jsx`**: Interfaz para filtrar noticias por rangos temporales.
- **`LoadingModal.jsx`** / **`PageLoading.jsx`**: Indicadores de carga para procesos largos como el scraping o la generación de PDF.

## Tecnologías Utilizadas

- **Frontend**: Next.js (App Router), Tailwind CSS.
- **Estado y Navegación**: React Hooks (useState, useEffect), Next Navigation.
- **Base de Datos**: Prisma ORM con PostgreSQL.
- **Utilidades**: Lucide-react (iconos), Sonner (notificaciones), jsPDF/AutoTable (generación de PDF).

---

_Este documento fue creado para explicar el propósito y funcionamiento técnico de MamenNoticias._
