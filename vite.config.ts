import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isProduction = mode === 'production'
  
  return {
    plugins: [react()],
    
    // Path resolution for better imports
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@/components': path.resolve(__dirname, './src/components'),
        '@/pages': path.resolve(__dirname, './src/pages'),
        '@/utils': path.resolve(__dirname, './src/utils'),
        '@/types': path.resolve(__dirname, './src/types'),
        '@/api': path.resolve(__dirname, './src/api'),
        '@/hooks': path.resolve(__dirname, './src/hooks'),
        '@/contexts': path.resolve(__dirname, './src/contexts'),
      },
    },
    
    server: {
      host: '0.0.0.0',
      port: parseInt(env.VITE_PORT || '5173'),
      strictPort: true,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8000',
          changeOrigin: true,
          secure: isProduction,
          ws: true,
          // Remove detailed logging in production
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              if (!isProduction) {
                console.log('Proxy error:', err.message);
              }
            });
            if (!isProduction) {
              proxy.on('proxyReq', (proxyReq, req, _res) => {
                console.log('Sending Request:', req.method, req.url);
              });
            }
          },
        }
      },
      hmr: {
        port: parseInt(env.VITE_HMR_PORT || '5174'),
        host: 'localhost'
      }
    },
    
    build: {
      outDir: 'dist',
      sourcemap: !isProduction, // Disable sourcemaps in production for security
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: isProduction, // Remove console logs in production
          drop_debugger: isProduction,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            ui: ['lucide-react']
          }
        }
      }
    },
    
    // Define global constants
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
    
    // Environment variables prefix
    envPrefix: 'VITE_',
  }
})