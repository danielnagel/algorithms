import {
	defineConfig 
} from 'vite';


export default defineConfig({
	root: 'public',
	server: {
		host: true,
		open: 'test.html'
	}
});