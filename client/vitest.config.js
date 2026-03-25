import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/setupTests.js',
    css: true,
    mockReset: true,
    server: {
      deps: {
        inline: ['vitest-canvas-mock']
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '\\.(mp4|webm|ogg|mp3|wav|flac|aac)$': path.resolve(__dirname, 'src/__mocks__/fileMock.js'),
      '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)$': path.resolve(__dirname, 'src/__mocks__/fileMock.js'),
    },
  },
});