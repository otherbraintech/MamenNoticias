# Propuestas de Mejora para MamenNoticias

Tras revisar la arquitectura actual, se sugieren las siguientes mejoras para elevar la calidad, escalabilidad y experiencia de usuario del proyecto.

## 1. Experiencia de Usuario (UI/UX)

- **Modo Oscuro**: Implementar soporte nativo para `Dark Mode` usando clases de Tailwind. si se usa colores como rojo.. revisa si es muy chillante por ejemplo.. y bajale a mas oscuro el tono.. algo asi. [x]
- **Vistas Previas de PDF**: Mostrar una miniatura dinámica o pre-visualización antes de descargar el archivo. [x]
- **Buscador de Texto**: Añadir una barra de búsqueda en el Dashboard e Historial para filtrar noticias por palabras clave en el título o contenido.

## 2. Funcionalidad y Automatización

- **Edición Rápida**: Permitir editar el `resumen_ia` directamente desde la `NewsCard` antes de generar el PDF, por si se desea hacer ajustes de estilo manuales.
- **Notificaciones Push/Telegram**: Configurar un bot que avise cuando el proceso de scraping ha terminado y hay noticias listas para revisar.
- **Programación de Scraping**: Automatizar el disparo del webhook a horas específicas (ej: 7:00 AM) para que el usuario encuentre las noticias listas al despertar.

## 3. Rendimiento y Seguridad

- **Paginación en Historial**: Actualmente se cargan todas las noticias filtradas. Si el volumen crece mucho, sería ideal implementar scroll infinito o paginación.
- **Optimización de Imágenes**: Utilizar el componente `next/image` con un cargador personalizado para optimizar las imágenes externas que vienen del scraping.
- **Roles de Usuario**: Refinar los permisos para que, por ejemplo, un "Lector" pueda ver noticias pero no aprobarlas ni descargar el PDF.

## 4. Analítica

- **Dashboard de Estadísticas**: Añadir gráficos que muestren el volumen de noticias por día, los medios más frecuentes y el porcentaje de noticias aprobadas/rechazadas.

---

_Estas mejoras permitirían que MamenNoticias evolucione de una herramienta de gestión a un centro de inteligencia de medios completo._
