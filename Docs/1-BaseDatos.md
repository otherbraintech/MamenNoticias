# Estructura de la Base de Datos

El proyecto utiliza **Prisma ORM** con una base de datos **PostgreSQL**. A continuación se detallan los modelos y enums definidos en `schema.prisma`.

## Modelos Principal

### 1. `News` (Noticias)

Es el modelo central donde se almacenan las noticias procesadas y filtradas.

- **`id`**: Identificador único.
- **`titulo`**: Título de la noticia.
- **`autor`** (Opcional): Autor de la nota.
- **`fecha_publicacion`**: Fecha original de la noticia.
- **`imagen`**: URL de la imagen principal.
- **`resumen`**: Texto breve de la noticia.
- **`contenido`**: Cuerpo completo de la noticia.
- **`fuente`**: Sitio web de origen.
- **`url`**: Enlace directo a la fuente.
- **`resumen_ia`**: Resumen generado mediante inteligencia artificial.
- **`estado`**: Estado actual de la noticia (Valor por defecto: `PENDIENTE`).
- **`categoria`**: Clasificación (ej: `MAMEN`, `OTROS`).
- **`created_at`**: Fecha y hora de registro en el sistema.

### 2. `ArticuloBruto`

Se utiliza para el rastreo inicial antes del procesamiento completo. Evita duplicados mediante la URL única.

- **`url`**: Enlace único del artículo detectado.
- **`estado`**: Fase de procesamiento (`SIN_TRABAJAR`, `EN_PROCESO`, `PROCESADO`, `DESCARTADO`).

### 3. `Periodicos` (Medios Digitales)

Catálogo de fuentes de noticias que el sistema debe monitorear.

- **`name`**: Nombre del medio informativo.
- **`web_principal`**: Dominio principal.
- **`url`**: Enlace específico (ej: RSS o sección de noticias).

### 4. `User` (Usuarios)

Gestión de acceso a la plataforma.

- **`username`**, **`email`**, **`password`**: Credenciales.
- **`role`**: Nivel de permiso (`ADMINISTRADOR`, `LECTOR`).

## Enums y Tipos

- **`Rol`**: Define los niveles de acceso (`ADMINISTRADOR`, `LECTOR`).
- **`EstadoArticulo`**: Controla el ciclo de vida del scraping (`SIN_TRABAJAR`, `EN_PROCESO`, `PROCESADO`, `DESCARTADO`).

---

_Esta estructura garantiza que no se procesen noticias duplicadas y permite un control granular sobre qué contenido llega al boletín final._
