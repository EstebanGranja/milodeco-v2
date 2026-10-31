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
    texto: '¡Llegaron mis arbolitos de Navidad!',
    textoCorto: '¡Llegaron mis arbolitos!',
    link: '/deco/arbolitos-de-navidad',
    accion: 'Pasá a verlos'
  },

  // "Algunas de mis preferidas" en el inicio: categoría + slug del producto
  destacados: [
    ['deco', 'arbolitos-de-navidad'],
    ['espejos', 'espejo-trenza'],
    ['lamparas', 'lampara-pampa'],
    ['espejos', 'espejo-girasol']
  ],

  // Bloque oscuro de temporada en el inicio. Poner en null para ocultarlo.
  temporada: {
    frase: '¡llegó la Navidad al taller!',
    titulo: 'Mis arbolitos para armar tu',
    tituloResaltado: 'bosquecito',
    texto: 'Este año hice cinco modelos nuevos, tejidos en papel kraft, de 30 a 68 cm. Combinalos como más te guste y llená tu casa de una Navidad cálida y natural.',
    chips: ['3 chicos · 30 cm · $40.000', '2 grandes · 45 y 68 cm · $59.000'],
    boton: 'Ver los arbolitos',
    link: '/deco/arbolitos-de-navidad',
    imagen: '/img/deco_21.webp',
    imagenAlt: 'Los cinco arbolitos de Navidad juntos sobre una mesa en el jardín',
    epigrafe: 'la familia completa'
  }
};
