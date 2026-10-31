# Milodeco v2

Rediseño del sitio de Milodeco: catálogo de deco tejida a mano en hierro y papel kraft, con carrito y pedido por WhatsApp.
Es un proyecto independiente del v1 ([Milodeco-web](https://github.com/EstebanGranja/Milodeco-web), en producción en milodeco.netlify.app). Los productos y fotos se tomaron de ahí.

## Cómo correrlo

```bash
npm install
npm run dev      # http://localhost:5173 (y en la red local, para verlo en el celular)
npm run build    # genera dist/
npm run preview  # sirve dist/ para probar el build
```

`npm run dev` muestra también una dirección `Network: http://192.168.x.x:5173`: abriéndola desde el celular (en el mismo wifi) se ve la versión móvil real.

## Estructura

```
index.html                 cascarón: encabezado, <main id="app"> y pie
netlify.toml               build, redirección de rutas a index.html y cache de fotos
public/
  img/                     fotos de productos (copiadas del v1) + logo
  videos/                  video de la Lámpara Geo y de Silvana en el taller
src/
  main.js                  arranque: arma la página según la ruta
  router.js                rutas sin recargar: /, /catalogo, /deco, /deco/arbolitos-de-navidad
  util.js                  precios, link de WhatsApp, localStorage
  datos/
    catalogo.json          categorías, productos, opciones y precios  ← lo que más se edita
    catalogo.js            funciones para leer el catálogo (precio "desde", resumen, etc.)
    sitio.js               WhatsApp, redes, anuncio de arriba, destacados y bloque de Navidad
  vistas/
    inicio.js              portada, mosaico de categorías, preferidas, Navidad, sobre mí
    categoria.js           una categoría (o el catálogo completo) con orden por precio
    no-encontrada.js       página 404
  componentes/
    encabezado.js          anuncio, menú (escritorio y celular) y botón del carrito
    producto.js            ficha de producto: modal en escritorio, pantalla completa en celular
    carrito.js             panel del carrito y armado del mensaje de WhatsApp
    tarjeta.js             tarjeta de producto de las grillas
    pie.js, iconos.js
  estilos/                 un CSS por sección; colores y tipografías en base.css
```

## Cómo cargar o editar productos

Todo está en `src/datos/catalogo.json`. Cada producto:

```jsonc
{
  "slug": "espejo-trenza",                 // la URL: /espejos/espejo-trenza
  "nombre": "Espejo Trenza",
  "descripcion": "Primera oración = resumen de la tarjeta. Después, el resto.",
  "imagenes": ["/img/espejo_31.webp", "/img/espejo_32.webp"],
  "opciones": [
    { "nombre": "50cm diámetro · 20cm espejo", "precio": 47000 }
  ],
  "demora": "10 a 15 días"
}
```

Campos opcionales:

- `nota`: cartelito sobre la foto (`"¡nuevos!"`). `notaGaleria` lo cambia solo dentro de la ficha.
- `frase`: texto a mano al lado de la categoría en la ficha.
- `tituloOpciones`: `"Opciones"` en lugar de `"Medidas"`.
- En cada opción, `detalle` (segunda línea) e `imagen`: si la opción tiene imagen, elegirla muestra esa foto y pasar las fotos elige la opción (así funcionan los arbolitos). `etiqueta` es el texto del cartelito de la foto.
- `"opciones": []` deja el producto "a consultar".
- Papel Kraft usa `colores` → `grosores` y `venta` (metros mínimos, de a cuánto, precio cada 100 m).

Las fotos van en `public/img/` y se nombran como en el v1 (`categoria_productoFoto.webp`).

## Deploy

Netlify toma `netlify.toml`: corre `npm run build` y publica `dist/`. Todas las rutas se redirigen a `index.html` para que los links a productos funcionen al compartirlos.

Mientras sea la versión de prueba, `index.html` tiene `<meta name="robots" content="noindex">` para que Google no la indexe. Hay que sacarlo al lanzarla.
