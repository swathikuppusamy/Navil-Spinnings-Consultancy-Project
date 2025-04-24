import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://navil-spinnings-consultancy-project.onrender.com',
        changeOrigin: true,
        secure: false
      }
    }
  },
  // Add this section to disable CSS minification
  css: {
    postcss: './postcss.config.js',
    // This will prevent over-aggressive CSS optimization
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        charset: false
      }
    }
  },
  build: {
    // Disable minification for debugging
    minify: false,
    cssCodeSplit: false,
    // Or use this to only disable CSS minification
    // minify: 'esbuild',
    // cssMinify: false,
  }
})