// Datos generales del sitio: contacto, anuncio de temporada y productos destacados en el inicio.
// Los productos, precios y categorías están en catalogo.json.

export const sitio = {
  whatsapp: '5493547576851',
  whatsappTexto: '3547 576851',
  instagram: 'https://www.instagram.com/miloo_deco/',
  instagramUsuario: '@miloo_deco',
  facebook: 'https://www.facebook.com/profile.php?id=100063649685032',

  // Barra de arriba de todo. Poner en null para ocultarla.
  anuncio: {
    texto: 'Arbolitos de Navidad 2026',
    accion: 'Ver modelos',
    link: '/deco/arbolitos-de-navidad'
  },

  // "Lo más pedido" en el inicio: categoría + slug del producto
  destacados: [
    ['deco', 'arbolitos-de-navidad'],
    ['espejos', 'espejo-trenza'],
    ['lamparas', 'lampara-pampa'],
    ['espejos', 'espejo-girasol']
  ],

  // Bloque oscuro de temporada en el inicio. Poner en null para ocultarlo.
  temporada: {
    antetitulo: 'Navidad 2026',
    titulo: 'Arbolitos para armar tu',
    tituloResaltado: 'bosquecito',
    texto: 'Cinco modelos tejidos en papel kraft, de 30 a 68 cm.',
    chips: ['Chico: $40.000', 'Grande: $59.000'],
    boton: 'Ver arbolitos',
    link: '/deco/arbolitos-de-navidad',
    imagen: '/img/deco_21.webp',
    imagenAlt: 'Los cinco arbolitos de Navidad juntos sobre una mesa en el jardín',
    epigrafe: 'la familia completa'
  }
};
