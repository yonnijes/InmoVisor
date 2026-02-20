# Estructura del Proyecto 📂

InmoVisor está organizado como un monorepo simplificado para separar el visor del administrador.

## 📁 Carpetas Principales

### `/src` (App Móvil)
Contiene el código fuente de la aplicación móvil Ionic React.
- **`/components`**: UI reutilizable y lógica de mapas.
- **`/hook`**: Lógica de filtrado y fetching de datos.

### `/admin-desktop` (Nueva 💻)
Proyecto de administración basado en Electron.
- **Lógica de Git:** Automatización de comandos push/pull.
- **Procesamiento:** Script de conversión de imágenes a WebP y redimensión a 1080px.
- **Formulario:** Captura de coordenadas y metadatos de propiedades.

### `/data` (Base de Datos)
Repositorio central de información compartido.
- **`data_property.json`**: El "Master Record" de todas las propiedades.
- **`/img`**: Repositorio de imágenes optimizadas.

### `/docs`
Documentación técnica del ecosistema.

## 📄 Flujo de Sincronización
1. El administrador edita datos en `/admin-desktop`.
2. Se procesan imágenes y se actualiza el JSON local.
3. Se realiza un `git push` automático desde la App de Escritorio.
4. La App Móvil detecta el cambio (vía Network-First) y actualiza su caché local.
