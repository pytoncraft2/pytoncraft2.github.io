import type { AssetPath } from '$app/types';

export type ProjectSlug = 'vroum' | 'easysav' | 'les-bambinets' | 'fox-coffee' | 'sportsee' | 'eventorias';

export type Project = {
	slug: ProjectSlug;
	title: string;
	meta: string;
	tags: string[];
	description: string;
	stack: string[];
	role: string;
	year: string;
	featured: boolean;
	image: AssetPath;
	imageAlt: string;
};

export const projects: Project[] = [
	{
		slug: 'vroum',
		title: 'Vroum',
		meta: 'Production · SvelteKit, FastAPI, PostgreSQL',
		tags: ['2023–Aujourd’hui', 'Production', 'Développement web', 'Produit'],
		description: 'Outil de covoiturage collaboratif utilisé par des groupes scouts.',
		stack: ['SvelteKit', 'FastAPI', 'PostgreSQL'],
		role: 'Développement web et participation aux décisions produit',
		year: '2023-present',
		featured: true,
		image: 'vroum.png',
		imageAlt: 'Interface de l’outil de covoiturage Vroum'
	},
	{
		slug: 'easysav',
		title: 'EasySAV',
		meta: 'Startup · Symfony, Twig, EasyAdmin',
		tags: ['2021–2025', 'Expérience pro', 'Développement web'],
		description: 'Formulaires métiers et interface d’administration.',
		stack: ['Symfony', 'Twig', 'EasyAdmin'],
		role: 'Développement web',
		year: '2020-2025',
		featured: true,
		image: 'easysav.png',
		imageAlt: 'Interface de l’outil EasySAV'
	},

	{
		slug: 'fox-coffee',
		title: 'Fox Coffee',
		meta: 'Étude terrain · Recherche UX · Atelier Miro',
		tags: ['2026', 'Étude de cas', 'Recherche UX', 'Service Design'],
		description: 'Étude qualitative de l’expérience chez Fox Coffee à Metz : 8 observations, 5 entretiens, personas, parcours et atelier d’idéation.',
		stack: ['Notion', 'Miro', 'Canva'],
		role: 'Recherche utilisateurs, analyse et animation d’atelier',
		year: '2026',
		featured: true,
		image: 'fox.png',
		imageAlt: 'Étude de l’expérience client Fox Coffee'
	},
	{
		slug: 'eventorias',
		title: 'Eventorias',
		meta: 'Formation Product Design · Prototype no-code · Recherche UX',
		tags: ['2026', 'Formation', 'Product Design', 'Tests utilisateurs'],
		description: 'Prototype mobile de découverte et de publication d’événements, amélioré grâce à des micro-tests et documenté pour la passation aux développeurs.',
		stack: ['Lovable', 'Maze', 'Notion', 'Canva'],
		role: 'Recherche UX, prototypage, tests et passation',
		year: '2026',
		featured: true,
		image: 'paris.png',
		imageAlt: 'Prototype mobile Eventorias'
	},
	{
		slug: 'sportsee',
		title: 'SportSee',
		meta: 'Formation Product Design · Figma · Zeroheight',
		tags: ['2026', 'Formation', 'UI Design', 'Design System'],
		description: 'Conception des écrans de connexion, dashboard et profil sur trois formats, avec un Design System réutilisable documenté dans Zeroheight.',
		stack: ['Figma', 'Zeroheight'],
		role: 'Conception UI, responsive et documentation du Design System',
		year: '2026',
		featured: true,
		image: 'sportsee.png',
		imageAlt: 'Projet de conception d’interface SportSee'
	},
		{
		slug: 'les-bambinets',
		title: 'Les Bambinets',
		meta: 'Formation UX/UI · Figma',
		tags: ['2026', 'Formation', 'UX/UI Design'],
		description: 'Application éducative autour de la langue des signes.',
		stack: ['Figma'],
		role: 'UX/UI Design',
		year: '2026-2027',
		featured: true,
		image: 'bambinet.png',
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
