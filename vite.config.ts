import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function getCspImgOrigins(env: Record<string, string>): string {
  const base = env.VITE_APP_BASE_URL?.trim()
  if (!base) return ''
  try {
    const url = new URL(base)
    return url.origin
  } catch {
    return ''
  }
}

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '') as Record<string, string>
  const cspImgOrigins = getCspImgOrigins(env)
  return {
  // Dev: serve at root so lazy-loaded chunks (e.g. routePages) resolve correctly at http://localhost:5173/
  // Build: use /salon-app/ for deployment under a subpath
  base: command === 'serve' ? '/' : '/salon-app/',
  plugins: [
    react(),
    {
      name: 'html-csp-env',
      transformIndexHtml(html: string) {
        return html.replace('__CSP_IMG_ORIGINS__', cspImgOrigins)
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@services': path.resolve(__dirname, './src/services'),
      '@state': path.resolve(__dirname, './src/state'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  server: {
    port: 5173,
    open: false, // avoid spawn xdg-open ENOENT on headless/remote (e.g. QA)
    strictPort: false,
    cors: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
    },
  },
  build: {
    sourcemap: false,
    minify: 'terser',
  },
}
})
