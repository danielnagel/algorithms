import {
	defineConfig 
} from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'jsdom',
		globals: true,
		exclude: ['**/*.visual.test.ts', '**/node_modules/**'],
	},
});
