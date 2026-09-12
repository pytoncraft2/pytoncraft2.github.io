import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

declare const process: {
	argv: string[];
	env: Record<string, string | undefined>;
};

const dev = process.argv.includes('dev');

function resolveBasePath(): '' | `/${string}` {
	if (dev) {
		return '';
	}

	const value = process.env.BASE_PATH;
	if (!value) {
		return '';
	}

	return value.startsWith('/') ? (value as `/${string}`) : `/${value}`;
}

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter({
				fallback: '404.html'
			}),
			paths: {
				base: resolveBasePath()
			}
		})
	]
});
