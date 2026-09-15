import type { TechId } from '$lib/data/skills';
import dockerLogo from '$lib/assets/tech/docker.svg';
import fastapiLogo from '$lib/assets/tech/fastapi.svg';
import figmaLogo from '$lib/assets/tech/figma.svg';
import flaskLogo from '$lib/assets/tech/flask.svg';
import gitLogo from '$lib/assets/tech/git.svg';
import gitlabLogo from '$lib/assets/tech/gitlab.svg';
import mysqlLogo from '$lib/assets/tech/mysql.svg';
import nodejsLogo from '$lib/assets/tech/nodejs.svg';
import playwrightLogo from '$lib/assets/tech/playwright.svg';
import postgresqlLogo from '$lib/assets/tech/postgresql.svg';
import reactLogo from '$lib/assets/tech/react.svg';
import svelteLogo from '$lib/assets/tech/svelte.svg';
import symfonyLogo from '$lib/assets/tech/symfony.svg';
import twigLogo from '$lib/assets/tech/twig.svg';

export type TechIconSource = {
	title: string;
	src: string;
	/** Logos quasi noirs : lisibles aussi en thème sombre */
	invertible?: boolean;
};

export const techIcons: Record<TechId, TechIconSource> = {
	sveltekit: { title: 'Svelte', src: svelteLogo },
	react: { title: 'React', src: reactLogo },
	twig: { title: 'Twig', src: twigLogo },
	fastapi: { title: 'FastAPI', src: fastapiLogo },
	flask: { title: 'Flask', src: flaskLogo, invertible: true },
	symfony: { title: 'Symfony', src: symfonyLogo, invertible: true },
	nodejs: { title: 'Node.js', src: nodejsLogo },
	postgresql: { title: 'PostgreSQL', src: postgresqlLogo },
	mysql: { title: 'MySQL', src: mysqlLogo },
	playwright: { title: 'Playwright', src: playwrightLogo },
	git: { title: 'Git', src: gitLogo },
	gitlab: { title: 'GitLab', src: gitlabLogo },
	docker: { title: 'Docker', src: dockerLogo },
	figma: { title: 'Figma', src: figmaLogo }
};
