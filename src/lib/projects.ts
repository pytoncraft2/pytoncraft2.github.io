import { getCollection, type CollectionEntry } from 'astro:content';

export type ProjectEntry = CollectionEntry<'projects'>;

/** Projets mis en avant, dans l’ordre du champ `order`. */
export async function getFeaturedProjects(): Promise<ProjectEntry[]> {
	const entries = await getCollection('projects', ({ data }) => data.featured);
	return entries.sort((a, b) => a.data.order - b.data.order);
}

export function getNextProject(projects: ProjectEntry[], slug: string): ProjectEntry | undefined {
	const index = projects.findIndex((project) => project.id === slug);
	if (index === -1 || projects.length === 0) {
		return undefined;
	}

	return projects[(index + 1) % projects.length];
}
