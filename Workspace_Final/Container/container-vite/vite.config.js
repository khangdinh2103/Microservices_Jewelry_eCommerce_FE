import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import federation from '@originjs/vite-plugin-federation';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        federation({
            name: 'container',
            remotes: {
                account: 'http://localhost:3001/assets/remoteEntry.js',
            },
            shared: ['react', 'react-dom'],
        }),
    ],
	server: {
		port: 3000,
		cors: true,
	},
	build: {
		modulePreload: false,
		target: 'esnext',
		minify: false,
		cssCodeSplit: false,
	},
});
