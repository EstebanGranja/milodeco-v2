import { categorias } from '../datos/catalogo.js';
import { sitio } from '../datos/sitio.js';
import { crear, linkWhatsApp } from '../util.js';

export function crearPie() {
  return crear(`
    <footer class="pie">
      <div class="pie-columnas contenedor">
        <div class="pie-saludo">
          <p class="pie-gracias">¡Gracias por pasar!</p>
          <p>Si algo te gustó o tenés una idea, escribime. Me encanta charlar sobre lo que hago.</p>
          <p class="pie-firma">Silvana</p>
        </div>
        <nav class="pie-lista" aria-label="Lo que hago">
          <p class="pie-titulo">Lo que hago</p>
          ${categorias.map((c) => `<a href="/${c.id}">${c.nombre}</a>`).join('')}
        </nav>
        <div class="pie-lista">
          <p class="pie-titulo">Hablemos</p>
          <a href="${linkWhatsApp()}" target="_blank" rel="noopener">WhatsApp · ${sitio.whatsappTexto}</a>
          <a href="${sitio.instagram}" target="_blank" rel="noopener">Instagram · ${sitio.instagramUsuario}</a>
          <a href="${sitio.facebook}" target="_blank" rel="noopener">Facebook · Milodeco</a>
          <a href="/#sobre-mi">Talleres de tejido</a>
        </div>
        <div class="pie-logo">
          <img src="/img/logo.webp" alt="Milodeco" width="84" height="84" loading="lazy">
          <span>Deco en hierro y papel kraft</span>
        </div>
      </div>
      <div class="pie-legal contenedor">
        <span>© ${new Date().getFullYear()} Milodeco · Hecho a mano por Silvana Lerda</span>
        <span>Villa San Isidro</span>
      </div>
    </footer>`);
}
