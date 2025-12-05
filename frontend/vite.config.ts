import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        port: 3000,
        // Autoriser tous les hôtes en développement
        allowedHosts: ['nird-platform-1.onrender.com', 'localhost'],
        // Ou autoriser tous les hôtes :
        allowedHosts: true,
    },
    preview: {
        host: true,
        port: process.env.PORT || 3000,
        allowedHosts: true,
    },
    build: {
        outDir: 'dist',
        sourcemap: false,
    }
})