import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [
        react(),

        VitePWA({
            registerType: 'autoUpdate',

            includeAssets: ['favicon.svg'],

            manifest: {
                name: 'Snapp Box',
                short_name: 'SnappBox',
                description: 'Bottom sheet navigation demo',
                theme_color: '#ffffff',
                background_color: '#ffffff',
                display: 'standalone',
                display_override: ['standalone', 'fullscreen', 'minimal-ui'],
                orientation: 'portrait',
                start_url: '/',
                scope: '/',
                icons: [
                    {
                        src: '/pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any'
                    },
                    {
                        src: '/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            },
        }),
    ],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.ts',
    },
})
