import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  base: '/', // ✅ Ensures correct asset loading
  plugins: [react()],
});
