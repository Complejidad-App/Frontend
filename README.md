# Frontend

Frontend de la aplicación **Complejidad App**, construido con [Vite](https://vite.dev/) + [React](https://react.dev/) (JavaScript) y estilado con [Tailwind CSS](https://tailwindcss.com/).

## Requisitos

- Node.js 20.19+ / 22.13+ (o >= 24)
- npm

## Puesta en marcha

```bash
# Instalar dependencias
npm install

# Copiar las variables de entorno
cp .env.example .env

# Iniciar el servidor de desarrollo
npm run dev
```

La aplicación quedará disponible en `http://localhost:5173`.

## Scripts disponibles

| Script            | Descripción                                  |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Inicia el servidor de desarrollo de Vite     |
| `npm run build`   | Genera la build de producción en `dist/`     |
| `npm run preview` | Sirve localmente la build de producción      |
| `npm run lint`    | Ejecuta ESLint sobre el proyecto             |

## Variables de entorno

Las variables se definen en `.env` (ver `.env.example`):

| Variable       | Descripción                       | Valor por defecto                  |
| -------------- | --------------------------------- | ---------------------------------- |
| `VITE_API_URL` | URL base de la API del backend    | `http://localhost:8000/api/v1`     |

## Estructura del proyecto

```
src/
├── components/   # Componentes comunes y reutilizables (Navbar, Sidebar, ...)
├── pages/        # Páginas/vistas de la aplicación (Dashboard, ...)
├── services/     # Llamadas a la API (cliente HTTP con base URL configurable)
├── App.jsx       # Componente raíz
├── main.jsx      # Punto de entrada
└── index.css     # Estilos globales (Tailwind)
```

## Consumo de la API

El cliente HTTP vive en `src/services/api.js` y usa `VITE_API_URL` como base URL:

```js
import api from './services/api'

const proyectos = await api.get('/proyectos')
```
