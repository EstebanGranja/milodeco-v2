import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';

const SITIO = 'https://milodeco.com.ar';

// Arma robots.txt y sitemap.xml en cada build a partir del catálogo,
// así un producto nuevo entra solo al sitemap.
function robotsYSitemap() {
  return {
    name: 'robots-y-sitemap',
    apply: 'build',
    generateBundle() {
      const { categorias } = JSON.parse(readFileSync(new URL('./src/datos/catalogo.json', import.meta.url), 'utf8'));
      const rutas = [
        '/',
        '/catalogo',
        ...categorias.flatMap((c) => [`/${c.id}`, ...c.productos.map((p) => `/${c.id}/${p.slug}`)])
      ];
      const urls = rutas.map((r) => `  <url><loc>${SITIO}${encodeURI(r)}</loc></url>`).join('\n');

      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
      });
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${SITIO}/sitemap.xml\n`
      });
    }
  };
}

export default defineConfig({
  plugins: [robotsYSitemap()]
});
