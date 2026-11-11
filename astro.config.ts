import svelte from '@astrojs/svelte';
import { defineConfig } from 'astro/config';

declare const process: {
	env: Record<string, string | undefined>;
};

/** Défini par le workflow GitHub Pages : vide pour <user>.github.io, `/<repo>` sinon. */
function resolveBasePath(): string {
	const value = process.env.BASE_PATH;
	if (!value) {
		return '/';
	}

	return value.startsWith('/') ? value : `/${value}`;
}

const base = resolveBasePath();

export default defineConfig({
	base,
	// Même dossier de sortie que l’ancienne version : le workflow de déploiement ne change pas.
	outDir: './build',
	// Pages générées en `projets/vroum.html` : mêmes URL que la version SvelteKit.
	build: {
		format: 'file'
	},
	integrations: [svelte()],
	prefetch: {
		prefetchAll: true,
		defaultStrategy: 'hover'
	},
	devToolbar: {
		enabled: false
	}
});
