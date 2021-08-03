/** @type {import('@sveltejs/kit').Config} */
import netlify from '@sveltejs/adapter-netlify';

const config = {
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		adapter: netlify()
	}
};

export default config;
