# 036 DW 2026 Final — Variante A

Catálogo de productos con autenticación, paginación, búsqueda, detalle y CRUD, construido con React + TypeScript + TailwindCSS. Consume la API de DummyJSON (https://dummyjson.com).

Demo en producción: https://036-dw-2026-final-v-a.vercel.app/

## Tecnologías

- React 19 + TypeScript
- Vite — bundler y dev server
- TailwindCSS v4 — estilos
- React Router v7 — rutas
- TanStack Query v5 — fetching y caché
- Zustand v5 con persist — estado global y sesión
- Axios — cliente HTTP con interceptores
- React Hook Form + Zod v4 — formularios y validación
- React Hot Toast — notificaciones
- Shadcn/ui — componentes de interfaz

## Cómo empezar

```bash
npm install
cp .env.example .env
npm run dev
```

La app abre en `http://localhost:5173`.
Usuario de prueba: `emilys` / `emilyspass`.

## Comandos

| Comando | Para qué |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compila TypeScript y genera `dist/` |
| `npm run preview` | Previsualiza el build de producción |
| `npm run lint` | Revisa el código con ESLint |

## Funcionalidades implementadas

Autenticación: login con React Hook Form y Zod, store de sesión con Zustand persist, interceptor Axios para token Bearer, renovación automática de token ante 401, rutas protegidas con ProtectedRoute.

Listado: paginación del servidor (8 por página), búsqueda por texto, página y búsqueda en la URL con useSearchParams, sin parpadeo al cambiar página.

Detalle: vista de detalle por ID, descarga de imagen como archivo blob, descarga de ficha en texto plano.

Crear y eliminar: formulario con validación de título, precio y descripción, validación de imagen (solo JPG/PNG, máximo 1 MB), vista previa antes de enviar, confirmación antes de eliminar.

Errores: mensajes en español para 400, 401, 403, 404, 500 y sin conexión, card de error con botón Reintentar, página 404 para rutas no encontradas.

Interfaz: cuadrícula responsive de 1 columna en móvil, 2 en tableta y 4 en escritorio, sin scroll horizontal.

## Despliegue

Desplegado en Vercel. El archivo `vercel.json` permite abrir rutas internas directamente.

https://036-dw-2026-final-v-a.vercel.app/