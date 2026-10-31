import { portadaDe, resumenDe, resumenPrecio, urlProducto } from '../datos/catalogo.js';
import { iconos } from './iconos.js';

// Tarjeta de producto de las grillas (inicio y categorías)
export function tarjetaProducto(categoria, producto) {
  const { desde, precio, detalle } = resumenPrecio(producto);
  return `
    <a class="tarjeta" href="${urlProducto(categoria, producto)}">
      <div class="tarjeta-foto">
        <img src="${portadaDe(producto)}" alt="${producto.nombre}" loading="lazy">
        ${producto.nota ? `<span class="cinta">${producto.nota}</span>` : ''}
        <span class="tarjeta-ver" aria-hidden="true">Ver producto ${iconos.flecha({ tam: 16, grosor: 1.8 })}</span>
      </div>
      <h3 class="tarjeta-nombre">${producto.nombre}</h3>
      <p class="tarjeta-resumen">${resumenDe(producto)}</p>
      <div class="tarjeta-pie">
        <span class="tarjeta-precio">${desde ? `<span class="tarjeta-desde">${desde}</span>` : ''}${precio}</span>
        <span class="tarjeta-detalle">${detalle}</span>
      </div>
    </a>`;
}
