<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import Button from '$lib/components/Button.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import TechIcon from '$lib/components/TechIcon.svelte';
	import { getFeaturedProjects, projectPath } from '$lib/data/projects';
	import { homeTechs, uxSkills } from '$lib/data/skills';
	import { snapBlocks } from '$lib/snap-blocks';

	const name = 'Timothée Hennequin';
	const email = 'timothennequin@gmail.com';
	const linkedInHref = 'https://www.linkedin.com/in/timothee-hennequin/';
	const featuredProjects = getFeaturedProjects();
</script>

<svelte:head>
	<title>{name} — Développeur web & UX/UI Designer</title>
	<meta
		name="description"
		content="Portfolio de {name}, développeur web & UX/UI Designer : développement web, conception d’interfaces, prototypage et accessibilité."
	/>
</svelte:head>

<div class="page" {@attach snapBlocks}>
	<section class="hero snap-block" aria-labelledby="hero-title">
		<p class="eyebrow ds-label-m">Portfolio</p>
		<h1 id="hero-title" class="ds-h1">{name}</h1>
		<p class="role ds-body-l">Développeur web & UX/UI Designer</p>
		<p class="intro ds-body-m">
			Je conçois et développe des applications web en reliant besoins utilisateurs, conception d’interface
			et faisabilité technique. Mon expérience en développement me permet d’intégrer les contraintes
			techniques dès la conception et d’assurer une continuité entre les choix UX/UI et leur implémentation.
		</p>
		<div class="actions">
			<Button href="#projets">Voir mes projets</Button>
			<Button href="#contact" variant="secondary">Me contacter</Button>
		</div>
	</section>

	<section class="proofs snap-block" aria-label="Points clés">
		<dl class="proofs-list">
			<div>
				<dt>Développement web</dt>
				<dd>Expérience professionnelle</dd>
			</div>
			<div>
				<dt>UX/UI Design</dt>
				<dd>Certification niveau 6 en cours</dd>
			</div>
			<div>
				<dt>Produit en production</dt>
				<dd>Vroum · +90 000 visites en 2025</dd>
			</div>
		</dl>
	</section>

	<section id="projets" class="section snap-block" aria-labelledby="projets-title">
		<h2 id="projets-title" class="ds-h2">Projets sélectionnés</h2>
		<ul class="grid">
			{#each featuredProjects as project (project.slug)}
				<li>
					<ProjectCard
						title={project.title}
						tags={project.tags}
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
			professionnel et associatif. Je poursuis aujourd’hui une formation Product Designer chez OpenClassrooms,
			préparant à la certification UX/UI Designer (RNCP40917, niveau 6), afin d’élargir mon champ d’intervention
			de l’analyse des besoins jusqu’à la conception et l’implémentation des interfaces.
		</p>
		<h3 class="ds-h3">Compétences</h3>
		<div class="skills">
			<section class="skill-block" aria-labelledby="tech-title">
				<h4 id="tech-title" class="skill-heading">Technologies & outils</h4>
				<ul class="tech-grid">
					{#each homeTechs as item (item.id)}
						<li>
							<span class="tech-item">
								<TechIcon name={item.id} />
								<span>{item.label}</span>
							</span>
						</li>
					{/each}
				</ul>
			</section>
			<section class="skill-block" aria-labelledby="ux-title">
				<h4 id="ux-title" class="skill-heading">UX/UI Design</h4>
				<p class="ux-skills">{uxSkills.join(' · ')}</p>
			</section>
		</div>
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

	.intro {
		max-width: 40rem;
		color: var(--text-secondary);
	}

	.proofs {
		margin-bottom: var(--spacing-8);
		padding: var(--spacing-6) var(--spacing-8);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-lg);
		background: var(--surface-elevated);
	}

	.proofs-list {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--spacing-5);
		margin: 0;
	}

	.proofs-list dt {
		margin: 0 0 var(--spacing-1);
		color: var(--text-primary);
		font: 600 var(--text-body-m-size) / var(--text-body-m-line) var(--font-sans);
	}

	.proofs-list dd {
		margin: 0;
		color: var(--text-secondary);
		font: 400 var(--text-body-s-size) / var(--text-body-s-line) var(--font-sans);
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
		display: flex;
		flex-direction: column;
		gap: var(--spacing-4);
		margin: 0 0 var(--spacing-4);
	}

	.skill-heading {
		margin: 0 0 var(--spacing-2);
		color: var(--text-primary);
		font: 600 var(--text-body-m-size) / var(--text-body-m-line) var(--font-sans);
	}

	.tech-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--spacing-3) var(--spacing-2);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.tech-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-1);
		min-width: 0;
		--tech-icon-size: 1.25rem;
		color: var(--text-secondary);
		text-align: center;
		font: 500 0.75rem / 1rem var(--font-sans);
	}

	.tech-item span {
		color: var(--text-primary);
	}

	.ux-skills {
		margin: 0;
		max-width: 40rem;
		color: var(--text-secondary);
		font: 400 var(--text-body-s-size) / var(--text-body-s-line) var(--font-sans);
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

		.tech-grid {
			grid-template-columns: repeat(5, minmax(0, 1fr));
		}
	}

	@media (min-width: 64rem) {
		.proofs-list {
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: var(--spacing-6);
		}

		.proofs-list > div + div {
			padding-left: var(--spacing-6);
			border-left: 1px solid var(--border-default);
		}

		.grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}

		.tech-grid {
			grid-template-columns: repeat(9, minmax(0, 1fr));
		}
	}
</style>
