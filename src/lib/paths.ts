/**
 * Équivalent de `asset()` / `resolve()` de SvelteKit : préfixe un chemin interne
 * ou un fichier de `public/` par le chemin de base du site (BASE_PATH).
 */
export function withBase(path: string): string {
	const base = import.meta.env.BASE_URL.replace(/\/$/, '');
	return `${base}/${path.replace(/^\//, '')}`;
}

export function projectPath(slug: string): string {
	return withBase(`/projets/${slug}`);
}
