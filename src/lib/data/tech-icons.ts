import type { TechId } from '#lib/data/skills.js';
import dockerLogo from '#lib/assets/tech/docker.svg';
import fastapiLogo from '#lib/assets/tech/fastapi.svg';
import figmaLogo from '#lib/assets/tech/figma.svg';
import flaskLogo from '#lib/assets/tech/flask.svg';
import gitLogo from '#lib/assets/tech/git.svg';
import gitlabLogo from '#lib/assets/tech/gitlab.svg';
import mysqlLogo from '#lib/assets/tech/mysql.svg';
import nodejsLogo from '#lib/assets/tech/nodejs.svg';
import playwrightLogo from '#lib/assets/tech/playwright.svg';
import postgresqlLogo from '#lib/assets/tech/postgresql.svg';
import reactLogo from '#lib/assets/tech/react.svg';
import svelteLogo from '#lib/assets/tech/svelte.svg';
import symfonyLogo from '#lib/assets/tech/symfony.svg';
import twigLogo from '#lib/assets/tech/twig.svg';

export type TechIconSource = {
	title: string;
	src: string;
	/** Logos quasi noirs : lisibles aussi en thème sombre */
	invertible?: boolean;
};

type SvgImport = { src: string };

/** Avec Astro, un SVG importé est un objet (composant + métadonnées) : on garde son URL. */
function url(logo: SvgImport): string {
	return logo.src;
}

export const techIcons: Record<TechId, TechIconSource> = {
	sveltekit: { title: 'Svelte', src: url(svelteLogo) },
	react: { title: 'React', src: url(reactLogo) },
	twig: { title: 'Twig', src: url(twigLogo) },
	fastapi: { title: 'FastAPI', src: url(fastapiLogo) },
	flask: { title: 'Flask', src: url(flaskLogo), invertible: true },
	symfony: { title: 'Symfony', src: url(symfonyLogo), invertible: true },
	nodejs: { title: 'Node.js', src: url(nodejsLogo) },
	postgresql: { title: 'PostgreSQL', src: url(postgresqlLogo) },
	mysql: { title: 'MySQL', src: url(mysqlLogo) },
	playwright: { title: 'Playwright', src: url(playwrightLogo) },
	git: { title: 'Git', src: url(gitLogo) },
	gitlab: { title: 'GitLab', src: url(gitlabLogo) },
	docker: { title: 'Docker', src: url(dockerLogo) },
	figma: { title: 'Figma', src: url(figmaLogo) }
};
