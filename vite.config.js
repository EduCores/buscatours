/* global process */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

// Custom plugin to handle file uploads for local development
const uploadMiddleware = () => {
  return {
    name: 'upload-middleware',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/api/upload') && req.method === 'POST') {
          try {
            const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
            const rawFilename = urlObj.searchParams.get('filename') || `upload-${Date.now()}.webp`;
            const folder = urlObj.searchParams.get('folder') || 'tours';
            const filename = path.basename(rawFilename);
            const ext = path.extname(filename).toLowerCase();

            if (![".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext)) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Tipo de archivo no permitido.' }));
              return;
            }

            const targetDir = path.resolve(process.cwd(), 'public', 'uploads', folder);

            if (!fs.existsSync(targetDir)) {
              fs.mkdirSync(targetDir, { recursive: true });
            }

            const targetPath = path.join(targetDir, filename);
            if (!targetPath.startsWith(targetDir)) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Ruta de archivo inválida.' }));
              return;
            }
            const writeStream = fs.createWriteStream(targetPath);

            // Pipe request body into the file
            req.pipe(writeStream);

            // Only respond AFTER the file has been fully written to disk
            writeStream.on('finish', () => {
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(JSON.stringify({ url: `/uploads/${folder}/${filename}`, success: true }));
            });

            writeStream.on('error', (err) => {
              console.error('[upload-middleware] WriteStream error:', err);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            });

            req.on('error', (err) => {
              console.error('[upload-middleware] Request error:', err);
              writeStream.destroy();
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            });

          } catch (error) {
            console.error('[upload-middleware] Unexpected error:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: error.message }));
          }
          return;
        }
        next();
      });
    }
  }
}

// https://vite.dev/config/
// GitHub Pages vive en /buscatours/ -> base /buscatours/ en CI, / en local/Firebase
export default defineConfig({
  base: process.env.GITHUB_ACTIONS === 'true' ? '/buscatours/' : '/',
  plugins: [react(), tailwindcss(), uploadMiddleware()],
  server: {
    headers: {
      // Temporary CSP to allow eval for development
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com; img-src 'self' data: https: http://localhost:* http://127.0.0.1:*; connect-src 'self' http://localhost:* http://127.0.0.1:* ws://localhost:* ws://127.0.0.1:*;"
    },
    watch: {
      ignored: ['**/nuevo-diseno-admin/**'],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('firebase/app') || id.includes('firebase/auth') || id.includes('firebase/functions')) {
              return 'vendor-firebase';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-lucide';
            }
            if (id.includes('firebase/firestore') || id.includes('firebase/database')) {
              return 'vendor-firebase-data';
            }
            if (id.includes('tailwindcss')) {
              return 'vendor-tailwind';
            }
            return 'vendor-other';
          }
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
})

