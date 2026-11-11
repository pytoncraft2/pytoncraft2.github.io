export type TechId =
	| 'sveltekit'
	| 'react'
	| 'fastapi'
	| 'symfony'
	| 'postgresql'
	| 'playwright'
	| 'git'
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
