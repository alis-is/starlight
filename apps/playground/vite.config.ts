import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

// Resolve @alis-is/starlight to its SOURCE (not the built dist/) so the
// playground needs no prior `svelte-package` build and gets live HMR.
const lib = (p: string) => fileURLToPath(new URL(`../../src/lib/${p}`, import.meta.url));

export default defineConfig({
	plugins: [sveltekit()],
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
