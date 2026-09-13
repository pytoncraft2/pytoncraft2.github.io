export type ProjectSlug = 'vroum' | 'easysav' | 'les-bambinets';

export type Project = {
	slug: ProjectSlug;
	title: string;
	subtitle: string;
	meta: string;
	tags: string[];
	description: string;
	stack: string[];
	role: string;
	year: string;
	featured: boolean;
	image: string;
	imageAlt: string;
};

export const projects: Project[] = [
	{
		slug: 'vroum',
		title: 'Vroum',
		subtitle: 'Outil collaboratif de covoiturage pour les scouts',
		meta: 'Production · SvelteKit, FastAPI, PostgreSQL',
		tags: ['2023–Aujourd’hui', 'Production', 'Développement web', 'Produit'],
		description: 'Outil de covoiturage collaboratif utilisé par des groupes scouts.',
		stack: ['SvelteKit', 'FastAPI', 'PostgreSQL'],
		role: 'Développement web et participation aux décisions produit',
		year: '2023-present',
		featured: true,
		image: '/vroum.png',
		imageAlt: 'Interface de l’outil de covoiturage Vroum'
	},
	{
		slug: 'easysav',
		title: 'EasySAV',
		subtitle: 'Amélioration de formulaires métiers et de l’expérience utilisateur',
		meta: 'Startup · Symfony, Twig, EasyAdmin',
		tags: ['2021–2025', 'Expérience pro', 'Développement web'],
		description: 'Formulaires métiers et interface d’administration.',
		stack: ['Symfony', 'Twig', 'EasyAdmin'],
		role: 'Développement web',
		year: '2020-2025',
		featured: true,
		image: '/easysav.png',
		imageAlt: 'Interface de l’outil EasySAV'
	},
	{
		slug: 'les-bambinets',
		title: 'Les Bambinets',
		subtitle: 'Application éducative autour de la langue des signes',
		meta: 'Formation UX/UI · Figma',
		tags: ['2026', 'Formation', 'UX/UI Design'],
		description: 'Application éducative autour de la langue des signes.',
		stack: ['Figma'],
		role: 'UX/UI Design',
		year: '2026-2027',
		featured: true,
		image: '/bambinet.png',
		imageAlt: 'Prototype de l’application Les Bambinets'
	}
];

export function getFeaturedProjects(): Project[] {
	return projects.filter((project) => project.featured);
}

export function projectPath(slug: ProjectSlug): `/projets/${ProjectSlug}` {
	return `/projets/${slug}`;
}

export function getProject(slug: string): Project | undefined {
	return projects.find((project) => project.slug === slug);
}

export function getNextProject(slug: string): Project | undefined {
	const featured = getFeaturedProjects();
	const index = featured.findIndex((project) => project.slug === slug);

	if (index === -1 || featured.length === 0) {
		return undefined;
	}

	return featured[(index + 1) % featured.length];
}
