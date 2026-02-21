# Data versioning workflow (`data_property.json`)

Este documento describe cómo funciona el versionado remoto para mantener la app móvil sincronizada con cambios en `data/data_property.json`.

## Archivos clave

- `data/data_property.json` → dataset principal.
- `data/version.json` → metadatos livianos de versión.
- `admin-desktop/src/services/versionService.ts` → incrementa versión al guardar cambios.
- `src/hook/checkDataVersion.ts` → compara versión remota vs local en la app móvil.
- `src/pages/PropertyView/index.tsx` → descarga condicional + actualización de cache/localStorage.

## Estructura de `version.json`

```json
{
  "version": 12,
  "updatedAt": "2026-02-21T18:00:00.000Z",
  "description": "Update property A-539099"
}
```

## Flujo end-to-end

1. Admin-Desktop crea/actualiza/elimina una propiedad.
2. `PropertyService` persiste cambios en `data_property.json`.
3. `VersionService.bumpVersion()` incrementa `data/version.json`.
4. `GitService.syncPropertyData()` hace commit+push a `main`.
5. App móvil inicia y ejecuta `checkDataVersion()`.
6. Si hay nueva versión:
   - Descarga `data_property.json` remoto.
   - Actualiza `localStorage`.
   - Actualiza cache `github-data-cache` (Workbox) programáticamente.
   - Guarda versión local.
7. Si no hay cambios:
   - Reutiliza datos de `localStorage`/cache.

## Notas de cache

- `version.json`: se consulta con `cache: no-store` para evitar lecturas obsoletas.
- `data_property.json`: mantiene estrategia `NetworkFirst` en Workbox y cache local como fallback.

## Criterio operativo

Cada cambio de datos que impacte `data_property.json` debe pasar por `PropertyService` para asegurar incremento de versión.
