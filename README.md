# 🛡️ PixelPro - Panel Administrativo

Este repositorio contiene el código fuente del **Panel Administrativo** de la plataforma e-commerce **PixelPro**.

Es una aplicación **SPA (Single Page Application)** construida con **Angular**, diseñada para permitir a los administradores gestionar el catálogo de productos, monitorear órdenes de compra, gestionar usuarios y visualizar métricas de ventas en tiempo real.

---

## 🌌 Ecosistema PixelPro

Este proyecto es parte de una arquitectura completa de 3 capas. Para ver el sistema completo, visite los otros repositorios:

| Componente               | Tecnología                      | Repositorio                                                                  | Despliegue (Demo)                                      |
| :----------------------- |:--------------------------------|:-----------------------------------------------------------------------------|:-------------------------------------------------------|
| **Backend API**          | Java Spring Boot 3 + PostgreSQL | [Link al Repo Backend](https://github.com/JurgensAlemy/pixelpro-backend.git) | [Link a Render](https://pixelpro-backend.onrender.com) |
| **Storefront (Cliente)** | React + Vite + TypeScript       | [Link al Repo Cliente](https://github.com/juanpbc8/pixelpro-client.git)      | [Link a Vercel](https://pixelpro-client.vercel.app)    |
| **Admin Panel**          | **Angular 20**                  | **(Este repositorio)**                                                       | [Link a Vercel](https://pixelpro-admin.vercel.app)     |

---

## 🏛️ Arquitectura del Proyecto

El proyecto implementa una **Arquitectura Modular (Feature-Based)** alineada con los principios de **Screaming Architecture**. Esta estructura permite que la organización de carpetas refleje explícitamente el dominio del negocio (E-commerce) en lugar de aspectos técnicos.

Asimismo, se aplican principios de **Clean Code** y **Separation of Concerns (SoC)** para garantizar un desacoplamiento claro entre la lógica de negocio (`features`), la estructura visual global (`layouts`) y los componentes reutilizables (`shared`).

### Estructura de Carpetas

```text
src/app/
├── core/           # Servicios singleton, guardias (auth) e interceptores
├── layouts/        # Estructura visual y composición de páginas
│   ├── admin-layout/  # Layout principal (Sidebar + Header + Content)
│   ├── auth-layout/   # Layout limpio para autenticación
│   └── components/    # Piezas estructurales (Header, Sidebar)
├── features/       # Módulos de negocio (Screaming Architecture)
│   ├── auth/       # Login y seguridad
│   ├── dashboard/  # Métricas y KPIs
│   ├── products/   # Catálogo y gestión de inventario
│   ├── categories/ # Clasificación de productos
│   ├── orders/     # Flujo de pedidos
│   └── users/      # Gestión de roles y accesos
├── shared/         # UI Kit: Componentes genéricos, pipes y directivas
└── environments/   # Configuración por entorno (Dev/Prod)
```

---

## 🛠️ Tecnologías Clave
- Framework: Angular 20 (Standalone Components)
- Lenguaje: TypeScript
- Estilos: Bootstrap 5 & Bootstrap Icons (CSS Modules)
- Alertas: SweetAlert2 
- Cliente HTTP: Angular HttpClient (con Interceptores)
- Routing: Angular Router (Lazy Loading activado)

---

## 🚀 Manual de Instalación y Ejecución
Sigue estos pasos para ejecutar el proyecto en tu entorno local.

### 1. Prerrequisitos
   Asegúrate de tener instalado:

- Node.js (v18 o superior recomendado)
- Angular CLI: Instálalo globalmente ejecutando:

```Bash
npm install -g @angular/cli
```

### 2. Clonar el repositorio
```Bash
git clone [https://github.com/tu-usuario/pixelpro-admin.git](https://github.com/tu-usuario/pixelpro-admin.git)
cd pixelpro-admin
```

### 3. Instalar dependencias
```Bash
npm install
```

### 4. Configuración de Entorno
   Angular utiliza archivos en `src/environments/` para conectar con el Backend.

- Modo Desarrollo (`src/environments/environment.ts`): Apunta al backend local o a tu túnel de desarrollo.

```TypeScript
export const environment = {
    production: false,
    apiUrl: 'http://localhost:8080'
};
```

- Modo Producción (`src/environments/environment.prod.ts`): Se usa al desplegar. Apunta al servidor en la nube (Render).

```TypeScript
export const environment = {
    production: true,
    apiUrl: '[https://pixelpro-backend.onrender.com](https://pixelpro-backend.onrender.com)'
};
```

### 5. Ejecutar en Modo Desarrollo
   Levanta el servidor local con recarga automática:

```Bash
ng serve
```

La aplicación estará disponible en http://localhost:4200/.

## 📦 Construcción para Producción (Build)
Para generar los archivos estáticos optimizados para producción (minificados y ofuscados):

```Bash
ng build --configuration production
```

Los archivos generados se ubicarán en: `dist/pixelpro-admin/browser`. Esta carpeta es la que se debe subir a servicios de hosting como Vercel, Netlify o AWS S3.

## ☁️ Despliegue en Vercel
Este proyecto incluye un archivo vercel.json configurado para manejar el enrutamiento SPA (evita errores 404 al recargar páginas internas).

Configuración recomendada en Vercel:

- Framework Preset: Angular
- Build Command: ng build (o npm run build)
- Output Directory: `dist/pixelpro-admin/browser`

Variables de Entorno: No son necesarias en Vercel si ya configuraste `environment.prod.ts`.
