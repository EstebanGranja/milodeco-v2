import { categorias } from '../datos/catalogo.js';
import { sitio } from '../datos/sitio.js';
import { linkWhatsApp } from '../util.js';
import { iconos } from './iconos.js';
import { abrirCarrito, alCambiarCarrito, contarItems } from './carrito.js';

const menu = [
  { id: 'inicio', nombre: 'Inicio', href: '/' },
  ...categorias.map((c) => ({ id: c.id, nombre: c.nombre, href: `/${c.id}` })),
  { id: 'sobre-mi', nombre: 'Sobre mí', href: '/#sobre-mi' }
];

// Barra de anuncio + encabezado (fijo arriba) + menú deslizable del celular
export function crearEncabezado() {
  const plantilla = document.createElement('template');
  plantilla.innerHTML = `
    ${sitio.anuncio ? `
      <a class="anuncio" href="${sitio.anuncio.link}">
        ${sitio.anuncio.texto} <span aria-hidden="true">·</span> <span class="anuncio-accion">${sitio.anuncio.accion}</span>
      </a>` : ''}
    <header class="encabezado">
      <div class="encabezado-contenido contenedor">
        <a class="marca" href="/" aria-label="Milodeco, ir al inicio">
          <img src="/img/logo.webp" alt="" width="44" height="44">
          <span class="marca-texto" aria-hidden="true">
            <span class="marca-nombre">Milodeco</span>
            <span class="marca-firma">hecho a mano por Silvana</span>
          </span>
        </a>
        <nav class="menu-principal" aria-label="Menú principal">
          ${menu.map((m) => `<a class="menu-link" href="${m.href}" data-menu="${m.id}">${m.nombre}</a>`).join('')}
        </nav>
        <div class="encabezado-acciones">
          <a class="boton-redondo solo-escritorio" href="${sitio.instagram}" target="_blank" rel="noopener" aria-label="Mi Instagram">${iconos.instagram({ tam: 19 })}</a>
          <a class="boton-redondo" href="${linkWhatsApp()}" target="_blank" rel="noopener" aria-label="Mi WhatsApp">${iconos.whatsappCompleto({ tam: 19 })}</a>
          <button class="boton-carrito" type="button" data-abrir-carrito>
            ${iconos.carrito()}
            <span class="boton-carrito-texto">Carrito</span>
            <span class="burbuja" hidden></span>
          </button>
        </div>
      </div>
    </header>
    <nav class="menu-movil" aria-label="Menú">
      ${menu.map((m) => `<a class="pastilla" href="${m.href}" data-menu="${m.id}">${m.nombre}</a>`).join('')}
    </nav>`;

  const fragmento = plantilla.content;
  const botonCarrito = fragmento.querySelector('.boton-carrito');
  botonCarrito.addEventListener('click', abrirCarrito);
  alCambiarCarrito(() => actualizarBotonCarrito(botonCarrito));
  return fragmento;
}

// Número del carrito; "salta" cuando se agrega algo
export function actualizarBotonCarrito(boton) {
  const cantidad = contarItems();
  const burbuja = boton.querySelector('.burbuja');
  const antes = Number(burbuja.textContent) || 0;
  burbuja.textContent = cantidad;
  burbuja.hidden = cantidad === 0;
  boton.setAttribute('aria-label', cantidad ? `Carrito, ${cantidad} ${cantidad === 1 ? 'producto' : 'productos'}` : 'Carrito vacío');
  if (cantidad > antes) {
    boton.classList.remove('salta');
    void boton.offsetWidth;
    boton.classList.add('salta');
  }
}

// Marca en el menú dónde está parada la persona
export function marcarMenu(id) {
  document.querySelectorAll('[data-menu]').forEach((link) => {
    if (link.dataset.menu === id) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  // En el celular, el menú deslizable centra la opción activa
  const menuMovil = document.querySelector('.menu-movil');
  const activo = menuMovil?.querySelector('[aria-current="page"]');
  if (activo) {
    menuMovil.scrollTo({ left: activo.offsetLeft - (menuMovil.clientWidth - activo.offsetWidth) / 2 });
  }
}
