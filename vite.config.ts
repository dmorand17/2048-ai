/// <reference types="vitest" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    allowedHosts: ['localhost', '.cloudfront.net'],
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
