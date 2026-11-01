// Íconos de línea fina, todos en 24x24 y con el color del texto (currentColor)

const svg = (contenido, { tam = 18, grosor = 1.6 } = {}) =>
  `<svg width="${tam}" height="${tam}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${grosor}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${contenido}</svg>`;

export const iconos = {
  flecha: (o) => svg('<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>', o),
  izquierda: (o) => svg('<path d="M15 6l-6 6 6 6"/>', o),
  derecha: (o) => svg('<path d="M9 6l6 6-6 6"/>', o),
  cerrar: (o) => svg('<path d="M6 6l12 12M18 6L6 18"/>', o),
  menos: (o) => svg('<path d="M5 12h14"/>', o),
  mas: (o) => svg('<path d="M5 12h14M12 5v14"/>', o),
  check: (o) => svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>', o),
  carrito: (o) => svg('<path d="M5 8h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>', o),
  whatsapp: (o) => svg('<path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.3z"/>', o),
  whatsappCompleto: (o) => svg('<path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.3z"/><path d="M9 8.6c.2-.5.5-.6.8-.6h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.6l-.5.6c.6 1.2 1.6 2.2 2.8 2.8l.6-.5c.2-.2.4-.2.6-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.1.6-.6.8-.6.3-1.8.4-3.5-.6-1.7-1-3-2.3-3.9-4-.9-1.6-.6-2.8-.3-3.2z"/>', o),
  instagram: (o) => svg('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor"/>', o),
  reloj: (o) => svg('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>', o),
  tejido: (o) => svg('<path d="M7 12c2.5-3 7.5-3 10 0M7 16c2.5-3 7.5-3 10 0M7 8c2.5-3 7.5-3 10 0"/>', o),
  play: (o) => svg('<path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/>', o),
  ampliar: (o) => svg('<path d="M14 4h6v6"/><path d="M20 4l-7 7"/><path d="M10 20H4v-6"/><path d="M4 20l7-7"/>', o),
  basura: (o) => svg('<path d="M4.5 7h15"/><path d="M9.5 7V5h5v2"/><path d="M6.5 7l.8 12a1.5 1.5 0 0 0 1.5 1.4h6.4a1.5 1.5 0 0 0 1.5-1.4l.8-12"/>', o),

  // Trazos "a mano"
  corazon: (tam = 30) =>
    `<svg width="${tam}" height="${Math.round(tam * 0.88)}" viewBox="0 0 34 30" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 26s-11-6.5-11-14.5A6 6 0 0 1 17 8a6 6 0 0 1 11 3.5C28 19.5 17 26 17 26z"/></svg>`,
  subrayado: () =>
    `<svg class="subrayado" aria-hidden="true" viewBox="0 0 300 16" preserveAspectRatio="none"><path d="M3 10 C 60 3, 120 14, 180 7 S 270 4, 297 9" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>`
};

// Puntada: la línea cosida que separa secciones
export const puntada = `<svg class="puntada" aria-hidden="true" viewBox="0 0 1200 14" preserveAspectRatio="none"><path d="M0 7 Q 25 1, 50 7 ${Array.from({ length: 23 }, (_, i) => `T ${100 + i * 50} 7`).join(' ')}" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="9 7"/></svg>`;
