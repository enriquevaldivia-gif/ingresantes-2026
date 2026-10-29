# INGRESANTES 2026 — Portal público

Sitio estático para GitHub Pages. Los indicadores muestran **datos de demostración** hasta configurar `config.js` con el endpoint de Apps Script.

## Publicación
1. Crea un repositorio **público** en GitHub (p. ej. `ingresantes-2026`).
2. Sube los archivos **del interior** de esta carpeta a la raíz del repositorio (incluyendo `assets/`).
3. En **Settings > Pages**, selecciona **Deploy from a branch**, rama `main`, carpeta `/ (root)` y guarda.
4. Abre la URL que GitHub Pages muestre.

## Datos reales
El código de la API está en un archivo separado, `INGRESANTES_2026_APPS_SCRIPT.gs`. **No lo subas al repositorio público**. Despliégalo en Apps Script con acceso público solo a agregados y pega la URL `/exec` en `config.js`. La API lee el libro V2 y no escribe en él.

## Fotografías
No subas fotografías ni datos identificables de estudiantes a GitHub antes de verificar las autorizaciones correspondientes. Las fichas públicas de alumnos aún no están implementadas.
