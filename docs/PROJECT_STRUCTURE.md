# Estructura del Proyecto 📂

Guía detallada de las carpetas y archivos principales de InmoVisor.

## 📁 Carpetas Principales

### `/src`
Contiene el código fuente de la aplicación React.
- **`/components`**: Componentes reutilizables (Filtros, Mapas, Botón de WhatsApp, Carousels).
- **`/hook`**: Lógica personalizada y gestión de estado (ej: `usePropertyViewLogic`).
- **`/models`**: Definiciones de interfaces y tipos de TypeScript para las entidades (Propiedades).
- **`/pages`**: Pantallas principales:
  - `PropertyView`: Vista de lista/galería de propiedades.
  - `PropertyViewMap`: Vista de mapa interactivo.
- **`/theme`**: Configuración visual y variables de diseño CSS.

### `/android` y `/ios`
Carpetas generadas por Capacitor que contienen los proyectos nativos listos para ser abiertos en Android Studio o Xcode.

### `/public` y `/resources`
- **`/public`**: Activos web (favicon, manifest).
- **`/resources`**: Iconos y pantallas de carga (splash screens) generados para las apps nativas.

### `/cypress`
Contiene los tests de integración (End-to-End) para asegurar la calidad del flujo de usuario.

## 📄 Archivos de Configuración
- `capacitor.config.ts`: Configuración del runtime nativo.
- `ionic.config.json`: Integración con el CLI de Ionic.
- `vite.config.ts`: Configuración del bundler y servidor de desarrollo.
- `package.json`: Listado de dependencias y scripts de ejecución.
