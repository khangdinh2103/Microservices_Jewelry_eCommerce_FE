import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import federation from '@originjs/vite-plugin-federation';

// https://vite.dev/config/
export default defineConfig({
    server: {
        port: 3001,
    },
    plugins: [
      react(),
      tailwindcss(),
      federation({
        name: 'service-account',
		filename: 'remoteEntry.js',
		exposes: {
			'./App': './src/App.tsx',
		},
		shared: ["react", "react-dom"],
      })
    ],
});
