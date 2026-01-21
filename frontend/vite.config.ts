import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Gzip compression
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    // Brotli compression
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
    // Bundle analyzer - generates stats.html in dist/
    visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap', // sunburst, treemap, network
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    // Target modern browsers for smaller bundles
    target: 'es2015',
    // Optimize bundle size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        // Manual chunking for optimal loading
        manualChunks: {
          // React core (shared across all routes)
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],

          // State management
          'state-vendor': ['zustand'],

          // UI libraries
          'ui-vendor': ['framer-motion', 'lucide-react'],

          // Charts (heavy, only for admin)
          'chart-vendor': ['recharts'],

          // Form libraries
          'form-vendor': ['react-hook-form', '@tanstack/react-table'],

          // Authentication
          'auth-vendor': ['@clerk/clerk-react'],

          // Date utilities
          'date-vendor': ['date-fns'],
        },
        // Optimized file naming
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Disable sourcemaps in production
    sourcemap: false,
    // CSS code splitting
    cssCodeSplit: true,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'zustand',
      'framer-motion',
    ],
  },
  // Test configuration
  // @ts-ignore
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    css: true,
    exclude: ['node_modules', 'tests/**'],
  },
});
