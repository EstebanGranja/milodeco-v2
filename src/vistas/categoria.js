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
  const descripcion = categoria ? categoria.descripcion : 'Todas las piezas, en un solo lugar.';

  // Tres fotos en arco al lado del título: el primer producto va en el medio, más grande
  const arcos = [items[1], items[0], items[2]].filter(Boolean).map(({ producto }) => portadaDe(producto));

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
            <h1 class="categoria-titulo">${titulo}</h1>
            <p class="categoria-descripcion">${descripcion}</p>
          </div>
          <div class="arcos" aria-hidden="true">
            ${arcos.map((src) => `<span class="arco"><img src="${src}" alt=""></span>`).join('')}
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
        <div class="ayuda">
          <span class="washi washi-blanca" aria-hidden="true"></span>
          <div>
            <h2 class="ayuda-titulo">¿Dudas con una medida o un color?</h2>
            <p>Escribime y lo vemos.</p>
          </div>
          <a class="boton" href="${linkWhatsApp()}" target="_blank" rel="noopener">${iconos.whatsapp()} Consultar por WhatsApp</a>
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
