import { esVideo, portadaDe } from '../datos/catalogo.js';
import { crear, linkWhatsApp, pesos } from '../util.js';
import { iconos } from './iconos.js';
import { abrirCarrito, agregarAlCarrito, alCambiarCarrito } from './carrito.js';
import { actualizarBotonCarrito } from './encabezado.js';

// Ficha de producto: en escritorio es un modal sobre la página; en el celular ocupa toda la pantalla.
// Funciona con tres tipos de producto:
//  - con opciones (medidas): cada opción tiene nombre y precio; si la opción tiene "imagen",
//    elegirla muestra su foto y pasar las fotos elige la opción (como los arbolitos)
//  - por metro (papel kraft): color → grosor → metros
//  - sin opciones: precio a consultar

let dialogo = null;
let alCerrar = () => {};
let actual = null; // { categoria, producto, estado }
let timerAgregado = null;

export function iniciarProducto({ cerrar }) {
  alCerrar = cerrar;
  dialogo = crear('<dialog class="producto" aria-labelledby="producto-titulo"></dialog>');
  document.body.append(dialogo);

  dialogo.addEventListener('cancel', (e) => {
    e.preventDefault();
    alCerrar();
  });
  // Click en el fondo oscuro (y no en la barra de scroll del modal)
  dialogo.addEventListener('click', (e) => {
    if (e.target === dialogo && e.offsetX < dialogo.clientWidth) alCerrar();
  });
  dialogo.addEventListener('close', () => {
    dialogo.querySelectorAll('video').forEach((v) => v.pause());
    clearTimeout(timerAgregado);
    actual = null;
  });
  dialogo.addEventListener('keydown', (e) => {
    if (!actual || e.target.closest('input, select, textarea')) return;
    if (e.key === 'ArrowLeft') irAFoto(actual.estado.foto - 1);
    if (e.key === 'ArrowRight') irAFoto(actual.estado.foto + 1);
  });

  alCambiarCarrito(() => {
    const boton = dialogo.querySelector('.producto-barra .boton-carrito');
    if (boton) actualizarBotonCarrito(boton);
  });
}

export function abrirProducto(categoria, producto) {
  if (actual?.producto === producto && dialogo.open) return;
  actual = { categoria, producto, estado: estadoInicial(producto) };
  dialogo.innerHTML = plantilla(categoria, producto);
  conectar();
  if (!dialogo.open) dialogo.showModal();
  // El foco va al título (para lectores de pantalla) sin mover la ficha
  dialogo.querySelector('#producto-titulo').focus({ preventScroll: true });
  dialogo.scrollTop = 0;
  actualizar({ animar: false });
  actualizarBotonCarrito(dialogo.querySelector('.producto-barra .boton-carrito'));
}

export function cerrarProducto() {
  if (dialogo?.open) dialogo.close();
}

function estadoInicial(producto) {
  const estado = { foto: 0, cantidad: 1, opcion: producto.opciones?.length ? 0 : null, agregado: false };
  if (producto.colores) {
    estado.color = 0;
    estado.grosor = Math.max(0, producto.colores[0].grosores.findIndex((g) => g.inicial));
    estado.cantidad = producto.venta.inicial;
  }
  return estado;
}

// ---------- Marcado ----------

function plantilla(categoria, producto) {
  const medios = producto.imagenes;
  const variasFotos = medios.length > 1;
  const conEtiquetas = producto.opciones?.some((o) => o.imagen);
  const consulta = linkWhatsApp(`Hola Silvana, te consulto por ${producto.nombre}.`);

  return `
    <div class="producto-caja">
      <div class="producto-barra solo-movil">
        <a class="producto-volver" href="/${categoria.id}" data-volver>${iconos.izquierda({ tam: 20, grosor: 1.8 })} ${categoria.nombre}</a>
        <span class="producto-barra-firma" aria-hidden="true">hecho a mano por Silvana</span>
        <button class="boton-carrito boton-carrito-claro" type="button" data-accion="carrito">${iconos.carrito({ tam: 19 })}<span class="burbuja" hidden></span></button>
      </div>
      <button class="producto-cerrar solo-escritorio" type="button" data-accion="cerrar" aria-label="Cerrar">${iconos.cerrar({ grosor: 1.8 })}</button>

      <div class="galeria">
        <span class="washi galeria-washi" aria-hidden="true"></span>
        <div class="galeria-principal">
          ${medios.map((src, i) => esVideo(src)
            ? `<video class="galeria-medio" src="${src}" muted loop playsinline preload="metadata" aria-label="Video de ${producto.nombre}"></video>`
            : `<img class="galeria-medio" src="${src}" alt="${producto.nombre}, foto ${i + 1}" ${i ? 'loading="lazy"' : ''}>`).join('')}
          ${producto.nota ? `<span class="cinta galeria-cinta">${producto.nota}</span>` : ''}
          ${variasFotos ? `
            <span class="galeria-contador" aria-live="polite"></span>
            <button class="galeria-flecha galeria-anterior" type="button" data-accion="anterior" aria-label="Foto anterior">${iconos.izquierda({ grosor: 1.8 })}</button>
            <button class="galeria-flecha galeria-siguiente" type="button" data-accion="siguiente" aria-label="Foto siguiente">${iconos.derecha({ grosor: 1.8 })}</button>` : ''}
          ${conEtiquetas ? '<span class="galeria-etiqueta"><span class="galeria-etiqueta-punto"></span><span data-etiqueta></span></span>' : ''}
        </div>
        ${variasFotos ? `
          <div class="galeria-miniaturas">
            ${medios.map((src, i) => `
              <button class="miniatura" type="button" data-foto="${i}" aria-label="Ver ${conEtiquetas ? etiquetaDeFoto(producto, i) : `foto ${i + 1}`}">
                ${esVideo(src) ? `<video src="${src}#t=0.5" muted playsinline preload="metadata"></video><span class="miniatura-play">${iconos.play({ tam: 14 })}</span>` : `<img src="${src}" alt="" loading="lazy">`}
              </button>`).join('')}
          </div>` : ''}
      </div>

      <div class="producto-info">
        <p class="antetitulo">${categoria.nombre}</p>
        <h2 id="producto-titulo" class="producto-nombre" tabindex="-1">${producto.nombre}</h2>
        <div class="producto-precio">
          <span class="producto-precio-valor" data-precio></span>
          <span class="producto-precio-detalle" data-precio-detalle></span>
        </div>
        <p class="producto-descripcion">${producto.descripcion}</p>

        ${selectores(producto, conEtiquetas)}

        <div class="producto-compra">
          <div class="producto-cantidad-fila">
            <span class="producto-cantidad-titulo solo-movil">${producto.venta ? 'Metros' : 'Cantidad'}</span>
            <div class="cantidad" role="group" aria-label="${producto.venta ? 'Metros' : 'Cantidad'}">
              <button type="button" data-accion="menos" aria-label="Restar">${iconos.menos({ tam: 16, grosor: 2 })}</button>
              <span data-cantidad aria-live="polite"></span>
              <button type="button" data-accion="mas" aria-label="Sumar">${iconos.mas({ tam: 16, grosor: 2 })}</button>
            </div>
            <button class="boton boton-agregar solo-escritorio" type="button" data-accion="agregar"></button>
          </div>
          <a class="boton boton-borde boton-ancho solo-escritorio" href="${consulta}" target="_blank" rel="noopener">${iconos.whatsapp()} Consultar por WhatsApp</a>
        </div>

        <ul class="producto-datos">
          ${producto.demora ? `<li>${iconos.reloj({ grosor: 1.5 })} Listo en ${producto.demora}</li>` : ''}
          <li>${iconos.tejido({ grosor: 1.5 })} Hecho a mano en Villa San Isidro</li>
          <li>${iconos.whatsapp({ grosor: 1.5 })} Pago y entrega a coordinar por WhatsApp</li>
        </ul>
      </div>

      <div class="producto-barra-compra solo-movil">
        <a class="boton-redondo boton-redondo-grande" href="${consulta}" target="_blank" rel="noopener" aria-label="Consultar por WhatsApp">${iconos.whatsapp({ tam: 20 })}</a>
        <button class="boton boton-agregar" type="button" data-accion="agregar"></button>
      </div>
    </div>`;
}

function selectores(producto, conEtiquetas) {
  if (producto.colores) {
    return `
      <div class="producto-opciones">
        <div class="producto-opciones-titulo"><span>Color</span></div>
        <div class="pastillas-opciones">
          ${producto.colores.map((c, i) => `<button class="pastilla" type="button" data-color="${i}">${c.nombre}</button>`).join('')}
        </div>
        <div class="producto-opciones-titulo"><span>Grosor</span></div>
        <div class="pastillas-opciones" data-grosores></div>
        <p class="producto-nota-venta">Se vende de a ${producto.venta.incremento} ${producto.venta.unidad}, mínimo ${producto.venta.minimo} ${producto.venta.unidad}.</p>
      </div>`;
  }

  if (!producto.opciones.length) return '';

  const titulo = producto.tituloOpciones || 'Medidas';
  return `
    <div class="producto-opciones">
      <div class="producto-opciones-titulo"><span>${titulo}</span></div>
      <div class="opciones ${conEtiquetas ? 'opciones-con-foto' : ''}">
        ${producto.opciones.map((o, i) => `
          <button class="opcion" type="button" data-opcion="${i}" aria-pressed="false">
            ${o.imagen ? `<img src="${o.imagen}" alt="" loading="lazy">` : ''}
            <span class="opcion-texto">
              <span class="opcion-nombre">${o.nombre}</span>
              ${o.detalle ? `<span class="opcion-detalle">${o.detalle}</span>` : ''}
            </span>
            <span class="opcion-precio">${typeof o.precio === 'number' ? pesos(o.precio) : 'a consultar'}</span>
            <span class="opcion-check">${iconos.check({ tam: 12, grosor: 3 })}</span>
          </button>`).join('')}
      </div>
    </div>`;
}

// "Todas" para la foto de portada; "Opción 1 (chico)" para la foto de cada opción
function etiquetaDeFoto(producto, indice) {
  const opcion = producto.opciones?.find((o) => o.imagen === producto.imagenes[indice]);
  return opcion ? opcion.etiqueta || opcion.nombre : 'Todas';
}

// ---------- Interacción ----------

function conectar() {
  dialogo.querySelector('.producto-caja').addEventListener('click', (e) => {
    const el = e.target.closest('[data-accion], [data-foto], [data-opcion], [data-color], [data-grosor], [data-volver]');
    if (!el) return;
    const { estado, producto } = actual;
    const d = el.dataset;

    if (d.volver !== undefined) {
      e.preventDefault();
      alCerrar(`/${actual.categoria.id}`);
    } else if (d.foto !== undefined) irAFoto(Number(d.foto));
    else if (d.opcion !== undefined) elegirOpcion(Number(d.opcion));
    else if (d.color !== undefined) {
      estado.color = Number(d.color);
      const grosores = producto.colores[estado.color].grosores;
      estado.grosor = Math.min(estado.grosor, grosores.length - 1);
      estado.agregado = false;
      actualizar();
    } else if (d.grosor !== undefined) {
      estado.grosor = Number(d.grosor);
      estado.agregado = false;
      actualizar();
    } else if (d.accion === 'cerrar') alCerrar();
    else if (d.accion === 'carrito') abrirCarrito();
    else if (d.accion === 'anterior') irAFoto(estado.foto - 1);
    else if (d.accion === 'siguiente') irAFoto(estado.foto + 1);
    else if (d.accion === 'menos') cambiarCantidad(-1);
    else if (d.accion === 'mas') cambiarCantidad(1);
    else if (d.accion === 'agregar') agregar();
  });

  // Deslizar el dedo sobre la foto para pasar a la siguiente
  const principal = dialogo.querySelector('.galeria-principal');
  let inicio = null;
  principal.addEventListener('touchstart', (e) => {
    inicio = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: true });
  principal.addEventListener('touchend', (e) => {
    if (!inicio) return;
    const dx = e.changedTouches[0].clientX - inicio.x;
    const dy = e.changedTouches[0].clientY - inicio.y;
    inicio = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) irAFoto(actual.estado.foto + (dx < 0 ? 1 : -1));
  });
}

function irAFoto(indice) {
  const { estado, producto } = actual;
  const total = producto.imagenes.length;
  estado.foto = (indice + total) % total;
  // Ver la foto de una opción la elige; en la portada ("Todas") queda la última elegida
  const opcion = producto.opciones?.findIndex((o) => o.imagen && o.imagen === producto.imagenes[estado.foto]);
  if (opcion >= 0 && opcion !== estado.opcion) {
    estado.opcion = opcion;
    estado.agregado = false;
  }
  actualizar();
}

function elegirOpcion(indice) {
  const { estado, producto } = actual;
  estado.opcion = indice;
  estado.agregado = false;
  const foto = producto.imagenes.indexOf(producto.opciones[indice].imagen);
  if (foto >= 0) estado.foto = foto;
  actualizar();
}

function cambiarCantidad(sentido) {
  const { estado, producto } = actual;
  const paso = producto.venta?.incremento || 1;
  const minimo = producto.venta?.minimo || 1;
  estado.cantidad = Math.max(minimo, estado.cantidad + sentido * paso);
  estado.agregado = false;
  actualizar();
}

// Precio unitario elegido (por metro en el papel kraft); null si es a consultar
function precioUnitario() {
  const { estado, producto } = actual;
  if (producto.colores) {
    return producto.colores[estado.color].grosores[estado.grosor].precio / producto.venta.precioCada;
  }
  const precio = producto.opciones[estado.opcion]?.precio;
  return typeof precio === 'number' ? precio : null;
}

function agregar() {
  const { categoria, producto, estado } = actual;
  const base = { categoria: categoria.id, slug: producto.slug, nombre: producto.nombre, cantidad: estado.cantidad, precioUnitario: precioUnitario() };

  if (producto.colores) {
    const color = producto.colores[estado.color];
    const grosor = color.grosores[estado.grosor];
    agregarAlCarrito({
      ...base,
      id: `${categoria.id}/${producto.slug}/${color.nombre}/${grosor.nombre}`,
      detalle: `${color.nombre} · ${grosor.nombre}`,
      imagen: portadaDe(producto),
      unidad: producto.venta.unidad,
      paso: producto.venta.incremento,
      minimo: producto.venta.minimo
    });
  } else {
    const opcion = producto.opciones[estado.opcion];
    agregarAlCarrito({
      ...base,
      id: `${categoria.id}/${producto.slug}/${opcion?.nombre ?? ''}`,
      detalle: opcion ? [opcion.nombre, opcion.detalle].filter(Boolean).join(' · ') : '',
      imagen: opcion?.imagen || portadaDe(producto),
      unidad: 'u',
      paso: 1,
      minimo: 1
    });
  }

  estado.agregado = true;
  actualizar();
  clearTimeout(timerAgregado);
  timerAgregado = setTimeout(() => {
    if (!actual) return;
    actual.estado.agregado = false;
    actualizar();
  }, 2400);
}

// ---------- Pintar el estado ----------

function actualizar({ animar = true } = {}) {
  const { producto, estado } = actual;
  const q = (sel) => dialogo.querySelector(sel);
  const qa = (sel) => dialogo.querySelectorAll(sel);

  // Galería
  qa('.galeria-medio').forEach((medio, i) => {
    const activo = i === estado.foto;
    medio.classList.toggle('activa', activo);
    if (medio.tagName === 'VIDEO') activo ? medio.play().catch(() => {}) : medio.pause();
  });
  qa('[data-foto]').forEach((boton, i) => boton.setAttribute('aria-current', i === estado.foto ? 'true' : 'false'));
  const contador = q('.galeria-contador');
  if (contador) contador.textContent = `${estado.foto + 1} / ${producto.imagenes.length}`;
  const etiqueta = q('[data-etiqueta]');
  if (etiqueta) cambiarEtiqueta(etiqueta, etiquetaDeFoto(producto, estado.foto), animar);

  // Opciones
  qa('[data-opcion]').forEach((boton, i) => boton.setAttribute('aria-pressed', String(i === estado.opcion)));
  if (producto.colores) {
    qa('[data-color]').forEach((boton, i) => boton.setAttribute('aria-pressed', String(i === estado.color)));
    const grosores = producto.colores[estado.color].grosores;
    q('[data-grosores]').innerHTML = grosores
      .map((g, i) => `<button class="pastilla" type="button" data-grosor="${i}" aria-pressed="${i === estado.grosor}">${g.nombre}</button>`)
      .join('');
  }

  // Precio
  const unitario = precioUnitario();
  const precio = q('[data-precio]');
  const detalle = q('[data-precio-detalle]');
  if (producto.colores) {
    const color = producto.colores[estado.color];
    const grosor = color.grosores[estado.grosor];
    precio.textContent = pesos(grosor.precio);
    detalle.textContent = `cada ${producto.venta.precioCada} ${producto.venta.unidad} · ${color.nombre} ${grosor.nombre}`;
  } else if (unitario === null) {
    precio.textContent = 'A consultar';
    detalle.textContent = 'según el pedido';
  } else {
    const opcion = producto.opciones[estado.opcion];
    precio.textContent = pesos(unitario);
    detalle.textContent = `por unidad · ${[opcion.nombre, opcion.detalle].filter(Boolean).join(' · ')}`;
  }

  // Cantidad y botón de agregar
  q('[data-cantidad]').textContent = producto.venta ? `${estado.cantidad} ${producto.venta.unidad}` : estado.cantidad;
  q('[data-accion="menos"]').disabled = estado.cantidad <= (producto.venta?.minimo || 1);
  const total = unitario === null ? '' : ` · ${pesos(unitario * estado.cantidad)}`;
  qa('[data-accion="agregar"]').forEach((boton) => {
    boton.classList.toggle('agregado', estado.agregado);
    boton.innerHTML = estado.agregado
      ? `${iconos.check({ grosor: 2 })} ¡Agregado al carrito!`
      : `${iconos.carrito()} Agregar al carrito${total}`;
  });
}

function cambiarEtiqueta(el, texto, animar) {
  if (el.textContent === texto) return;
  if (!animar) {
    el.textContent = texto;
    return;
  }
  const chip = el.parentElement;
  chip.classList.add('cambiando');
  clearTimeout(chip.timer);
  chip.timer = setTimeout(() => {
    el.textContent = texto;
    chip.classList.remove('cambiando');
  }, 180);
}
