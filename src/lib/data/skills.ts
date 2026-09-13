export type TechId =
	| 'sveltekit'
	| 'react'
	| 'twig'
	| 'fastapi'
	| 'flask'
	| 'symfony'
	| 'nodejs'
	| 'postgresql'
	| 'mysql'
	| 'playwright'
	| 'git'
	| 'gitlab'
	| 'docker'
	| 'figma';

export type TechItem = {
	id: TechId;
	label: string;
};

export const homeTechs: TechItem[] = [
	{ id: 'sveltekit', label: 'SvelteKit' },
	{ id: 'react', label: 'React' },
	{ id: 'fastapi', label: 'FastAPI' },
	{ id: 'symfony', label: 'Symfony' },
	{ id: 'postgresql', label: 'PostgreSQL' },
	{ id: 'playwright', label: 'Playwright' },
	{ id: 'docker', label: 'Docker' },
	{ id: 'git', label: 'Git' },
	{ id: 'figma', label: 'Figma' }
];

export const uxSkills = [
	'Recherche utilisateur',
	'Tests utilisateurs',
	'Prototypage',
	'Design system',
	'Accessibilité',
	'Audit UX'
] as const;
