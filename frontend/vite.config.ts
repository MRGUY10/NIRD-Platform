import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        // Forcer l'écoute sur toutes les interfaces
        host: true,
        port: process.env.PORT || 3000,
        strictPort: true,
        // Désactiver HMR en production
        hmr: process.env.NODE_ENV !== 'production',
    },
    preview: {
        port: process.env.PORT || 3000,
        host: true,
        strictPort: true,
    },
    build: {
        outDir: 'dist',
        sourcemap: false,
    }
})