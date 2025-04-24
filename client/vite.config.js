import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  base: '/', // ✅ This ensures correct asset loading in production
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://navil-spinnings-consultancy-project.onrender.com',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
