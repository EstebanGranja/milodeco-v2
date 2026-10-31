import './estilos/base.css';
import './estilos/encabezado.css';
import './estilos/tarjeta.css';
import './estilos/inicio.css';
import './estilos/categoria.css';
import './estilos/producto.css';
import './estilos/carrito.css';
import './estilos/pie.css';

import { iniciarRouter, irAlAncla, leerRuta, navegar } from './router.js';
import { crearEncabezado, marcarMenu } from './componentes/encabezado.js';
import { crearPie } from './componentes/pie.js';
import { cerrarCarrito, iniciarCarrito } from './componentes/carrito.js';
import { abrirProducto, cerrarProducto, iniciarProducto } from './componentes/producto.js';
import { vistaInicio } from './vistas/inicio.js';
import { vistaCategoria } from './vistas/categoria.js';
import { vistaNoEncontrada } from './vistas/no-encontrada.js';

const app = document.getElementById('app');

iniciarCarrito();
iniciarProducto({ cerrar: salirDelProducto });
document.getElementById('encabezado').replaceWith(crearEncabezado());
document.getElementById('pie').replaceWith(crearPie());

// La página que se ve de fondo (el producto se abre encima de ella)
let fondo = null; // { clave, url }

function claveDe(ruta) {
  if (ruta.vista === 'categoria') return `categoria:${ruta.categoria?.id ?? 'todo'}`;
  return ruta.vista === 'no-encontrada' ? `no-encontrada:${location.pathname}` : ruta.vista;
}

function urlDe(ruta) {
  if (ruta.vista === 'inicio') return '/';
  if (ruta.vista === 'categoria') return ruta.categoria ? `/${ruta.categoria.id}` : '/catalogo';
  return location.pathname;
}

function mostrarFondo(ruta) {
  const vista = ruta.vista === 'inicio' ? vistaInicio()
    : ruta.vista === 'categoria' ? vistaCategoria(ruta.categoria)
    : vistaNoEncontrada();
  app.replaceChildren(vista);
  fondo = { clave: claveDe(ruta), url: urlDe(ruta) };
}

function tituloDe(ruta) {
  if (ruta.vista === 'producto') return `${ruta.producto.nombre} · Milodeco`;
  if (ruta.vista === 'categoria') return `${ruta.categoria?.nombre ?? 'Catálogo'} · Milodeco`;
  if (ruta.vista === 'no-encontrada') return 'No encontré esa página · Milodeco';
  return 'Milodeco · Deco tejida a mano en hierro y papel kraft';
}

function render({ porHistorial = false }) {
  cerrarCarrito();
  const ruta = leerRuta();
  document.title = tituloDe(ruta);

  if (ruta.vista === 'producto') {
    // Si se entra directo al link de un producto, de fondo va su categoría
    if (!fondo) mostrarFondo({ vista: 'categoria', categoria: ruta.categoria });
    abrirProducto(ruta.categoria, ruta.producto);
    marcarMenu(ruta.categoria.id);
    return;
  }

  cerrarProducto();
  const cambioDePagina = fondo?.clave !== claveDe(ruta);
  if (cambioDePagina) mostrarFondo(ruta);
  marcarMenu(ruta.vista === 'inicio' ? 'inicio' : ruta.categoria?.id);

  if (location.hash) irAlAncla(location.hash, { suave: !cambioDePagina });
  else if (cambioDePagina) window.scrollTo(0, porHistorial ? history.state?.scroll ?? 0 : 0);
}

// Cerrar el producto: si se abrió desde la web, "atrás" vuelve justo a donde estaba
function salirDelProducto(destino = fondo.url) {
  if (history.state?.desdeLaWeb && destino === fondo.url) history.back();
  else navegar(destino, { reemplazar: destino === fondo.url });
}

iniciarRouter(render);
