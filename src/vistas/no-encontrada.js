import { crear } from '../util.js';
import { iconos } from '../componentes/iconos.js';

export function vistaNoEncontrada() {
  return crear(`
    <section class="no-encontrada contenedor">
      <h1 class="titulo-seccion">Esta página no existe</h1>
      <p>Puede que el link haya cambiado o que la pieza ya no esté.</p>
      <a class="boton" href="/catalogo">Ver catálogo ${iconos.flecha()}</a>
    </section>`);
}
