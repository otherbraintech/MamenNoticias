# Biblioteca de Componentes UI

Los componentes están diseñados para ser reutilizables y responsivos, facilitando la consistencia visual en toda la aplicación.

## Componentes de Estructura

- **`Navbar.jsx`**: Gestiona la identidad del sitio, navegación principal y el botón de cierre de sesión.
- **`Footer.jsx`**: Muestra información de copyright y enlaces secundarios.
- **`NavbarWrapper.jsx`**: Decide condicionalmente cuándo mostrar el Navbar (se oculta en páginas de autenticación).

## Gestión de Noticias

- **`NewsSection.jsx`**: Un contenedor lógico que agrupa noticias bajo un título y color específico según su categoría.
- **`NewsCard.jsx`**:
  - Muestra la imagen, resumen de IA y origen de la noticia.
  - Incluye botones de acción rápida para cambiar el estado (Aprobar/Rechazar).
  - Implementa manejo de errores de imagen (fallback) para evitar huecos en la UI.

## Herramientas de Control

- **`ActionButtons.jsx`**: Agrupa los botones globales del Dashboard (Scraping, Descargar PDF).
- **`Filters.jsx`**: Formulario estilizado para la selección de rangos de fechas en el historial.
- **`LoadingModal.jsx`**: Modal informativo que bloquea la interacción durante procesos críticos (scraping).
- **`Timer.jsx`**: Visualiza el tiempo transcurrido o restante para ciertas operaciones.

## Estilo y Animaciones

- Se utiliza **Tailwind CSS** para el diseño responsivo.
- Animaciones sutiles (pulse, hover effects) para mejorar la experiencia del usuario (UX) y dar feedback visual sobre acciones realizadas.

---

_Cada componente sigue el principio de responsabilidad única, lo que facilita el mantenimiento y la escalabilidad del sistema._
