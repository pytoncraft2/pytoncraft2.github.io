<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import Button from '$lib/components/Button.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import { getFeaturedProjects, projectPath } from '$lib/data/projects';
	import { snapBlocks } from '$lib/snap-blocks';

	const name = 'Timothée Hennequin';
	const email = 'timothennequin@gmail.com';
	const linkedInHref = 'https://www.linkedin.com/in/timothee-hennequin/';
	const featuredProjects = getFeaturedProjects();
</script>

<svelte:head>
	<title>{name} — Développeur web</title>
	<meta
		name="description"
		content="Portfolio de {name}, développeur web avec une compétence complémentaire en Product Design."
	/>
</svelte:head>

<div class="page" {@attach snapBlocks}>
	<section class="hero snap-block" aria-labelledby="hero-title">
		<p class="eyebrow ds-label-m">Portfolio</p>
		<h1 id="hero-title" class="ds-h1">{name}</h1>
		<p class="role ds-body-l">Développeur web</p>
		<p class="intro ds-body-m">
			Je conçois et développe des applications web en gardant un lien direct entre besoins utilisateurs,
			contraintes produit et faisabilité technique. Ma formation Product Designer complète aujourd’hui
			mon profil de développeur.
		</p>
		<div class="actions">
			<Button href="#projets">Voir mes projets</Button>
			<Button href="#contact" variant="secondary">Me contacter</Button>
		</div>
	</section>

	<section id="projets" class="section snap-block" aria-labelledby="projets-title">
		<h2 id="projets-title" class="ds-h2">Projets sélectionnés</h2>
		<p class="section-intro ds-body-m">
			Une sélection de projets réels et de formation qui montrent mon approche du développement, de la
			conception produit et de l’amélioration continue.
		</p>
		<ul class="grid">
			{#each featuredProjects as project (project.slug)}
				<li>
					<ProjectCard
						title={project.title}
						meta={project.meta}
						description={project.description}
						href={resolve(projectPath(project.slug))}
						imageSrc={project.image ? asset(project.image) : undefined}
						imageAlt={project.imageAlt}
					/>
				</li>
			{/each}
		</ul>
	</section>

	<section id="profil" class="section snap-block" aria-labelledby="profil-title">
		<h2 id="profil-title" class="ds-h2">Profil</h2>
		<p class="ds-body-m">
			Développeur web diplômé d’Epitech, j’ai travaillé plusieurs années sur des produits web en contexte
			professionnel et associatif. Je poursuis aujourd’hui une formation Product Designer pour renforcer
			ma capacité à concevoir des interfaces pertinentes avant de les développer.
		</p>
		<h3 class="ds-h3">Compétences</h3>
		<ul class="skills">
			<li>Front-end : SvelteKit, React, Twig</li>
			<li>Back-end : FastAPI, Flask, Symfony, Node.js</li>
			<li>Données et qualité : PostgreSQL, MySQL, Playwright</li>
			<li>Delivery : Git, GitLab CI, Docker</li>
			<li>Product Design : Figma, prototypage, design system, accessibilité</li>
		</ul>
		<p>
			<a class="about-link" href={resolve('/a-propos')}>En savoir plus sur mon parcours</a>
		</p>
	</section>

	<section id="contact" class="section snap-block" aria-labelledby="contact-title">
		<h2 id="contact-title" class="ds-h2">Contact</h2>
		<p class="ds-body-m">
			Pour un échange autour d’un poste, d’un projet ou d’une collaboration, vous pouvez me contacter directement.
		</p>
		<div class="contact-links">
			<a href={`mailto:${email}`}>{email}</a>
			<a href={linkedInHref} target="_blank" rel="noreferrer">LinkedIn</a>
		</div>
	</section>
</div>

<style>
	.page {
		display: contents;
	}

	.hero {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--spacing-4);
		margin-bottom: var(--spacing-8);
		padding: var(--spacing-8);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-lg);
		background: var(--surface-elevated);
	}

	.eyebrow {
		margin: 0;
		color: var(--text-secondary);
	}

	.hero h1,
	.role,
	.intro {
		margin: 0;
	}

	.role {
		color: var(--text-primary);
	}

	.intro,
	.section-intro {
		max-width: 40rem;
		color: var(--text-secondary);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-4);
		margin-top: var(--spacing-2);
	}

	.section {
		margin-bottom: var(--spacing-8);
		padding: var(--spacing-8);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-lg);
		background: var(--surface-elevated);
	}

	.section h2 {
		margin: 0 0 var(--spacing-4);
	}

	.section h3 {
		margin: var(--spacing-8) 0 var(--spacing-4);
	}

	.section p {
		margin: 0 0 var(--spacing-4);
		max-width: 40rem;
	}

	.section-intro {
		margin-bottom: var(--spacing-6) !important;
	}

	.grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--spacing-6);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.grid li {
		min-width: 0;
	}

	.skills {
		margin: 0 0 var(--spacing-4);
		padding-left: 1.25rem;
		max-width: 40rem;
		color: var(--text-primary);
		font: 400 var(--text-body-m-size) / var(--text-body-m-line) var(--font-sans);
	}

	.skills li + li {
		margin-top: var(--spacing-2);
	}

	.about-link,
	.contact-links a {
		min-height: 44px;
		display: inline-flex;
		align-items: center;
		color: var(--action-primary);
		font: 500 var(--text-label-m-size) / var(--text-label-m-line) var(--font-sans);
		text-decoration: none;
	}

	.about-link:hover,
	.contact-links a:hover {
		text-decoration: underline;
	}

	.about-link:focus-visible,
	.contact-links a:focus-visible {
		outline: 2px solid var(--action-focus);
		outline-offset: 2px;
		border-radius: var(--radius-sm);
	}

	.contact-links {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-4);
	}

	@media (min-width: 40rem) {
		.grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (min-width: 64rem) {
		.grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
</style>
