# Chancay Hub - Contexto del Proyecto

## Estado Actual: **Fase 2 - Aplicación Web Funcional (MVP)**

El proyecto ha evolucionado de un conjunto de prototipos HTML estáticos a una aplicación web completa basada en **React** con un backend en **Node.js** y persistencia de datos real.

## Arquitectura Técnica

### Frontend (`02.web_react`)
- **Framework:** React 19 + TypeScript + Vite.
- **Estilos:** Tailwind CSS v4 (configuración moderna vía CSS variables).
- **Enrutamiento:** `react-router-dom` para navegación fluida entre dashboards y páginas de registro.
- **Iconografía:** Material Symbols Outlined.
- **Componentes Clave:**
    - `Layout` y `AuthLayout`: Contenedores dinámicos para consistencia visual.
    - `Sidebar` y `Header`: Dinámicos según el rol del usuario logueado.
    - `Chatbot`: Asistente virtual flotante integrado en todas las vistas.
    - `InteractiveMap`: Visor geográfico de zonas estratégicas del puerto.

### Backend (`03.api`)
- **Servidor:** Node.js + Express.
- **Base de Datos:** SQLite (archivo local `marketplace.db`).
- **Endpoints Principales:**
    - `POST /api/register`: Registro de nuevos perfiles.
    - `POST /api/login`: Autenticación y recuperación de perfil.
    - `GET /api/users`: Listado global para administración.
    - `GET /api/matches/:id`: Motor de sugerencias dinámicas según el rol.
    - `DELETE /api/users/:id`: Gestión administrativa.

## Ecosistema de Usuarios y Roles

La plataforma está diseñada para conectar cuatro actores principales:

1. **Empresa (Inversionista):** Busca terrenos industriales y proveedores logísticos.
2. **Propietario de Terreno:** Ofrece lotes en zonas estratégicas (ZAL, Norte, Sur).
3. **Proveedor / Ingeniero:** Ofrece servicios técnicos y operativos al puerto.
4. **Administrador:** Monitorea el crecimiento, gestiona usuarios y analiza métricas.

## Credenciales de Prueba

| Rol | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@chancay.com` | `admin123` |
| **Empresa** | `empresa@test.com` | `password123` |
| **Propietario** | `propietario@test.com` | `password123` |
| **Proveedor** | `proveedor@test.com` | `password123` |

## Estructura de Carpetas Actualizada

```
marketplace_chancay_cip/
├── 01.docs/            # Documentación de visión y negocio
├── 02.web_react/       # Aplicación Frontend (React)
│   ├── src/
│   │   ├── components/ # Componentes reutilizables
│   │   ├── pages/      # Vistas principales y dashboards
│   │   └── App.tsx     # Configuración de rutas
├── 03.api/             # Backend y Base de Datos
│   ├── server.js       # Lógica del servidor
│   ├── seed.js         # Script de población de datos
│   └── marketplace.db  # Base de datos SQLite
└── README.md
```

## Próximos Pasos Sugeridos
- Implementar carga real de archivos (documentación de terrenos).
- Mejorar la lógica del chatbot con una IA más avanzada.
- Añadir sistema de mensajería interna entre actores.
