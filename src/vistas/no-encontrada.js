import { crear } from '../util.js';
import { iconos } from '../componentes/iconos.js';

export function vistaNoEncontrada() {
  return crear(`
    <section class="no-encontrada contenedor">
      <p class="saludo">¡Uy! Esto no está</p>
      <h1 class="titulo-seccion">No encontré esa página</h1>
      <p>Capaz el link cambió o esa pieza ya no la hago. Pero hay un montón de cositas más para ver.</p>
      <a class="boton" href="/catalogo">Ver el catálogo ${iconos.flecha()}</a>
    </section>`);
}
