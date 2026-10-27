# puntrosales-web-catalog

Visor web estático para catálogos exportados por PuntroSales, construido **solo con HTML, CSS y JavaScript vanilla**.

## ¿Qué es este proyecto?

Este repositorio contiene una web estática que lee un `catalog.json` y renderiza un catálogo público con:

- Plantillas visuales seleccionables por JSON.
- Buscador de productos.
- Filtros por categorías (chips/tabs).
- Cards responsive con imagen, precio, unidad y disponibilidad.
- Manejo de errores y vista de catálogo expirado.

No hay backend ni dependencias obligatorias externas.

## Estructura

```text
/
  index.html
  catalog.json
  README.md
  /css
    base.css
    templates.css
  /js
    app.js
    templates.js
    catalog-loader.js
  /assets
    placeholder.svg
    puntro-sales-og-v1.jpg
```

## Cómo correr localmente

### Opción A: abrir archivo directamente

1. Descarga el repo.
2. Abre `index.html` en un navegador moderno.

> Nota: algunos navegadores bloquean `fetch()` en archivos `file://`. Si ocurre, usa la opción B.

### Opción B: servidor estático local

Puedes usar cualquier servidor estático simple:

```bash
python3 -m http.server 8080
```

Luego abre `http://localhost:8080`.

## Cómo cambiar la plantilla desde `catalog.json`

El campo `template` permite elegir el diseño:

- `restaurant-menu`
- `store`
- `default-catalog`

Si llega un valor no válido, la app usa `default-catalog` automáticamente.

## Publicar en GitHub Pages (rama `main`)

1. Sube el contenido a GitHub en la rama `main`.
2. Ve a **Settings → Pages**.
3. En **Build and deployment**, selecciona:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` y carpeta `/ (root)`
4. Guarda y espera el deploy.

La web usa rutas relativas (`./css/...`, `./js/...`, `./assets/...`) para funcionar dentro de un subdirectorio.

La URL pública de este visor se verificó el **27 de octubre de 2026**: [https://www.imecatro.com/catalog/](https://www.imecatro.com/catalog/). Responde con HTTP 200 y sirve el HTML de este repositorio. El alias [https://zayelmech.github.io/catalog/](https://zayelmech.github.io/catalog/) redirige a esa dirección; también se comprobó que conserva los parámetros en la redirección.

## Previsualización genérica al compartir enlaces

`index.html` incluye directamente en el `head`, sin ejecutar JavaScript:

- Título HTML y `og:title`: **Catálogos de Puntro Sales**.
- `meta description` y `og:description`: **Consulta los productos y novedades de los negocios que comparten su catálogo con Puntro Sales.**
- `og:type`: `website`; `og:site_name`: `Puntro Sales`.
- `og:image` y sus propiedades `width`, `height`, `type` y `alt`.

Todos los enlaces reciben esta misma tarjeta, tanto sin parámetros como con `?catalog=` o `?url=`. Los datos del JSON siguen mostrando el nombre, la descripción y los productos de cada negocio dentro del visor; no modifican los metadatos ni la imagen.

Se omite `og:url`: no se declara una única identidad Open Graph que pueda agrupar los enlaces de distintos catálogos bajo la dirección genérica. No se añade `canonical` ni redirección. La selección del catálogo y el botón **Copiar link** siguen utilizando la URL completa, con sus parámetros y la prioridad de `url`.

### Imagen estática

| Propiedad | Valor |
| --- | --- |
| Archivo | `assets/puntro-sales-og-v1.jpg` |
| URL absoluta HTTPS | [https://www.imecatro.com/catalog/assets/puntro-sales-og-v1.jpg](https://www.imecatro.com/catalog/assets/puntro-sales-og-v1.jpg) |
| Dimensiones | 1200 × 630 píxeles |
| Formato / MIME | JPEG / `image/jpeg` |
| Peso | 156 747 bytes (153,07 KiB) |
| Texto alternativo | Ilustración sobre fondo turquesa con teléfonos que muestran catálogos, listas y un lector de código de barras, junto a iconos de productos, clientes y gráficas. |

Se adaptó el archivo proporcionado `puntrobanner.png` (512 × 250), conservando su contenido completo y sus proporciones: ampliación a 1200 × 586 con el redondeo al píxel y márgenes turquesa de 22 píxeles arriba y abajo. Se exportó como JPEG de calidad 85. No se usó IA ni se añadieron elementos o datos de ningún negocio. La ampliación conserva la limitación de detalle de la fuente original.

El archivo se sirve directamente desde `assets/`, sin procesamiento por visita. La URL incluye el subdirectorio real `/catalog/`. Para cambiar la imagen en el futuro, publica otro archivo versionado, por ejemplo `puntro-sales-og-v2.jpg`, y actualiza las etiquetas de imagen en el HTML, incluidas dimensiones, MIME y texto alternativo si cambian. Los enlaces de los catálogos pueden mantenerse. Si el visor se muda de dominio o subdirectorio, hay que actualizar también la URL absoluta de `og:image`.

### Publicación y comprobación

Es necesario publicar juntos `index.html` y `assets/puntro-sales-og-v1.jpg` en el alojamiento estático existente. No hay un nuevo paso de generación, backend ni cambios en los endpoints JSON.

**Estado comprobado el 27 de octubre de 2026, antes de publicar estos cambios:** el dominio y el subdirectorio están confirmados, pero el despliegue todavía sirve el HTML anterior, sin Open Graph, y la nueva URL de imagen responde HTTP 404 con `text/html`. Por eso todavía está pendiente comprobar allí la imagen publicada con HTTP 200 y `Content-Type: image/jpeg`, sus dimensiones y su contenido, además del HTML con las nuevas etiquetas. No falta configurar ni contratar otro servicio: falta publicar los archivos modificados mediante el proceso existente.

Estas son URLs reales disponibles para la prueba después de publicar. Se abrieron en Chrome y actualmente muestran el catálogo correspondiente, con la versión anterior del visor:

| Caso | URL real |
| --- | --- |
| Catálogo local de demostración | [Abrir visor sin parámetros](https://www.imecatro.com/catalog/) |
| `catalog`, negocio La Cocina de Lupita | [Abrir con catalog](https://www.imecatro.com/catalog/?catalog=https%3A%2F%2Fapps.imecatro.com%2Fc%2Fdemo-puntrosales-001) |
| `url` Base64 URL-safe, mismo negocio | [Abrir con url](https://www.imecatro.com/catalog/?url=aHR0cHM6Ly9hcHBzLmltZWNhdHJvLmNvbS9jL2RlbW8tcHVudHJvc2FsZXMtMDAx) |

El [endpoint JSON real de ese negocio](https://apps.imecatro.com/c/demo-puntrosales-001) respondió HTTP 200 con `application/json`. No se convirtió en HTML ni se modificó su contrato. Restringe las solicitudes desde localhost (se observó HTTP 403 y falta de permiso CORS); los enlaces anteriores sí se comprobaron en navegador desde el dominio público. Las pruebas locales de otros catálogos usaron endpoints temporales de prueba con CORS.

Verificaciones técnicas realizadas con los archivos modificados, mediante un servidor local temporal y Chrome:

- El HTML recibido por HTTP sin ejecutar JavaScript contiene las nueve etiquetas OG, el título y la descripción esperados; es idéntico para diferentes parámetros. No hay `canonical` ni redirecciones añadidas.
- El archivo final se decodifica como JPEG de 1200 × 630 y pesa 156 747 bytes. Su descarga local bajo `/catalog/assets/` responde HTTP 200 con `image/jpeg`; se revisó visualmente.
- El catálogo local y dos negocios distintos cargan con `catalog` y `url`; se conserva la prioridad de `url`, incluso si su valor es inválido y existe un `catalog` válido.
- Con respuestas Firebase **simuladas**, se comprobó que ambos formatos envían la URL completa conservando exactamente `%2F`, `alt` y `token`. No se validaron permisos ni CORS de un bucket Firebase real.
- Los endpoints remotos de prueba sin extensión `.json` siguen entregando JSON. Las tres plantillas, búsqueda, filtros, enlace de contacto y copia de la URL completa funcionan. El nombre y la descripción del negocio se muestran y los metadatos permanecen genéricos.
- Se probaron un catálogo expirado y un endpoint inexistente: sus vistas de estado siguen funcionando y sus metadatos son los mismos que los de un catálogo disponible.

Esto es **validación técnica de HTML, imagen y funcionamiento del visor**, no una prueba real de tarjeta en WhatsApp. **No se envió ningún enlace por WhatsApp.** Después de publicar hay que enviar las URLs reales anteriores y revisar la tarjeta y que al abrirla se conserve el catálogo seleccionado.

WhatsApp y otras plataformas pueden guardar tarjetas antiguas en caché. Cambiar el archivo o su URL versionada no garantiza una actualización inmediata de las tarjetas ya almacenadas.

Como el HTML inicial es estático y genérico, la misma tarjeta puede aparecer aunque el catálogo esté expirado, despublicado o no exista. Estos metadatos no detectan esos estados; la carga y las vistas de estado existentes se resuelven al abrir el visor con JavaScript.

## Ejemplo de JSON

```json
{
  "catalogId": "demo-catalog",
  "template": "store",
  "store": {
    "name": "PuntroSales Demo Store",
    "description": "Catálogo generado desde PuntroSales",
    "logoUrl": "",
    "currency": "MXN",
    "whatsapp": "",
    "location": ""
  },
  "expiresAt": "2099-12-31T23:59:59-06:00",
  "categories": ["Todos", "Bebidas", "Snacks", "Limpieza", "Cocina"],
  "products": [
    {
      "id": "prod_001",
      "name": "Café soluble",
      "description": "Café soluble clásico de uso diario.",
      "category": "Bebidas",
      "price": 85.5,
      "unit": "pieza",
      "available": true,
      "stock": 10,
      "imageUrl": "https://placehold.co/600x400?text=Cafe"
    }
  ]
}
```

## Notas para integración futura con PuntroSales

- En este demo, los datos se leen desde `catalog.json` local.
- En producción, ese JSON puede venir desde hosting estático como:
  - Firebase Storage
  - OCI Object Storage
  - NGINX sirviendo archivos estáticos
  - S3 compatible u otra CDN estática
- Mientras el archivo JSON cumpla la estructura esperada, la UI lo renderizará.

## Funcionalidades incluidas

- Plantillas: `restaurant-menu`, `store`, `default-catalog`.
- Fallback de plantilla inválida a `default-catalog`.
- Validación básica y errores amigables de carga/parsing.
- Pantalla de catálogo expirado (`expiresAt`).
- Buscador por nombre, descripción y categoría.
- Chips de categoría con opción `Todos`.
- Placeholder local si la imagen falta.
- Badge de disponibilidad (`Disponible` / `Agotado`) cuando existe `available`.
- Formato de precios con `Intl.NumberFormat` usando moneda del catálogo.
- Botón para copiar link actual.
- Botón de WhatsApp cuando `store.whatsapp` existe.

## Alcance

Este proyecto **no implementa carrito ni pedidos**: es un visor público estático de catálogo.

## Probar con Firebase Storage

Puedes usar la misma web en GitHub Pages para cargar un catálogo remoto por query param `catalog` o por el nuevo query param `url` codificado en Base64 URL-safe. Si ambos parámetros existen, `url` tiene prioridad.

### 1) Subir `catalog.json` a Firebase Storage

1. En Firebase Console, entra a **Storage** de tu proyecto.
2. Crea (si no existe) la ruta:
   - `catalogs/demo-puntrosales-001/catalog.json`
3. Sube tu archivo `catalog.json` en esa ubicación.

### 2) Subir imágenes del catálogo

Sube las imágenes a:

- `catalogs/demo-puntrosales-001/images/`

Luego usa esas URLs públicas en el campo `imageUrl` de cada producto dentro de `catalog.json`.

### 3) Obtener URL pública del `catalog.json`

La URL de descarga pública normalmente queda así:

`https://firebasestorage.googleapis.com/v0/b/BUCKET/o/catalogs%2Fdemo-puntrosales-001%2Fcatalog.json?alt=media`

Asegúrate de que las reglas/permisos permitan lectura pública para pruebas (o utiliza un token de descarga válido).

### 4) Codificar URL para usarla en GitHub Pages

Para el formato compatible existente con `catalog`, codifica **la URL completa** con `encodeURIComponent(...)`, por ejemplo desde consola del navegador:

```js
const firebaseCatalogUrl = "https://firebasestorage.googleapis.com/v0/b/BUCKET/o/catalogs%2Fdemo-puntrosales-001%2Fcatalog.json?alt=media";
const encoded = encodeURIComponent(firebaseCatalogUrl);
console.log(encoded);
```

Para el nuevo formato `url`, codifica la URL completa como Base64 URL-safe:

```js
const firebaseCatalogUrl = "https://firebasestorage.googleapis.com/v0/b/BUCKET/o/catalogs%2Fdemo-puntrosales-001%2Fcatalog.json?alt=media";
const encoded = btoa(unescape(encodeURIComponent(firebaseCatalogUrl)))
  .replace(/\+/g, "-")
  .replace(/\//g, "_")
  .replace(/=+$/, "");
console.log(encoded);
```

### 5) URL final de prueba

Usa tu GitHub Pages con el parámetro `catalog`:

`https://USUARIO.github.io/puntrosales-web-catalog/?catalog=URL_FIREBASE_CODIFICADA`

Ejemplo completo:

`https://USUARIO.github.io/puntrosales-web-catalog/?catalog=https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2FBUCKET%2Fo%2Fcatalogs%252Fdemo-puntrosales-001%252Fcatalog.json%3Falt%3Dmedia`

O usa el nuevo parámetro `url`:

`https://USUARIO.github.io/puntrosales-web-catalog/?url=URL_BASE64_URL_SAFE`

### Comportamiento esperado

- Sin query param, la app carga `./catalog.json`.
- Con `?url=...`, la app decodifica el valor como Base64 URL-safe, valida que el resultado sea una URL `http:` o `https:`, y usa esa URL decodificada para cargar el JSON.
- Si llegan `?url=...` y `?catalog=...` en la misma URL, `url` tiene prioridad.
- Con `?catalog=...`, la app mantiene compatibilidad e intenta cargar la URL remota usando el valor retornado por `URLSearchParams.get("catalog")` (sin `decodeURIComponent` manual adicional).
- Para Firebase Storage, esto evita romper el object path (`%2F`) dentro de la URL del archivo.
- Si la URL remota no es válida, la decodificación de `url` falla, o hay problemas de descarga, CORS o permisos, verás un mensaje claro en pantalla y detalles en consola.

### Ejemplo con `url` en Base64 URL-safe

URL recibida:

`https://www.imecatro.com/catalog/?url=aHR0cHM6Ly9hcHBzLmltZWNhdHJvLmNvbS9jL2RlbW8tcHVudHJvc2FsZXMtMDAx`

La app decodifica el parámetro `url` a:

`https://apps.imecatro.com/c/demo-puntrosales-001`

Y después hace `fetch()` a esa URL decodificada.

## Identidad visual y personalización de marca

La interfaz fue rediseñada con una identidad visual moderna basada en PuntroSales, utilizando `#37c8ab` como color principal y una paleta equilibrada de neutros, acentos suaves y estados (éxito/error). El sistema usa variables CSS globales en `css/base.css` para mantener consistencia visual entre plantillas y facilitar mantenimiento.

Variables clave:

- `--primary`: color principal de marca.
- `--primary-dark`: variante para hover/contraste.
- `--primary-soft` y `--primary-tint`: fondos suaves y acentos.
- Variables de tipografía, radios, sombras y spacing para una UI más profesional.

Si en el futuro deseas personalizar por otra marca, cambia primero estas variables en `:root` dentro de `css/base.css`. Con eso se actualizan automáticamente botones, chips, estados activos, focus del buscador y énfasis visual de precios sin tocar la lógica JavaScript.
