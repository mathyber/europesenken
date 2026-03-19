import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `$gradient: linear-gradient(153deg, #f800cf, #4c00ff);`,
            },
        },
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    base: '/',
    build: {
        outDir: 'dist'
    }
});