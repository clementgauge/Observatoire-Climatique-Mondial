import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

function dynamicSitemapDevPlugin(): Plugin {
  return {
    name: 'dynamic-sitemap-dev',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const rawUrl = req.url || '/';
        const pathname = (rawUrl.split('?')[0].replace(/\/+$/, '') || '/').toLowerCase();
        const host = req.headers.host || 'localhost:3000';
        const proto = (req.headers['x-forwarded-proto'] as string) || 'https';
        const origin = `${proto}://${host}`;
        const today = new Date().toISOString().split('T')[0];

        if (
          pathname === '/sitemap.xml' ||
          pathname === '/sitemap-main.xml' ||
          pathname === '/sitemap2.xml' ||
          pathname === '/sitemap_index.xml'
        ) {
          res.setHeader('Content-Type', 'application/xml; charset=utf-8');
          res.statusCode = 200;
          res.end(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${origin}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${origin}/en</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`);
          return;
        }

        if (pathname === '/sitemap.txt') {
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.statusCode = 200;
          res.end(`${origin}/\n${origin}/en\n`);
          return;
        }

        if (pathname === '/robots.txt') {
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.statusCode = 200;
          res.end(
            `User-agent: *\nAllow: /\nAllow: /en\nAllow: /sitemap.xml\n\nSitemap: ${origin}/sitemap.xml\nSitemap: ${origin}/sitemap-main.xml\nSitemap: ${origin}/sitemap.txt\n`
          );
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  const rootDir = import.meta.dirname;
  return {
    plugins: [
      dynamicSitemapDevPlugin(),
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'favicon.ico',
          'apple-touch-icon.png',
          'favicon.svg',
          'logo.svg',
          'logo.png',
          'favicon-48x48.png',
          'favicon-96x96.png',
          'favicon-144x144.png',
          'favicon-192x192.png',
          'favicon-512x512.png',
        ],
        manifest: {
          id: '/',
          name: 'Observatoire Climatique Mondial — Global Climate Observatory',
          short_name: 'ObsClimat',
          description:
            'Observatoire scientifique du réchauffement climatique en direct, Planète Terre 3D, déforestation mondiale, actions du WWF et plantation d’arbres.',
          theme_color: '#0F172A',
          background_color: '#F8FAFC',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          lang: 'fr',
          icons: [
            {
              src: '/favicon-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/favicon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/favicon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: '/logo.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'any',
            },
          ],
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(rootDir, '.'),
      },
    },
    build: {
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        input: {
          main: path.resolve(rootDir, 'index.html'),
          en: path.resolve(rootDir, 'en/index.html'),
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
