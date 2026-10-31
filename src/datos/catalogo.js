import datos from './catalogo.json';
import { pesos } from '../util.js';

export const categorias = datos.categorias;

export function buscarCategoria(id) {
  return categorias.find((c) => c.id === id) || null;
}

export function buscarProducto(categoria, slug) {
  return categoria?.productos.find((p) => p.slug === slug) || null;
}

export function todosLosProductos() {
  return categorias.flatMap((categoria) => categoria.productos.map((producto) => ({ categoria, producto })));
}

export function esVideo(src) {
  return /\.(mp4|webm|ogg)$/i.test(src);
}

// Primera foto del producto (los videos no sirven de portada)
export function portadaDe(producto) {
  return producto.imagenes.find((src) => !esVideo(src));
}

// Primera oración de la descripción, para las tarjetas
export function resumenDe(producto) {
  const match = producto.descripcion.match(/^.*?[.!?](\s|$)/);
  return (match ? match[0] : producto.descripcion).trim();
}

// Precio más bajo del producto; null si es a consultar
export function precioMinimo(producto) {
  if (producto.colores) {
    return Math.min(...producto.colores.flatMap((c) => c.grosores.map((g) => g.precio)));
  }
  const precios = producto.opciones.map((o) => o.precio).filter((p) => typeof p === 'number');
  return precios.length ? Math.min(...precios) : null;
}

// Lo que muestran las tarjetas debajo del nombre: "desde $47.000 · 4 medidas"
export function resumenPrecio(producto) {
  const minimo = precioMinimo(producto);
  if (minimo === null) return { desde: '', precio: 'A consultar', detalle: 'A pedido' };

  if (producto.venta) {
    return { desde: 'desde', precio: pesos(minimo), detalle: `cada ${producto.venta.precioCada} ${producto.venta.unidad}` };
  }

  const cantidad = producto.opciones.length;
  const tipo = (producto.tituloOpciones || 'Medidas').toLowerCase();
  const hayVariosPrecios = new Set(producto.opciones.map((o) => o.precio)).size > 1;
  return {
    desde: hayVariosPrecios ? 'desde' : '',
    precio: pesos(minimo),
    detalle: cantidad > 1 ? `${cantidad} ${tipo}` : 'Medida única'
  };
}

export function contarPiezas(categoria) {
  return categoria.cantidadTexto || `${categoria.productos.length} piezas`;
}

export function urlProducto(categoria, producto) {
  return `/${categoria.id}/${producto.slug}`;
}
