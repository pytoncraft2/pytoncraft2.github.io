import { getCollection, type CollectionEntry } from 'astro:content';

export type ProjectEntry = CollectionEntry<'projects'>;

/** Toutes les études de cas, dans l’ordre du champ `order` (chacune a sa page). */
export async function getProjects(): Promise<ProjectEntry[]> {
	const entries = await getCollection('projects');
	return entries.sort((a, b) => a.data.order - b.data.order);
}

/** Projets mis en avant (carrousel et « Projet suivant »), dans l’ordre du champ `order`. */
export async function getFeaturedProjects(): Promise<ProjectEntry[]> {
	return (await getProjects()).filter((project) => project.data.featured);
}

export function getNextProject(projects: ProjectEntry[], slug: string): ProjectEntry | undefined {
	const index = projects.findIndex((project) => project.id === slug);
	if (index === -1 || projects.length === 0) {
		return undefined;
	}

	return projects[(index + 1) % projects.length];
}
