import { crear, guardar, leerGuardado, linkWhatsApp, pesos } from '../util.js';
import { iconos } from './iconos.js';

const CLAVE_CARRITO = 'milodeco-v2:carrito';
const CLAVE_NOMBRE = 'milodeco-v2:nombre';

// Cada ítem: { id, categoria, slug, nombre, detalle, imagen, cantidad, unidad ('u' o 'm'),
// paso, minimo, precioUnitario (null si es a consultar) }
let items = leerGuardado(CLAVE_CARRITO, []);
const oyentes = new Set();
let dialogo = null;

export function alCambiarCarrito(fn) {
  oyentes.add(fn);
  fn();
}

function avisarCambios() {
  guardar(CLAVE_CARRITO, items);
  oyentes.forEach((fn) => fn());
  if (dialogo?.open) renderizar();
}

// El papel kraft cuenta como un producto, sin importar los metros
export function contarItems() {
  return items.reduce((suma, item) => suma + (item.unidad === 'm' ? 1 : item.cantidad), 0);
}

export function agregarAlCarrito(item) {
  const existente = items.find((i) => i.id === item.id);
  if (existente) existente.cantidad += item.cantidad;
  else items.push(item);
  avisarCambios();
}

function cambiarCantidad(id, sentido) {
  const item = items.find((i) => i.id === id);
  if (!item) return;
  item.cantidad = Math.max(item.minimo, item.cantidad + sentido * item.paso);
  avisarCambios();
}

function quitar(id) {
  items = items.filter((i) => i.id !== id);
  avisarCambios();
}

const subtotal = (item) => (item.precioUnitario === null ? null : item.precioUnitario * item.cantidad);
const textoCantidad = (item) => (item.unidad === 'm' ? `${item.cantidad} m` : item.cantidad);

function textoTotal() {
  const conPrecio = items.filter((i) => i.precioUnitario !== null);
  const total = conPrecio.reduce((suma, item) => suma + subtotal(item), 0);
  if (conPrecio.length === items.length) return pesos(total);
  return conPrecio.length ? `${pesos(total)} + a consultar` : 'A consultar';
}

function mensajeWhatsApp() {
  const nombre = (leerGuardado(CLAVE_NOMBRE, '') || '').trim();
  const lineas = ['¡Hola Silvana! Quiero hacerte este pedido:', ''];
  if (nombre) lineas.push(`*Nombre:* ${nombre}`, '');
  items.forEach((item, i) => {
    const precio = subtotal(item);
    lineas.push(
      `${i + 1}. *${item.nombre}*`,
      ...(item.detalle ? [`   ${item.detalle}`] : []),
      `   Cantidad: ${textoCantidad(item)} · ${precio === null ? 'a consultar' : pesos(precio)}`,
      ''
    );
  });
  lineas.push(`*TOTAL: ${textoTotal()}*`, '', 'Quedo a la espera de tu respuesta. ¡Gracias!');
  return lineas.join('\n');
}

export function iniciarCarrito() {
  dialogo = crear(`
    <dialog class="carrito" aria-labelledby="carrito-titulo">
      <div class="carrito-encabezado">
        <div>
          <h2 id="carrito-titulo">Tu pedido</h2>
          <p class="carrito-bajada">lo terminamos de charlar por WhatsApp</p>
        </div>
        <button class="boton-redondo" type="button" data-accion="cerrar" aria-label="Cerrar el carrito">${iconos.cerrar()}</button>
      </div>
      <div class="carrito-cuerpo"></div>
      <div class="carrito-pie"></div>
    </dialog>`);
  document.body.append(dialogo);

  dialogo.addEventListener('click', (e) => {
    if (e.target === dialogo) return dialogo.close(); // click en el fondo oscuro
    const boton = e.target.closest('[data-accion]');
    if (!boton) return;
    const { accion, id } = boton.dataset;
    if (accion === 'cerrar') dialogo.close();
    if (accion === 'menos') cambiarCantidad(id, -1);
    if (accion === 'mas') cambiarCantidad(id, 1);
    if (accion === 'quitar') quitar(id);
  });

  dialogo.addEventListener('input', (e) => {
    if (e.target.name === 'nombre') guardar(CLAVE_NOMBRE, e.target.value);
  });

  // El link de WhatsApp se arma justo al tocarlo, con el carrito y el nombre al día
  dialogo.addEventListener('click', (e) => {
    const enviar = e.target.closest('[data-enviar]');
    if (enviar) enviar.href = linkWhatsApp(mensajeWhatsApp());
  });
}

export function abrirCarrito() {
  renderizar();
  if (!dialogo.open) dialogo.showModal();
}

export function cerrarCarrito() {
  if (dialogo?.open) dialogo.close();
}

function renderizar() {
  const cuerpo = dialogo.querySelector('.carrito-cuerpo');
  const pie = dialogo.querySelector('.carrito-pie');

  if (!items.length) {
    cuerpo.innerHTML = `
      <div class="carrito-vacio">
        <p class="carrito-vacio-mano">¡Todavía no elegiste nada!</p>
        <p>Mirá el catálogo y sumá lo que te guste. Después me mandás el pedido por WhatsApp y lo charlamos.</p>
        <a class="boton" href="/catalogo">Ver el catálogo ${iconos.flecha()}</a>
      </div>`;
    pie.innerHTML = '';
    return;
  }

  const nombre = leerGuardado(CLAVE_NOMBRE, '') || '';
  cuerpo.innerHTML = `
    <ul class="carrito-lista">
      ${items.map((item) => {
        const precio = subtotal(item);
        const url = `/${item.categoria}/${item.slug}`;
        return `
          <li class="carrito-item">
            <a class="carrito-foto" href="${url}" tabindex="-1" aria-hidden="true"><img src="${item.imagen}" alt="" loading="lazy"></a>
            <div class="carrito-item-info">
              <a class="carrito-item-nombre" href="${url}">${item.nombre}</a>
              ${item.detalle ? `<span class="carrito-item-detalle">${item.detalle}</span>` : ''}
              <div class="carrito-item-fila">
                <div class="cantidad cantidad-chica" role="group" aria-label="Cantidad de ${item.nombre}">
                  <button type="button" data-accion="menos" data-id="${item.id}" aria-label="Restar" ${item.cantidad <= item.minimo ? 'disabled' : ''}>${iconos.menos({ tam: 14, grosor: 2 })}</button>
                  <span>${textoCantidad(item)}</span>
                  <button type="button" data-accion="mas" data-id="${item.id}" aria-label="Sumar">${iconos.mas({ tam: 14, grosor: 2 })}</button>
                </div>
                <span class="carrito-item-precio">${precio === null ? 'a consultar' : pesos(precio)}</span>
              </div>
            </div>
            <button class="carrito-quitar" type="button" data-accion="quitar" data-id="${item.id}" aria-label="Quitar ${item.nombre}">${iconos.basura({ tam: 18 })}</button>
          </li>`;
      }).join('')}
    </ul>
    <label class="carrito-nombre">
      <span>¿Cómo te llamás?</span>
      <input name="nombre" type="text" autocomplete="given-name" placeholder="Tu nombre, así sé quién me escribe" value="${nombre.replace(/"/g, '&quot;')}">
    </label>`;

  pie.innerHTML = `
    <div class="carrito-total"><span>Total</span><strong>${textoTotal()}</strong></div>
    <a class="boton boton-ancho" data-enviar href="${linkWhatsApp()}" target="_blank" rel="noopener">${iconos.whatsapp()} Enviar pedido por WhatsApp</a>
    <button class="boton boton-borde boton-ancho" type="button" data-accion="cerrar">Seguir mirando</button>`;
}
