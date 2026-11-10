import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

// Resolve @alis-is/starlight to its SOURCE (not the built dist/) so the
// playground needs no prior `svelte-package` build and gets live HMR.
const lib = (p: string) => fileURLToPath(new URL(`../../src/lib/${p}`, import.meta.url));

// For GitHub Pages the site is served from /<repo>. CI sets BASE_PATH=/starlight.
const base = (process.env.BASE_PATH ?? '') as '' | `/${string}`;

export default defineConfig({
	plugins: [
		sveltekit({
			preprocess: vitePreprocess(),
			adapter: adapter({ fallback: '404.html' }),
			paths: { base },
			prerender: { handleHttpError: 'warn' }
		})
	],
	resolve: {
		alias: [
			{ find: /^@alis-is\/starlight\/style\.sass$/, replacement: lib('style.sass') },
			{ find: /^@alis-is\/starlight\/la$/, replacement: lib('la/index.ts') },
			{ find: /^@alis-is\/starlight$/, replacement: lib('index.ts') },
			// any remaining subpath, e.g. components/Terminal.svelte
			{ find: /^@alis-is\/starlight\/(.*)$/, replacement: lib('$1') }
		]
	}
});
