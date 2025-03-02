import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Configure base public path if your project is deployed in a sub-path on your server
  base: './', // Adjust this according to your deployment (e.g., `/myapp/` if deployed under a subdirectory)
  build: {
    chunkSizeWarningLimit: 600, // Increase the chunk size warning limit
    rollupOptions: {
      output: {
        // Optimize chunk splitting
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // Splitting vendor code into a separate chunk
          }
        },
      }
    }
  }
});
