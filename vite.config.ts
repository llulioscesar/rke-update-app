import tailwindcss from '@tailwindcss/vite';
import {defineConfig} from 'vite';
import solidPlugin from 'vite-plugin-solid';
import Pages from 'vite-plugin-pages';
import {resolve} from 'path';

export default defineConfig({
    plugins: [
        tailwindcss(),
        solidPlugin(),
        Pages({
            dirs: ['src/pages'],
        }),
    ],
    server: {
        port: 3000,
    },
    build: {
        target: 'esnext',
    },
    resolve: {
        alias: {
            "~": resolve(__dirname, './src'),
        }
    },
});