# TrendPulse — Frontend

Frontend de **TrendPulse**, una plataforma de toma de decisiones estratégicas para
empresas que quieren posicionar su marca mediante marketing de influencers en
TikTok. Permite analizar cuentas, evaluar su impacto y decidir a qué creadores
conviene contratar para una campaña.

Construido con [Vite](https://vite.dev/) + [React](https://react.dev/) (JavaScript),
estilado con [Tailwind CSS](https://tailwindcss.com/) y conectado al backend
([Complejidad-App/Backend](https://github.com/Complejidad-App/Backend), FastAPI)
mediante [Axios](https://axios-http.com/).

## Requisitos

- Node.js 20.19+ / 22.13+ (o >= 24)
- npm
- Backend de TrendPulse corriendo (por defecto en `http://localhost:8000`)

## Puesta en marcha

```bash
npm install
cp .env.example .env      # ajusta VITE_API_URL si tu backend usa otra URL
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

## Scripts

| Script            | Descripción                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Servidor de desarrollo (Vite)            |
| `npm run build`   | Build de producción en `dist/`           |
| `npm run preview` | Sirve localmente la build de producción  |
| `npm run lint`    | ESLint                                    |

## Variables de entorno

| Variable       | Descripción                    | Valor por defecto                |
| -------------- | ------------------------------ | -------------------------------- |
| `VITE_API_URL` | URL base de la API del backend | `http://localhost:8000/api/v1`   |

## Módulos

- **Dashboard** — KPIs del mercado (engagement promedio estimado, creadores top,
  cobertura óptima), distribución de audiencia y creadores recomendados.
- **Analizador de Cuentas** — busca una cuenta de TikTok por ID y muestra una
  tarjeta de perfil (seguidores, engagement, costo estimado por post, afinidad de
  marca).
- **Recomendador Inteligente** — define un presupuesto (k creadores) y obtén el
  conjunto que maximiza el alcance, con su tabla comparativa y la curva de
  retornos decrecientes.
- **Red de Influencia** — visualización del grafo de seguidores, el flujo máximo
  de audiencia y el árbol de cobertura mínima (MST).

## Conexión con el backend

Toda la capa de servicios vive en `src/services/` y usa `VITE_API_URL` como base.
Endpoints mapeados:

| Servicio                  | Endpoint backend                          |
| ------------------------- | ----------------------------------------- |
| `getHealth`               | `GET /health`                             |
| `getStats`                | `POST /analysis/stats`                    |
| `getFollowersGraph`       | `GET /graph/followers`                    |
| `getMaxFlow`              | `GET /flow/max`                           |
| `getMinimumSpanningTree`  | `GET /mst/kruskal`                         |
| `getInfluenceMaximization`| `GET /greedy/influence-maximization`      |

> **Nota sobre métricas estimadas:** el backend expone un grafo de seguidores
> (in-degree por cuenta), pero **no** entrega vistas, engagement, costo por post
> ni afinidad de marca. Esos indicadores se **derivan en el cliente** a partir del
> in-degree con heurísticas deterministas (ver `src/utils/metrics.js`) y se
> muestran etiquetados como *estimados*.

## Estructura del proyecto

```
src/
├── components/
│   ├── layout/        # AppLayout, Sidebar, Topbar
│   ├── ui/            # Card, KpiCard, Badge, Spinner, Skeleton, StateViews
│   ├── network/       # NetworkGraph (visualización SVG del grafo)
│   ├── Logo.jsx
│   └── CreatorProfileCard.jsx
├── pages/             # Dashboard, AccountAnalyzer, Recommender, Network
├── services/          # Cliente Axios + un servicio por grupo de endpoints
├── hooks/             # useApi (carga/errores)
├── utils/             # metrics.js (métricas derivadas y formateadores)
├── App.jsx            # Rutas (react-router-dom)
├── main.jsx
└── index.css          # Tailwind + tema oscuro
```
