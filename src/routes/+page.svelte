<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import Button from '$lib/components/Button.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import TechIcon from '$lib/components/TechIcon.svelte';
	import { getFeaturedProjects, projectPath } from '$lib/data/projects';
	import { homeTechs, uxSkills } from '$lib/data/skills';
	import { prefersReducedMotion } from 'svelte/motion';
	import { on } from 'svelte/events';
	import type { Attachment } from 'svelte/attachments';
	import { snapBlocks } from '$lib/snap-blocks';

	const name = 'Timothée Hennequin';
	const email = 'timothennequin@gmail.com';
	const linkedInHref = 'https://www.linkedin.com/in/timothee-hennequin/';
	const featuredProjects = getFeaturedProjects();
	const projectCount = featuredProjects.length;

	let projectScroller: HTMLUListElement | undefined;
	let projectIndex = $state(0);
	let projectScrollLock = false;
	let projectScrollTimer = 0;

	function syncProjectIndex() {
		if (projectScrollLock) {
			return;
		}

		const root = projectScroller;
		if (!root) {
			return;
		}

		const items = [...root.children] as HTMLElement[];
		if (items.length === 0) {
			return;
		}

		let closest = 0;
		let min = Number.POSITIVE_INFINITY;

		for (let i = 0; i < items.length; i += 1) {
			const dist = Math.abs(items[i].offsetLeft - root.scrollLeft);
			if (dist < min) {
				min = dist;
				closest = i;
			}
		}

		projectIndex = closest;
	}

	function unlockProjectScroll() {
		projectScrollLock = false;
		syncProjectIndex();
	}

	function scrollToProject(index: number) {
		const root = projectScroller;
		if (!root) {
			return;
		}

		const next = Math.max(0, Math.min(index, projectCount - 1));
		const item = root.children[next] as HTMLElement | undefined;
		if (!item) {
			return;
		}

		projectIndex = next;
		projectScrollLock = true;
		window.clearTimeout(projectScrollTimer);
		root.scrollTo({
			left: item.offsetLeft,
			behavior: prefersReducedMotion.current ? 'auto' : 'smooth'
		});
		projectScrollTimer = window.setTimeout(unlockProjectScroll, 450);
	}

	const projectCarousel: Attachment<HTMLUListElement> = (node) => {
		projectScroller = node;
		const offScroll = on(node, 'scroll', syncProjectIndex);
		const offScrollEnd = on(node, 'scrollend', unlockProjectScroll);

		return () => {
			window.clearTimeout(projectScrollTimer);
			offScroll();
			offScrollEnd();
			if (projectScroller === node) {
				projectScroller = undefined;
			}
		};
	};
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
		<div class="hero-copy">
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
		</div>

		<aside class="proofs" aria-label="Points clés">
			<dl class="proofs-list">
				<div class="proof-note">
					<dt>Développement web</dt>
					<dd>Expérience professionnelle</dd>
				</div>
				<div class="proof-note">
					<dt>UX/UI Design</dt>
					<dd>Certification niveau 6 en cours</dd>
				</div>
				<div class="proof-note">
					<dt>Produit en production</dt>
					<dd>Vroum · +90 000 visites en 2025</dd>
				</div>
			</dl>
		</aside>
	</section>

	<section id="projets" class="section section-flush snap-block" aria-labelledby="projets-title">
		<h2 id="projets-title" class="ds-h2">Projets sélectionnés</h2>
		<div class="projects-carousel">
			<ul id="projets-carousel" class="grid" {@attach projectCarousel}>
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
			<div class="carousel-nav">
				<button
					class="carousel-btn"
					type="button"
					onclick={() => scrollToProject(projectIndex - 1)}
					disabled={projectIndex === 0}
					aria-controls="projets-carousel"
					aria-label="Projet précédent"
				>
					<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<path
							d="M14.5 6.5 9 12l5.5 5.5"
							stroke="currentColor"
							stroke-width="1.75"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</button>
				<div class="carousel-indicator">
					<p class="carousel-status" aria-live="polite">
						{projectIndex + 1} / {projectCount}
					</p>
					<div class="carousel-dots">
						{#each featuredProjects as project, i (project.slug)}
							<button
								class={['carousel-dot', i === projectIndex && 'active']}
								type="button"
								onclick={() => scrollToProject(i)}
								aria-label="Aller au projet {project.title}"
								aria-current={i === projectIndex ? 'true' : undefined}
								aria-controls="projets-carousel"
							>
								<span></span>
							</button>
						{/each}
					</div>
				</div>
				<button
					class="carousel-btn"
					type="button"
					onclick={() => scrollToProject(projectIndex + 1)}
					disabled={projectIndex === projectCount - 1}
					aria-controls="projets-carousel"
					aria-label="Projet suivant"
				>
					<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<path
							d="M9.5 6.5 15 12l-5.5 5.5"
							stroke="currentColor"
							stroke-width="1.75"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</button>
			</div>
		</div>
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
		display: grid;
		gap: var(--spacing-8);
		margin-bottom: clamp(var(--spacing-10), 6vw, var(--spacing-16));
	}

	.hero-copy {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--spacing-4);
		min-width: 0;
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
		min-width: 0;
	}

	.proofs-list {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: stretch;
		gap: var(--spacing-3);
		margin: 0;
		padding-block: var(--spacing-1);
		overflow-x: auto;
		overscroll-behavior-x: contain;
		scrollbar-width: thin;
		scroll-snap-type: x proximity;
		-webkit-overflow-scrolling: touch;
	}

	.proof-note {
		position: relative;
		flex: 0 0 auto;
		width: max-content;
		max-width: none;
		padding: var(--spacing-3) var(--spacing-5) var(--spacing-3) var(--spacing-8);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-md);
		background: var(--surface-elevated);
		scroll-snap-align: start;
	}

	.proof-note::before {
		content: '';
		position: absolute;
		top: 0.5rem;
		left: 0.5rem;
		width: 0.7rem;
		height: 0.7rem;
		border: 1px solid var(--border-default);
		border-radius: var(--radius-full);
		background: var(--surface-subtle);
		box-shadow: 0 0 0 2px var(--surface-elevated);
		pointer-events: none;
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

	.section-flush {
		padding: 0;
		border: none;
		background: transparent;
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

	.projects-carousel {
		--project-card-max-width: none;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-4);
	}

	.grid {
		display: flex;
		gap: var(--spacing-4);
		margin: 0;
		padding: 0;
		list-style: none;
		overflow-x: auto;
		overscroll-behavior-x: contain;
		scroll-snap-type: x mandatory;
		scrollbar-width: none;
		-webkit-overflow-scrolling: touch;
	}

	.grid::-webkit-scrollbar {
		display: none;
	}

	.grid li {
		flex: 0 0 100%;
		min-width: 0;
		scroll-snap-align: start;
	}

	.carousel-nav {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-2);
	}

	.carousel-btn {
		flex-shrink: 0;
		min-width: 44px;
		min-height: 44px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		border: 1px solid var(--border-default);
		border-radius: var(--radius-md);
		background: var(--surface-elevated);
		color: var(--text-primary);
		cursor: pointer;
		transition: opacity 160ms ease, background-color 160ms ease, border-color 160ms ease;
	}

	.carousel-btn svg {
		display: block;
		width: 1.25rem;
		height: 1.25rem;
	}

	.carousel-btn:hover:not(:disabled) {
		background: var(--surface-subtle);
		border-color: var(--border-strong);
	}

	.carousel-btn:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	.carousel-btn:focus-visible {
		outline: 2px solid var(--action-focus);
		outline-offset: 2px;
	}

	.carousel-indicator {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-1);
		min-width: 0;
	}

	.projects-carousel .carousel-status {
		margin: 0;
		max-width: none;
		color: var(--text-secondary);
		font: 500 var(--text-label-m-size) / var(--text-label-m-line) var(--font-sans);
	}

	.carousel-dots {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.carousel-dot {
		flex: 0 0 44px;
		min-width: 44px;
		min-height: 32px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		border: 0;
		background: transparent;
		cursor: pointer;
	}

	.carousel-dot span {
		position: relative;
		display: block;
		width: 1.25rem;
		height: 0.5rem;
		background: transparent;
	}

	.carousel-dot span::after {
		content: '';
		position: absolute;
		inset-block: 0;
		inset-inline: 50%;
		width: 0.5rem;
		height: 0.5rem;
		margin-inline-start: -0.25rem;
		border-radius: var(--radius-full);
		background: var(--border-strong);
		transition:
			width 180ms ease,
			margin-inline-start 180ms ease,
			background-color 180ms ease;
	}

	.carousel-dot.active span::after {
		width: 1.25rem;
		margin-inline-start: -0.625rem;
		background: var(--action-primary);
	}

	.carousel-dot:focus-visible {
		outline: 2px solid var(--action-focus);
		outline-offset: 2px;
		border-radius: var(--radius-sm);
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
		--tech-icon-size: 1.5rem;
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
		.proofs-list {
			gap: var(--spacing-4);
		}

		.projects-carousel {
			--project-card-max-width: 390px;
		}

		.carousel-nav {
			display: none;
		}

		.grid {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: var(--spacing-6);
			overflow: visible;
			scroll-snap-type: none;
		}

		.grid li {
			flex: unset;
			scroll-snap-align: none;
		}

		.tech-grid {
			grid-template-columns: repeat(5, minmax(0, 1fr));
		}
	}

	@media (min-width: 64rem) {
		.hero {
			grid-template-columns: minmax(0, 2fr) minmax(14rem, 1fr);
			align-items: center;
			column-gap: clamp(var(--spacing-6), 4vw, var(--spacing-12));
		}

		.proofs {
			padding-block: var(--spacing-4);
			padding-inline: var(--spacing-4) var(--spacing-2);
		}

		.proofs-list {
			flex-direction: column;
			flex-wrap: nowrap;
			align-items: flex-end;
			gap: clamp(var(--spacing-5), 2.4vw, var(--spacing-8));
			overflow: visible;
			padding-block: 0;
			scroll-snap-type: none;
		}

		.proof-note {
			scroll-snap-align: none;
		}

		.proof-note:nth-child(1) {
			transform: rotate(4deg);
		}

		.proof-note:nth-child(2) {
			transform: rotate(3deg) translateX(calc(-1 * var(--spacing-12)));
		}

		.proof-note:nth-child(3) {
			transform: rotate(5deg);
		}

		.grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}

		.tech-grid {
			grid-template-columns: repeat(9, minmax(0, 1fr));
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.proof-note {
			transform: none !important;
		}

		.grid {
			scroll-behavior: auto;
		}

		.carousel-btn,
		.carousel-dot span::after {
			transition: none;
		}
	}
</style>
