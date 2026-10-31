import { categorias, portadaDe, precioMinimo, todosLosProductos } from '../datos/catalogo.js';
import { crear, linkWhatsApp } from '../util.js';
import { iconos } from '../componentes/iconos.js';
import { tarjetaProducto } from '../componentes/tarjeta.js';

const ordenes = {
  destacados: () => 0,
  'menor-precio': (a, b) => (precioMinimo(a.producto) ?? Infinity) - (precioMinimo(b.producto) ?? Infinity),
  'mayor-precio': (a, b) => (precioMinimo(b.producto) ?? -Infinity) - (precioMinimo(a.producto) ?? -Infinity)
};

// Página de una categoría. Sin categoría muestra el catálogo completo (/catalogo).
export function vistaCategoria(categoria) {
  const items = categoria
    ? categoria.productos.map((producto) => ({ categoria, producto }))
    : todosLosProductos();
  const titulo = categoria ? categoria.nombre : 'Catálogo';
  const subtitulo = categoria ? categoria.subtitulo : 'todo lo que hago';
  const descripcion = categoria
    ? categoria.descripcion
    : 'Todas mis piezas juntas. Tocá la que te guste para ver medidas, opciones y precios.';

  // Tres fotos en arco al lado del título: el primer producto va en el medio, más grande
  const arcos = [items[1], items[0], items[2]].filter(Boolean).map(({ producto }) => portadaDe(producto));
  const notaArcos = items[0]?.producto.nota;

  const pastilla = (href, nombre, cantidad, activa) =>
    `<a class="pastilla" href="${href}" ${activa ? 'aria-current="page"' : ''}>${nombre} <span class="pastilla-cantidad">${cantidad}</span></a>`;

  const vista = crear(`
    <div class="categoria">
      <section class="categoria-cabecera contenedor">
        <nav class="migas" aria-label="Estás en">
          <a href="/">Inicio</a><span aria-hidden="true">/</span><span aria-current="page">${titulo}</span>
        </nav>
        <div class="categoria-intro">
          <div class="categoria-intro-texto">
            <div class="categoria-titulo">
              <h1>${titulo}</h1>
              <span class="categoria-subtitulo">${subtitulo}</span>
            </div>
            <p class="categoria-descripcion">${descripcion}</p>
          </div>
          <div class="arcos" aria-hidden="true">
            ${arcos.map((src) => `<span class="arco"><img src="${src}" alt=""></span>`).join('')}
            ${notaArcos ? `<span class="arcos-nota">${notaArcos}</span>
              <svg class="arcos-flecha" width="34" height="30" viewBox="0 0 34 30" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4 C 16 6, 26 12, 28 26"/><path d="M22 20 L28 27 L32 19"/></svg>` : ''}
          </div>
        </div>

        <div class="categoria-filtros">
          <nav class="pastillas" aria-label="Categorías">
            ${pastilla('/catalogo', 'Todo', todosLosProductos().length, !categoria)}
            ${categorias.map((c) => pastilla(`/${c.id}`, c.nombre, c.productos.length, c === categoria)).join('')}
          </nav>
          <div class="orden">
            <span class="orden-cantidad">${items.length} piezas</span>
            <label for="orden">Ordenar por</label>
            <select id="orden">
              <option value="destacados">Destacados</option>
              <option value="menor-precio">Menor precio</option>
              <option value="mayor-precio">Mayor precio</option>
            </select>
          </div>
        </div>
      </section>

      <section class="contenedor categoria-productos" aria-label="Productos">
        <div class="grilla-productos"></div>
      </section>

      <section class="contenedor categoria-ayuda">
        <div class="nota-papel nota-papel-ancha">
          <span class="washi washi-blanca" style="left: 60px; top: -13px; transform: rotate(-3deg)" aria-hidden="true"></span>
          <span class="washi washi-blanca" style="right: 70px; bottom: -13px; transform: rotate(4deg)" aria-hidden="true"></span>
          <div>
            <p class="nota-papel-titulo">¿Tenés dudas? Preguntame lo que quieras</p>
            <p>Te cuento medidas, colores y cuánto tarda cada pieza. Y si tenés una idea para tu casa, también la charlamos.</p>
          </div>
          <a class="boton" href="${linkWhatsApp()}" target="_blank" rel="noopener">${iconos.whatsapp()} Escribime por WhatsApp</a>
        </div>
      </section>
    </div>`);

  const grilla = vista.querySelector('.grilla-productos');
  const pintar = (orden) => {
    grilla.innerHTML = [...items].sort(ordenes[orden]).map((i) => tarjetaProducto(i.categoria, i.producto)).join('');
  };
  vista.querySelector('#orden').addEventListener('change', (e) => pintar(e.target.value));
  pintar('destacados');
  return vista;
}
