import { sitio } from './datos/sitio.js';

export const pesos = (n) => '$' + Math.round(n).toLocaleString('es-AR');

export function linkWhatsApp(mensaje) {
  const base = `https://wa.me/${sitio.whatsapp}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}

// Crea un elemento a partir de un string de HTML
export function crear(html) {
  const plantilla = document.createElement('template');
  plantilla.innerHTML = html.trim();
  return plantilla.content.firstElementChild;
}

// localStorage puede fallar (modo privado, almacenamiento bloqueado): nunca rompe la página
export function leerGuardado(clave, porDefecto) {
  try {
    const valor = localStorage.getItem(clave);
    return valor === null ? porDefecto : JSON.parse(valor);
  } catch {
    return porDefecto;
  }
}

export function guardar(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    // sin almacenamiento: el dato vive solo mientras la página está abierta
  }
}
