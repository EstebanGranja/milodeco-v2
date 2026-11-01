import { esVideo, posterDe } from '../datos/catalogo.js';
import { crear } from '../util.js';
import { iconos } from './iconos.js';

// Visor de fotos a pantalla completa.
//  - Escritorio: flechas o teclado para pasar; click en la foto para ampliar (la foto sigue al mouse);
//    Esc o click en el fondo para cerrar.
//  - Celular: deslizar para pasar; doble toque o pellizco para ampliar y arrastrar para recorrerla;
//    deslizar hacia abajo o el botón "atrás" del teléfono para cerrar.

const ZOOM = 2.5;
const ZOOM_MAXIMO = 4;
const SIN_ZOOM = { escala: 1, x: 0, y: 0 };

let dialogo, escenario, contador, etiqueta;
let medios = [];
let indice = 0;
let opciones = {};
let vista = { ...SIN_ZOOM };
const punteros = new Map();
let gesto = null;
let ultimoToque = null;

export function abrirVisor({ medios: lista, indice: inicial = 0, titulo, etiqueta: textoEtiqueta, alCambiar, alCerrar }) {
  if (!dialogo) iniciar();
  medios = lista;
  opciones = { titulo, etiqueta: textoEtiqueta, alCambiar, alCerrar };
  dialogo.setAttribute('aria-label', `Fotos de ${titulo}`);
  dialogo.showModal();
  // Una entrada en el historial para que "atrás" cierre el visor y no la página
  history.pushState({ ...history.state, visor: true }, '');
  mostrar(inicial);
}

export function cerrarVisor() {
  if (!dialogo?.open) return;
  if (history.state?.visor) history.back(); // el popstate lo oculta
  else ocultar();
}

function iniciar() {
  dialogo = crear(`
    <dialog class="visor">
      <div class="visor-escenario"></div>
      <button class="visor-boton visor-cerrar" type="button" data-accion="cerrar" aria-label="Cerrar">${iconos.cerrar({ tam: 20, grosor: 1.8 })}</button>
      <button class="visor-boton visor-flecha visor-anterior" type="button" data-accion="anterior" aria-label="Foto anterior">${iconos.izquierda({ tam: 22, grosor: 1.8 })}</button>
      <button class="visor-boton visor-flecha visor-siguiente" type="button" data-accion="siguiente" aria-label="Foto siguiente">${iconos.derecha({ tam: 22, grosor: 1.8 })}</button>
      <div class="visor-pie">
        <span class="visor-etiqueta"></span>
        <span class="visor-contador" aria-live="polite"></span>
      </div>
    </dialog>`);
  document.body.append(dialogo);
  escenario = dialogo.querySelector('.visor-escenario');
  contador = dialogo.querySelector('.visor-contador');
  etiqueta = dialogo.querySelector('.visor-etiqueta');

  dialogo.addEventListener('click', (e) => {
    const accion = e.target.closest('[data-accion]')?.dataset.accion;
    if (accion === 'cerrar') cerrarVisor();
    if (accion === 'anterior') mostrar(indice - 1);
    if (accion === 'siguiente') mostrar(indice + 1);
  });
  dialogo.addEventListener('cancel', (e) => {
    e.preventDefault();
    cerrarVisor();
  });
  dialogo.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') mostrar(indice - 1);
    if (e.key === 'ArrowRight') mostrar(indice + 1);
  });
  window.addEventListener('popstate', () => {
    if (dialogo.open && !history.state?.visor) ocultar();
  });
  window.addEventListener('resize', () => {
    if (dialogo.open) fijarVista(SIN_ZOOM);
  });

  escenario.addEventListener('pointerdown', alApoyar);
  escenario.addEventListener('pointermove', alMover);
  escenario.addEventListener('pointerup', alSoltar);
  escenario.addEventListener('pointercancel', alSoltar);
}

function ocultar() {
  escenario.querySelector('video')?.pause();
  escenario.innerHTML = '';
  punteros.clear();
  gesto = null;
  dialogo.close();
  opciones.alCerrar?.();
}

function mostrar(nuevo) {
  const total = medios.length;
  indice = (nuevo + total) % total;
  const src = medios[indice];
  vista = { ...SIN_ZOOM };
  dialogo.classList.remove('con-zoom');
  dialogo.style.removeProperty('--opacidad-fondo');
  escenario.innerHTML = esVideo(src)
    ? `<video class="visor-medio" src="${src}" poster="${posterDe(src)}" controls autoplay muted loop playsinline></video>`
    : `<img class="visor-medio" src="${src}" alt="${opciones.titulo}, foto ${indice + 1}" draggable="false">`;

  contador.textContent = `${indice + 1} / ${total}`;
  const texto = opciones.etiqueta?.(indice);
  etiqueta.textContent = texto || '';
  etiqueta.hidden = !texto;
  dialogo.querySelectorAll('.visor-flecha').forEach((boton) => { boton.hidden = total < 2; });
  contador.hidden = total < 2;

  opciones.alCambiar?.(indice);
  [indice + 1, indice - 1].forEach((i) => {
    const vecina = medios[(i + total) % total];
    if (!esVideo(vecina)) new Image().src = vecina;
  });
}

// ---------- Zoom ----------

const foto = () => escenario.querySelector('img');
const limitar = (n, min, max) => Math.min(max, Math.max(min, n));

// Centro de la foto sin zoom, en coordenadas de la pantalla
function centro() {
  const img = foto();
  const r = escenario.getBoundingClientRect();
  return { x: r.left + img.offsetLeft + img.offsetWidth / 2, y: r.top + img.offsetTop + img.offsetHeight / 2 };
}

// Hasta dónde se puede mover la foto ampliada sin que aparezcan bordes vacíos
function limites(escala) {
  const img = foto();
  return {
    x: Math.max(0, (img.offsetWidth * escala - escenario.clientWidth) / 2),
    y: Math.max(0, (img.offsetHeight * escala - escenario.clientHeight) / 2)
  };
}

function fijarVista({ escala, x, y }, animar = true) {
  const img = foto();
  if (!img) return;
  const max = limites(escala);
  vista = { escala, x: limitar(x, -max.x, max.x), y: limitar(y, -max.y, max.y) };
  img.style.transition = animar ? 'transform 0.3s var(--curva)' : 'none';
  img.style.transform = `translate3d(${vista.x}px, ${vista.y}px, 0) scale(${vista.escala})`;
  dialogo.classList.toggle('con-zoom', vista.escala > 1);
}

// Con el mouse, la foto ampliada se recorre moviendo el cursor
function vistaSegunCursor(escala, cx, cy) {
  const r = escenario.getBoundingClientRect();
  const max = limites(escala);
  return { escala, x: -((cx - r.left) / r.width - 0.5) * 2 * max.x, y: -((cy - r.top) / r.height - 0.5) * 2 * max.y };
}

// Amplía dejando quieto el punto tocado, o vuelve al tamaño normal
function alternarZoom(px, py, conMouse) {
  if (vista.escala > 1) return fijarVista(SIN_ZOOM);
  if (conMouse) return fijarVista(vistaSegunCursor(ZOOM, px, py));
  const c = centro();
  fijarVista({ escala: ZOOM, x: (px - c.x) * (1 - ZOOM), y: (py - c.y) * (1 - ZOOM) });
}

// ---------- Gestos ----------

const distancia = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const puntoMedio = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

function alApoyar(e) {
  if (e.target.closest('video')) return; // los controles del video funcionan solos
  if (e.pointerType === 'mouse') {
    gesto = { tipo: 'clic', x: e.clientX, y: e.clientY, objetivo: e.target };
    return;
  }
  escenario.setPointerCapture(e.pointerId);
  punteros.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (punteros.size === 2 && foto()) {
    const [a, b] = [...punteros.values()];
    gesto = { tipo: 'pellizco', distancia: distancia(a, b), medio: puntoMedio(a, b), vista: { ...vista } };
  } else if (punteros.size === 1) {
    gesto = { tipo: 'arrastre', x: e.clientX, y: e.clientY, vista: { ...vista }, objetivo: e.target, movio: false };
  }
}

function alMover(e) {
  if (e.pointerType === 'mouse') {
    if (vista.escala > 1 && foto()) fijarVista(vistaSegunCursor(vista.escala, e.clientX, e.clientY), false);
    return;
  }
  if (!punteros.has(e.pointerId)) return;
  punteros.set(e.pointerId, { x: e.clientX, y: e.clientY });

  if (gesto?.tipo === 'pellizco' && punteros.size >= 2) {
    const [a, b] = [...punteros.values()];
    const g = gesto;
    const escala = limitar((g.vista.escala * distancia(a, b)) / g.distancia, 1, ZOOM_MAXIMO);
    const c = centro();
    const m = puntoMedio(a, b);
    // El punto de la foto que estaba entre los dedos sigue entre los dedos
    const qx = (g.medio.x - c.x - g.vista.x) / g.vista.escala;
    const qy = (g.medio.y - c.y - g.vista.y) / g.vista.escala;
    fijarVista({ escala, x: m.x - c.x - qx * escala, y: m.y - c.y - qy * escala }, false);
    return;
  }

  if (gesto?.tipo !== 'arrastre') return;
  const dx = e.clientX - gesto.x;
  const dy = e.clientY - gesto.y;
  if (!gesto.movio && Math.abs(dx) + Math.abs(dy) < 8) return;
  gesto.movio = true;
  if (vista.escala > 1) {
    fijarVista({ escala: vista.escala, x: gesto.vista.x + dx, y: gesto.vista.y + dy }, false);
  } else {
    // Sin zoom, la foto acompaña al dedo: de costado para pasar, hacia abajo para cerrar
    const medio = escenario.querySelector('.visor-medio');
    const haciaAbajo = dy > 0 && Math.abs(dy) > Math.abs(dx);
    medio.style.transition = 'none';
    medio.style.transform = haciaAbajo ? `translate3d(0, ${dy}px, 0)` : `translate3d(${dx}px, 0, 0)`;
    dialogo.style.setProperty('--opacidad-fondo', haciaAbajo ? Math.max(0.4, 0.97 - dy / 500) : 0.97);
  }
}

function alSoltar(e) {
  if (e.pointerType === 'mouse') {
    const g = gesto;
    gesto = null;
    if (g?.tipo !== 'clic' || Math.hypot(e.clientX - g.x, e.clientY - g.y) > 6) return;
    if (g.objetivo.closest('img')) alternarZoom(e.clientX, e.clientY, true);
    else if (g.objetivo === escenario) cerrarVisor();
    return;
  }

  if (!punteros.has(e.pointerId)) return;
  punteros.delete(e.pointerId);

  if (gesto?.tipo === 'pellizco') {
    if (punteros.size) {
      // Queda un dedo apoyado: sigue moviendo la foto
      const [p] = [...punteros.values()];
      gesto = { tipo: 'arrastre', x: p.x, y: p.y, vista: { ...vista }, objetivo: escenario, movio: true };
    } else {
      gesto = null;
      if (vista.escala < 1.05) fijarVista(SIN_ZOOM);
    }
    return;
  }
  if (gesto?.tipo !== 'arrastre') return;

  const g = gesto;
  gesto = null;
  const dx = e.clientX - g.x;
  const dy = e.clientY - g.y;

  if (g.movio) {
    if (vista.escala > 1) return;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) return mostrar(indice + (dx < 0 ? 1 : -1));
    if (dy > 110 && dy > Math.abs(dx)) return cerrarVisor();
    // No alcanzó: vuelve a su lugar
    const medio = escenario.querySelector('.visor-medio');
    medio.style.transition = 'transform 0.25s var(--curva)';
    medio.style.transform = '';
    dialogo.style.removeProperty('--opacidad-fondo');
    return;
  }

  // Un toque sin moverse: en el fondo cierra, en la foto el doble toque amplía
  if (!g.objetivo.closest('img')) {
    if (g.objetivo === escenario) cerrarVisor();
    return;
  }
  const ahora = Date.now();
  if (ultimoToque && ahora - ultimoToque.t < 320 && Math.hypot(e.clientX - ultimoToque.x, e.clientY - ultimoToque.y) < 40) {
    ultimoToque = null;
    alternarZoom(e.clientX, e.clientY, false);
  } else {
    ultimoToque = { t: ahora, x: e.clientX, y: e.clientY };
  }
}
