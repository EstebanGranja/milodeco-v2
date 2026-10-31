import { buscarCategoria, buscarProducto } from './datos/catalogo.js';

// Rutas del sitio:
//   /                       inicio
//   /catalogo               todos los productos
//   /deco                   una categoría
//   /deco/arbolitos-de-navidad   un producto (se abre sobre la página en la que estabas)

export function leerRuta(ruta = location.pathname) {
  const [primero, segundo, ...resto] = decodeURI(ruta).split('/').filter(Boolean);
  if (!primero) return { vista: 'inicio' };
  if (primero === 'catalogo' && !segundo) return { vista: 'categoria', categoria: null };

  const categoria = buscarCategoria(primero);
  if (!categoria || resto.length) return { vista: 'no-encontrada' };
  if (!segundo) return { vista: 'categoria', categoria };

  const producto = buscarProducto(categoria, segundo);
  return producto ? { vista: 'producto', categoria, producto } : { vista: 'no-encontrada' };
}

let pintar = () => {};

export function iniciarRouter(alCambiarDeRuta) {
  pintar = alCambiarDeRuta;
  history.scrollRestoration = 'manual';
  document.addEventListener('click', interceptarLinks);
  window.addEventListener('popstate', () => pintar({ porHistorial: true }));
  pintar({});
}

export function navegar(url, { reemplazar = false } = {}) {
  // Guarda la posición del scroll para volver al mismo lugar con "atrás"
  history.replaceState({ ...history.state, scroll: window.scrollY }, '');
  const estado = { desdeLaWeb: true };
  if (reemplazar) history.replaceState(estado, '', url);
  else history.pushState(estado, '', url);
  pintar({});
}

export function irAlAncla(hash, { suave = true } = {}) {
  const destino = hash && document.getElementById(decodeURIComponent(hash.slice(1)));
  if (destino) destino.scrollIntoView({ behavior: suave ? 'smooth' : 'instant' });
}

// Los links internos cambian de página sin recargar
function interceptarLinks(e) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const link = e.target.closest('a[href]');
  if (!link || link.target || link.hasAttribute('download')) return;
  const url = new URL(link.href, location.href);
  if (url.origin !== location.origin) return;

  e.preventDefault();
  if (url.pathname === location.pathname && url.search === location.search) {
    // Mismo lugar: solo se mueve hasta el ancla, o vuelve arriba
    if (url.hash) {
      history.replaceState(history.state, '', url.hash);
      irAlAncla(url.hash);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return;
  }
  navegar(url.pathname + url.search + url.hash);
}
