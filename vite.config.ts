import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: {
			'/api': {
				target: 'http://192.168.16.124:8000',
				changeOrigin: true,
				timeout: 3000
			}
		}
	}
});
