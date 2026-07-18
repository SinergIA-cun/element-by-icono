# Integración Wix + Airtable

## Airtable (Task 10 — creado 2026-07-17)

- Workspace: Punch! (`wspv3f0lSBbkDWLHR`)
- Base: **Element Leads** — `appm98LTQUyUNn9GL`
- Tabla: **Leads** — `tblSD9pO8rbFFUXUO`
- Campos: Nombre, Teléfono, Email, Perfil, Tipología, Forma de pago, Modo renta, Horizonte (años), Rendimiento neto, ROI proyectado, Canal preferido, Idioma, Fuente, Estatus (default Nuevo), Fecha
- Esquema validado con registro de prueba (creado y borrado).

## Pasos manuales pendientes (Task 11/12)

1. Crear Personal Access Token de Airtable con scope `data.records:write` limitado a la base `appm98LTQUyUNn9GL`.
2. En Wix (sitio "Element By Icono 1"): Configuración → Secrets Manager → nuevo secret `AIRTABLE_TOKEN` con ese token.
3. Activar Dev Mode (Velo) → Backend → crear `http-functions.js` → pegar el contenido de `velo/http-functions.js` de este repo.
4. Publicar el sitio. Probar con curl (ver plan Task 11 Step 3).
5. Montaje del embed y SEO: ver plan Task 12.
