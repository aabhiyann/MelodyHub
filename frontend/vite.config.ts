import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    // Bundle analyzer - run with: npm run build
    visualizer({
      filename: './dist/stats.html',
      open: false, // Set to true to auto-open in browser
      gzipSize: true,
      brotliSize: true,
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
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    // Optimize bundle size and loading performance
    rollupOptions: {
      output: {
        manualChunks: {
          // React core bundle
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // UI library components (only include what's actually used)
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-avatar',
          ],
          // Authentication
          'clerk': ['@clerk/clerk-react'],
          // State management
          'zustand': ['zustand'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase limit to 1MB for vendor chunks
    sourcemap: false, // Disable sourcemaps in production for smaller builds
  },
  // @ts-ignore - Vitest types extend Vite config but TS complains
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    css: true,
    exclude: ['node_modules', 'tests/**'],
  },
});
