import { categorias } from '../datos/catalogo.js';
import { sitio } from '../datos/sitio.js';
import { crear, linkWhatsApp } from '../util.js';

export function crearPie() {
  return crear(`
    <footer class="pie">
      <div class="pie-columnas contenedor">
        <div class="pie-marca">
          <img src="/img/logo.webp" alt="" width="56" height="56" loading="lazy">
          <p class="pie-gracias">¡Gracias por pasar!</p>
          <p>Milodeco · Deco tejida a mano en hierro y papel kraft.</p>
        </div>
        <nav class="pie-lista" aria-label="Catálogo">
          <p class="pie-titulo">Catálogo</p>
          ${categorias.map((c) => `<a href="/${c.id}">${c.nombre}</a>`).join('')}
        </nav>
        <div class="pie-lista">
          <p class="pie-titulo">Contacto</p>
          <a href="${linkWhatsApp()}" target="_blank" rel="noopener">WhatsApp · ${sitio.whatsappTexto}</a>
          <a href="${sitio.instagram}" target="_blank" rel="noopener">Instagram · ${sitio.instagramUsuario}</a>
          <a href="${sitio.facebook}" target="_blank" rel="noopener">Facebook</a>
        </div>
      </div>
      <div class="pie-legal contenedor">
        <span>© ${new Date().getFullYear()} Milodeco · Silvana Lerda</span>
        <span>Villa San Isidro</span>
      </div>
    </footer>`);
}
