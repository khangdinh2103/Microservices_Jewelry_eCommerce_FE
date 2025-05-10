import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import federation from '@originjs/vite-plugin-federation';

// https://vite.dev/config/
export default defineConfig({
	server: {
		port: 3000,
	},
    plugins: [
		react(), 
		tailwindcss(),
		federation({
			name: 'container',
			remotes: {
				
			},
			shared: ["react", "react-dom"]
		})
	],
});
