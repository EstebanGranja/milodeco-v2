import { buscarCategoria, buscarProducto, categorias, contarPiezas } from '../datos/catalogo.js';
import { sitio } from '../datos/sitio.js';
import { crear, linkWhatsApp } from '../util.js';
import { iconos, puntada } from '../componentes/iconos.js';
import { tarjetaProducto } from '../componentes/tarjeta.js';

const pasos = [
  ['Elegí', 'Mirá las medidas y opciones, y sumá lo que te guste al carrito.'],
  ['Enviá el pedido', 'Desde el carrito me llega por WhatsApp, con todo el detalle.'],
  ['Coordinamos', 'Acordamos el pago y la entrega. Cada pieza está lista en 10 a 15 días.']
];

export function vistaInicio() {
  const destacados = sitio.destacados
    .map(([idCategoria, slug]) => {
      const categoria = buscarCategoria(idCategoria);
      const producto = buscarProducto(categoria, slug);
      return producto && tarjetaProducto(categoria, producto);
    })
    .filter(Boolean);
  const t = sitio.temporada;

  const vista = crear(`
    <div class="inicio">
      <!-- Portada: presentación + categorías -->
      <section class="portada contenedor">
        <div class="portada-texto">
          <p class="saludo">¡Hola! Pasá, que te muestro ${iconos.corazon(28)}</p>
          <h1 class="portada-titulo">Piezas tejidas <span class="resaltado"><em>a mano</em>${iconos.subrayado()}</span>, en hierro y papel kraft.</h1>
          <p class="portada-bajada">Espejos, lámparas y deco para darle calidez a tu casa.</p>
          <div class="portada-botones">
            <a class="boton" href="/catalogo">Ver catálogo ${iconos.flecha()}</a>
            <a class="boton boton-borde solo-escritorio" href="${linkWhatsApp()}" target="_blank" rel="noopener">${iconos.whatsapp()} WhatsApp</a>
          </div>
        </div>

        <nav class="mosaico" aria-label="Categorías">
          ${categorias.map((c) => `
            <a class="mosaico-item" href="/${c.id}" data-categoria="${c.id}">
              <img src="${c.portada}" alt="" style="object-position: ${c.portadaPosicion || 'center'}">
              ${c.nota ? `<span class="washi mosaico-washi" aria-hidden="true"></span><span class="cinta mosaico-cinta">${c.nota}</span>` : ''}
              <span class="mosaico-etiqueta">
                <span class="mosaico-texto">
                  <span class="mosaico-nombre">${c.nombre}</span>
                  <span class="mosaico-cantidad">${contarPiezas(c)}</span>
                </span>
                <span class="mosaico-flecha">${iconos.flecha({ tam: 15, grosor: 1.8 })}</span>
              </span>
            </a>`).join('')}
        </nav>
      </section>

      ${puntada}

      <!-- Lo más pedido -->
      <section class="seccion contenedor">
        <div class="seccion-encabezado">
          <h2 class="titulo-seccion">Lo más pedido</h2>
          <a class="link-subrayado" href="/catalogo">Ver todo →</a>
        </div>
        <div class="grilla-productos">${destacados.join('')}</div>
      </section>

      ${t ? `
        <!-- Temporada -->
        <section class="contenedor seccion-temporada">
          <div class="temporada">
            <div class="temporada-texto">
              <p class="antetitulo">${t.antetitulo}</p>
              <h2 class="temporada-titulo">${t.titulo} <em>${t.tituloResaltado}</em></h2>
              <p class="temporada-bajada">${t.texto}</p>
              <div class="temporada-chips">${t.chips.map((chip) => `<span>${chip}</span>`).join('')}</div>
              <a class="boton boton-claro" href="${t.link}">${t.boton} ${iconos.flecha()}</a>
            </div>
            <div class="temporada-foto">
              <a class="polaroid" href="${t.link}" tabindex="-1" aria-hidden="true">
                <span class="washi polaroid-washi"></span>
                <span class="polaroid-foto"><img src="${t.imagen}" alt="${t.imagenAlt}" loading="lazy"></span>
                <span class="polaroid-epigrafe">${t.epigrafe}</span>
              </a>
            </div>
          </div>
        </section>` : ''}

      <!-- Sobre mí -->
      <section id="sobre-mi" class="sobre-mi contenedor">
        <div class="sobre-mi-fotos">
          <div class="polaroid polaroid-silvana">
            <span class="washi polaroid-washi" aria-hidden="true"></span>
            <span class="polaroid-foto">
              <video src="/videos/silvana-taller.mp4" poster="/img/silvana-taller.jpg" muted loop playsinline preload="none" aria-label="Silvana trabajando el hierro en su taller"></video>
            </span>
          </div>
          <div class="polaroid polaroid-chica">
            <span class="washi polaroid-washi" aria-hidden="true"></span>
            <span class="polaroid-foto"><img src="/img/deco_11.webp" alt="Mesa Nórdica con una bandeja tejida, en el jardín" loading="lazy"></span>
          </div>
        </div>
        <div class="sobre-mi-texto">
          <p class="antetitulo">Sobre mí</p>
          <h2 class="titulo-seccion">Un taller en el <em>campo</em></h2>
          <p class="sobre-mi-bajada">Vivo en una casa de campo en Villa San Isidro. Ahí está mi taller, donde hago cada pieza a mano, de a una.</p>
          <div class="nota-papel">
            <span class="washi washi-blanca" aria-hidden="true"></span>
            <h3>Talleres de tejido</h3>
            <p>También doy talleres en mi casa. En cada uno tejés tu propia pieza y te la llevás.</p>
            <a class="boton boton-mediano" href="${linkWhatsApp('Hola Silvana, te consulto por los talleres de tejido.')}" target="_blank" rel="noopener">Consultar</a>
          </div>
          <p class="firma">Silvana ${iconos.corazon(28)}</p>
        </div>
      </section>

      <!-- Cómo comprar -->
      <section class="como-comprar">
        <div class="contenedor">
          <h2 class="titulo-seccion">¿Cómo me comprás?</h2>
          <ol class="pasos">
            ${pasos.map(([titulo, texto], i) => `
              <li class="paso">
                <span class="paso-numero" aria-hidden="true">${i + 1}</span>
                <div>
                  <h3 class="paso-titulo">${titulo}</h3>
                  <p>${texto}</p>
                </div>
              </li>`).join('')}
          </ol>
        </div>
      </section>
    </div>`);

  reproducirAlVer(vista.querySelector('.polaroid-silvana video'));
  return vista;
}

// El video de Silvana se reproduce solo cuando está en pantalla (y no gasta datos antes)
function reproducirAlVer(video) {
  if (!('IntersectionObserver' in window)) return;
  const observador = new IntersectionObserver(([entrada]) => {
    if (!video.isConnected) return observador.disconnect();
    if (entrada.isIntersecting) video.play().catch(() => {});
    else video.pause();
  }, { threshold: 0.35 });
  observador.observe(video);
}
