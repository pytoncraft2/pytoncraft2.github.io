<script lang="ts">
	import { asset } from '$app/paths';
	import Button from '#lib/components/Button.svelte';
	import ProjectCard from '#lib/components/ProjectCard.svelte';
	import TechIcon from '#lib/components/TechIcon.svelte';
	import { getFeaturedProjects } from '#lib/data/projects.js';
	import { homeTechs } from '#lib/data/skills.js';
	import { prefersReducedMotion } from 'svelte/motion';
	import { on } from 'svelte/events';
	import type { Attachment } from 'svelte/attachments';
	import { snapBlocks } from '#lib/snap-blocks.js';
	import type { Snapshot } from './$types';

	const name = 'Timothée Hennequin';
	const email = 'timothennequin@gmail.com';
	const linkedInHref = 'https://www.linkedin.com/in/timothee-hennequin/';
	const featuredProjects = getFeaturedProjects();
	const projectCount = featuredProjects.length;

	const careerSteps = [
		{
			id: 'webacademie',
			period: '2020–2022',
			name: 'Web@cadémie',
			detail: 'Formation en développement web, Nancy.'
		},
		{
			id: 'easysav',
			period: '2021–2025',
			name: 'EasySAV',
			detail: 'Développeur web en alternance, Metz.'
		},
		{
			id: 'epitech',
			period: '2022–2025',
			name: 'Epitech',
			detail:
				'Pré-MSc puis MSc IoT, Nancy. Titre obtenu : « Architecte logiciel, développeur d’applications », niveau\u00A07.'
		},
		{
			id: 'openclassrooms',
			period: 'Depuis 2026',
			name: 'OpenClassrooms',
			detail: 'Formation Product Designer, certification UX/UI Designer niveau\u00A06 en cours.'
		}
	];

	let projectScroller: HTMLUListElement | undefined;
	let projectIndex = $state(0);
	let visibleCount = $state(1);
	let projectScrollLock = false;
	let projectScrollTimer = 0;
	let initialProjectIndex = 0;

	export const snapshot: Snapshot<number> = {
		capture: () => projectIndex,
		restore: (index) => {
			initialProjectIndex = Math.max(0, Math.min(index, projectCount - 1));
			projectIndex = initialProjectIndex;
			if (projectScroller) {
				projectScroller.scrollLeft = projectOffset(projectScroller, initialProjectIndex);
			}
		}
	};

	function projectOffset(root: HTMLElement, index: number) {
		return (root.children[index] as HTMLElement | undefined)?.offsetLeft ?? 0;
	}

	const pageCount = $derived(Math.max(1, Math.ceil(projectCount / visibleCount)));
	const pageIndex = $derived(Math.min(pageCount - 1, Math.floor(projectIndex / visibleCount)));
	const previousLabel = $derived(visibleCount > 1 ? 'Projets précédents' : 'Projet précédent');
	const nextLabel = $derived(visibleCount > 1 ? 'Projets suivants' : 'Projet suivant');

	function pageLabel(page: number) {
		const start = page * visibleCount;
		const end = Math.min(projectCount, start + visibleCount);
		const titles = featuredProjects.slice(start, end).map((project) => project.title);
		if (titles.length <= 1) {
			return `Aller au projet ${titles[0] ?? ''}`;
		}

		const last = titles[titles.length - 1];
		return `Afficher ${titles.slice(0, -1).join(', ')} et ${last}`;
	}

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

	function measureVisibleCount() {
		const root = projectScroller;
		const first = root?.children[0] as HTMLElement | undefined;
		if (!root || !first || first.offsetWidth === 0) {
			return;
		}

		const styles = getComputedStyle(root);
		const gap = Number.parseFloat(styles.columnGap) || Number.parseFloat(styles.gap) || 0;
		const count = Math.round((root.clientWidth + gap) / (first.offsetWidth + gap));
		const next = Math.max(1, Math.min(count, projectCount));
		if (next === visibleCount) {
			return;
		}

		visibleCount = next;
		const aligned = Math.floor(projectIndex / next) * next;
		if (aligned !== projectIndex) {
			scrollToProject(aligned);
		}
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

	function scrollToPage(page: number) {
		const bounded = Math.max(0, Math.min(page, pageCount - 1));
		scrollToProject(bounded * visibleCount);
	}

	const projectCarousel: Attachment<HTMLUListElement> = (node) => {
		projectScroller = node;
		const started = performance.now();
		let corrections = 0;

		function keepInitialPage() {
			const left = projectOffset(node, initialProjectIndex);
			if (performance.now() - started > 500 || corrections >= 3 || node.scrollLeft === left) {
				return false;
			}

			corrections += 1;
			node.scrollLeft = left;
			projectIndex = initialProjectIndex;
			return true;
		}

		keepInitialPage();
		const offScroll = on(node, 'scroll', () => {
			if (keepInitialPage()) {
				return;
			}

			syncProjectIndex();
		});
		const offScrollEnd = on(node, 'scrollend', unlockProjectScroll);
		const observer = new ResizeObserver(() => {
			measureVisibleCount();
		});
		observer.observe(node);
		measureVisibleCount();

		return () => {
			observer.disconnect();
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
	<title>{name} • Développeur web & UX/UI Designer</title>
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
				Je conçois et développe des applications web en intégrant les besoins utilisateurs et les contraintes techniques dès la conception.
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

	<section class="section section-flush snap-block" aria-labelledby="projets">
		<h2 id="projets" class="ds-h2">Projets sélectionnés</h2>
		<div class="projects-carousel">
			<ul id="projets-carousel" class="grid" {@attach projectCarousel}>
				{#each featuredProjects as project (project.slug)}
					<li>
						<ProjectCard
							slug={project.slug}
							title={project.title}
							tags={project.tags}
							description={project.description}
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
					onclick={() => scrollToPage(pageIndex - 1)}
					disabled={pageIndex === 0}
					aria-controls="projets-carousel"
					aria-label={previousLabel}
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
						{pageIndex + 1} / {pageCount}
					</p>
					<div class="carousel-dots">
						{#each { length: pageCount }, i (i)}
							<button
								class={['carousel-dot', i === pageIndex && 'active']}
								type="button"
								onclick={() => scrollToPage(i)}
								aria-label={pageLabel(i)}
								aria-current={i === pageIndex ? 'true' : undefined}
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
					onclick={() => scrollToPage(pageIndex + 1)}
					disabled={pageIndex === pageCount - 1}
					aria-controls="projets-carousel"
					aria-label={nextLabel}
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

	<section id="profil" class="section profil snap-block" aria-labelledby="profil-title">
		<h2 id="profil-title" class="ds-h2">Profil</h2>
		<p class="ds-body-m">
			Développeur web, j’interviens aujourd’hui sur la réalisation d’applications et sur la conception UX/UI, de
			l’analyse des besoins jusqu’à l’interface.
		</p>
		<h3 id="parcours-title" class="subhead">Parcours</h3>
		<ul class="timeline" aria-labelledby="parcours-title">
			{#each careerSteps as step (step.id)}
				<li class="step">
					<span class="step-mark" aria-hidden="true"></span>
					<div class="step-body">
						<p class="step-date">{step.period}</p>
						<p class="step-name">{step.name}</p>
						<p class="step-detail">{step.detail}</p>
					</div>
				</li>
			{/each}
		</ul>
		<h3 id="tech-title" class="subhead">Technologies</h3>
		<ul class="tech-grid" aria-labelledby="tech-title">
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
		corner-bottom-left-shape: bevel;
	}

	.proof-note::before {
		content: '';
		position: absolute;
		top: 0.5rem;
		left: 0.5rem;
		width: 0.7rem;
		height: 0.7rem;
		border: 1px solid var(--scrollbar-thumb);
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
		position: relative;
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

	.profil .subhead {
		margin: var(--spacing-6) 0 var(--spacing-3);
		color: var(--text-primary);
		font: 600 var(--text-body-m-size) / var(--text-body-m-line) var(--font-sans);
	}

	.profil .subhead:first-of-type {
		margin-top: var(--spacing-2);
	}

	.timeline {
		display: flex;
		flex-direction: column;
		gap: 0;
		margin: 0 0 var(--spacing-4);
		padding: 0;
		list-style: none;
	}

	.step {
		display: grid;
		grid-template-columns: 0.75rem minmax(0, 1fr);
		column-gap: var(--spacing-3);
	}

	.step-mark {
		position: relative;
	}

	.step-mark::before {
		content: '';
		position: absolute;
		z-index: 1;
		top: 0.4rem;
		left: 0;
		width: 0.5rem;
		height: 0.5rem;
		border-radius: var(--radius-full);
		background: var(--action-primary);
		box-shadow: 0 0 0 3px var(--surface-elevated);
	}

	.step-mark::after {
		content: '';
		position: absolute;
		z-index: 0;
		top: 0.7rem;
		bottom: -0.45rem;
		left: calc(0.25rem - 0.5px);
		width: 1px;
		background: var(--border-strong);
	}

	.step:last-child .step-mark::after {
		display: none;
	}

	.step-body {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-1);
		min-width: 0;
		padding-bottom: var(--spacing-5);
	}

	.step:last-child .step-body {
		padding-bottom: 0;
	}

	.timeline p {
		margin: 0;
		max-width: none;
	}

	.step-date {
		color: var(--text-secondary);
		font: 600 var(--text-label-m-size) / var(--text-label-m-line) var(--font-sans);
	}

	.step-name {
		color: var(--text-primary);
		font: 600 var(--text-body-m-size) / var(--text-body-m-line) var(--font-sans);
	}

	.step-detail {
		color: var(--text-secondary);
		font: 400 var(--text-body-s-size) / var(--text-body-s-line) var(--font-sans);
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

	.contact-links a {
		min-height: 44px;
		display: inline-flex;
		align-items: center;
		color: var(--action-primary);
		font: 500 var(--text-label-m-size) / var(--text-label-m-line) var(--font-sans);
		text-decoration: none;
	}

	.contact-links a:hover {
		text-decoration: underline;
	}

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

		.grid {
			gap: var(--spacing-6);
		}

		.grid li {
			flex-basis: calc((100% - var(--spacing-6)) / 2);
		}

		.tech-grid {
			grid-template-columns: repeat(5, minmax(0, 1fr));
		}
	}

	@media (min-width: 64rem) {
		.timeline {
			display: grid;
			grid-template-columns: repeat(4, minmax(0, 1fr));
			column-gap: var(--spacing-5);
		}

		.step {
			display: flex;
			flex-direction: column;
			gap: var(--spacing-2);
			position: relative;
			padding-top: calc(0.5rem + var(--spacing-3));
		}

		.step-mark {
			position: absolute;
			top: 0;
			right: 0;
			left: 0;
			height: 0.5rem;
		}

		.step-mark::before {
			top: 0;
		}

		.step-mark::after {
			top: calc(0.25rem - 0.5px);
			right: calc(-1 * var(--spacing-5) - 0.15rem);
			bottom: auto;
			left: 0.5rem;
			width: auto;
			height: 1px;
		}

		.step-body {
			padding-bottom: 0;
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

		.grid li {
			flex-basis: calc((100% - 2 * var(--spacing-6)) / 3);
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
