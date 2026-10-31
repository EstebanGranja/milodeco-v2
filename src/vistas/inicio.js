import { buscarCategoria, buscarProducto, categorias, contarPiezas } from '../datos/catalogo.js';
import { sitio } from '../datos/sitio.js';
import { crear, linkWhatsApp } from '../util.js';
import { iconos, puntada } from '../componentes/iconos.js';
import { tarjetaProducto } from '../componentes/tarjeta.js';

const pasos = [
  ['Elegí lo que te guste', 'Mirá las opciones y medidas de cada pieza y sumalas al carrito.'],
  ['Armá tu pedido', 'En el carrito ves el total y podés cambiar lo que quieras.'],
  ['Me escribís y charlamos', 'Con un toque me llega tu pedido por WhatsApp y acordamos el pago y la entrega.']
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
      <!-- Portada: saludo + categorías -->
      <section class="portada contenedor">
        <div class="portada-texto">
          <p class="saludo">¡Hola! Pasá, que te muestro ${iconos.corazon(32)}</p>
          <h1 class="portada-titulo">Soy Silvana y tejo <span class="resaltado"><em>cositas lindas</em>${iconos.subrayado()}</span> para tu casa.</h1>
          <p class="portada-bajada">Espejos, lámparas, canastos y mil cosas más que hago a mano, una por una, en mi casa de campo en Villa San Isidro.</p>
          <div class="portada-botones">
            <a class="boton" href="/catalogo">Ver todo el catálogo ${iconos.flecha()}</a>
            <a class="boton boton-borde solo-escritorio" href="${linkWhatsApp()}" target="_blank" rel="noopener">${iconos.whatsapp()} Escribime</a>
          </div>
          <ul class="lista-mano">
            <li>${iconos.tilde()} todo tejido a mano</li>
            <li>${iconos.tilde()} con hierro y papel kraft</li>
            <li>${iconos.tilde()} te lo tengo en 10 a 15 días</li>
          </ul>
        </div>

        <div class="portada-categorias">
          <p class="nota-mano" aria-hidden="true">¿qué andás buscando? elegí por acá ${iconos.flechaMano()}</p>
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
        </div>
      </section>

      ${puntada}

      <!-- Preferidas -->
      <section class="seccion contenedor">
        <div class="seccion-encabezado">
          <div>
            <h2 class="titulo-seccion">Algunas de mis preferidas</h2>
            <p class="seccion-nota">(aunque las quiero a todas)</p>
          </div>
          <a class="link-subrayado" href="/catalogo">Ver todo lo que hago →</a>
        </div>
        <div class="grilla-productos">${destacados.join('')}</div>
      </section>

      ${t ? `
        <!-- Temporada -->
        <section class="contenedor seccion-temporada">
          <div class="temporada">
            <div class="temporada-texto">
              <p class="temporada-frase">${t.frase}</p>
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
              <span class="estrellita" style="left: 4%; top: 8%">${iconos.estrella(22)}</span>
              <span class="estrellita" style="left: 12%; top: 20%; opacity: 0.5">${iconos.estrella(13)}</span>
              <span class="estrellita" style="right: 2%; bottom: 10%">${iconos.estrella(16)}</span>
            </div>
          </div>
        </section>` : ''}

      <!-- Sobre mí -->
      <section id="sobre-mi" class="sobre-mi contenedor">
        <div class="sobre-mi-fotos">
          <figure class="polaroid polaroid-silvana">
            <span class="washi polaroid-washi" aria-hidden="true"></span>
            <span class="polaroid-foto">
              <video src="/videos/silvana-taller.mp4" poster="/img/silvana-taller.jpg" muted loop playsinline preload="none" aria-label="Silvana trabajando el hierro en su taller"></video>
            </span>
            <figcaption class="polaroid-epigrafe">¡esta soy yo!</figcaption>
          </figure>
          <figure class="polaroid polaroid-pared">
            <span class="washi polaroid-washi" aria-hidden="true"></span>
            <span class="polaroid-foto"><img src="/img/lampara_41.webp" alt="Capelina Río y espejos tejidos colgados en la pared" loading="lazy"></span>
            <figcaption class="polaroid-epigrafe">la pared de los espejos</figcaption>
          </figure>
        </div>
        <div class="sobre-mi-texto">
          <h2 class="titulo-seccion">Un rincón en el campo, <em>mucho amor</em> y papel kraft</h2>
          <p class="sobre-mi-bajada">Vivo en una casa de campo en Villa San Isidro, donde la naturaleza y la tranquilidad me inspiran todos los días. Ahí hago todo lo que ves en la página, y muchas cositas más que van surgiendo día a día.</p>
          <div class="nota-papel">
            <span class="washi washi-blanca" aria-hidden="true"></span>
            <p class="nota-papel-titulo">¿Querés aprender a tejer conmigo?</p>
            <p>Hago talleres en mi casa: tejemos la pieza que te vas a llevar, aprendemos técnicas y secretos, nos reímos un montón y comemos rico.</p>
            <a class="boton boton-mediano" href="${linkWhatsApp('¡Hola Silvana! Quiero que me cuentes de los talleres de tejido.')}" target="_blank" rel="noopener">Escribime y te cuento</a>
          </div>
          <p class="firma firma-grande">Silvana ${iconos.corazon(30)}</p>
        </div>
      </section>

      <!-- Cómo me comprás -->
      <section class="como-comprar">
        <div class="contenedor">
          <div class="como-comprar-encabezado">
            <h2 class="titulo-seccion">¿Cómo me comprás?</h2>
            <p class="seccion-nota">es re fácil, te prometo</p>
          </div>
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
