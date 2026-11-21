<script module lang="ts">
	/** Données sérialisables passées par Astro à l’île (pas d’objet de collection). */
	export type CarouselProject = {
		slug: string;
		href: string;
		title: string;
		tags: string[];
		description: string;
		imageSrc?: string;
		imageAlt: string;
	};
</script>

<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { on } from 'svelte/events';
	import type { Attachment } from 'svelte/attachments';
	import ProjectCard from './ProjectCard.svelte';

	let { projects }: { projects: CarouselProject[] } = $props();

	const storageKey = 'home-projects';
	const projectCount = $derived(projects.length);

	let projectScroller: HTMLUListElement | undefined;
	let projectIndex = $state(0);
	let visibleCount = $state(1);
	// Faux tant que le nombre de projets par page n'est pas mesuré : la page générée au build
	// ne connaît pas la largeur d'écran (elle compterait « 1 / 8 »).
	let measured = $state(false);
	let projectScrollLock = false;
	let projectScrollTimer = 0;
	let initialProjectIndex = originProjectIndex();

	/**
	 * Projet à afficher au chargement : celui dont on revient (posé par le script de
	 * transition de BaseLayout), sinon la position mémorisée lors d’un retour arrière.
	 * Remplace `snapshot` de SvelteKit, qui n’existe pas dans un site multipage.
	 */
	function originProjectIndex() {
		if (typeof document === 'undefined') {
			return 0;
		}

		const slug = document.documentElement.dataset.projectTransition;
		const fromProject = projects.findIndex((project) => project.slug === slug);
		if (fromProject !== -1) {
			return fromProject;
		}

		try {
			const [entry] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
			const stored = Number(sessionStorage.getItem(storageKey));
			if (entry?.type === 'back_forward' && Number.isInteger(stored)) {
				return Math.max(0, Math.min(stored, projects.length - 1));
			}
		} catch {
			// Stockage indisponible : on repart du premier projet.
		}

		return 0;
	}

	$effect(() => {
		try {
			sessionStorage.setItem(storageKey, String(projectIndex));
		} catch {
			// Position non mémorisée, sans conséquence.
		}
	});

	function projectOffset(root: HTMLElement, index: number) {
		return (root.children[index] as HTMLElement | undefined)?.offsetLeft ?? 0;
	}

	const pageCount = $derived(Math.max(1, Math.ceil(projectCount / visibleCount)));
	const pageIndex = $derived(Math.min(pageCount - 1, Math.floor(projectIndex / visibleCount)));
	const previousLabel = $derived(visibleCount > 1 ? 'Projets précédents' : 'Projet précédent');
	const nextLabel = $derived(visibleCount > 1 ? 'Projets suivants' : 'Projet suivant');

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

		// En butée à droite : la dernière page, même incomplète (8 projets par 3 : la butée
		// montre les projets 6 à 8, dont le plus proche, le 6e, appartient à la page 2).
		const maxScroll = root.scrollWidth - root.clientWidth;
		if (maxScroll > 0 && root.scrollLeft >= maxScroll - 2) {
			projectIndex = (pageCount - 1) * visibleCount;
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
			behavior: (prefersReducedMotion.current || document.documentElement.hasAttribute('data-reduced-motion')) ? 'instant' : 'smooth'
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

		measureVisibleCount();
		measured = true;
		initialProjectIndex = Math.floor(initialProjectIndex / visibleCount) * visibleCount;
		// La page peut déjà être en place (script de retour de BaseLayout, avant le premier
		// rendu) : aucun défilement ne suivra, donc l'index est posé ici dans tous les cas.
		projectIndex = initialProjectIndex;
		keepInitialPage();
		const offScroll = on(node, 'scroll', () => {
			if (keepInitialPage()) {
				return;
			}

			// Défilement lancé par un bouton : l'index reste celui visé jusqu'à l'arrêt du
			// mouvement (fin de défilement, ou 150 ms sans défilement), sinon il suivrait les
			// cartes traversées (plusieurs clics enchaînent un défilement plus long).
			if (projectScrollLock) {
				window.clearTimeout(projectScrollTimer);
				projectScrollTimer = window.setTimeout(unlockProjectScroll, 150);
				return;
			}

			syncProjectIndex();
		});
		const offScrollEnd = on(node, 'scrollend', unlockProjectScroll);
		const observer = new ResizeObserver(() => {
			measureVisibleCount();
		});
		observer.observe(node);

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

<div class="projects-carousel">
	<ul id="projets-carousel" class="grid" {@attach projectCarousel}>
		{#each projects as project (project.slug)}
			<li>
				<ProjectCard
					slug={project.slug}
					href={project.href}
					title={project.title}
					tags={project.tags}
					description={project.description}
					imageSrc={project.imageSrc}
					imageAlt={project.imageAlt}
				/>
			</li>
		{/each}
	</ul>
	<div class={['carousel-nav', { pending: !measured }]}>
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
		<p class="carousel-status" aria-live="polite" aria-atomic="true">
			{pageIndex + 1} / {pageCount}
		</p>
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

<style>
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
		gap: var(--spacing-3);
	}

	/* Place réservée, contenu masqué jusqu'à la première mesure (voir `measured`). */
	.carousel-nav.pending {
		visibility: hidden;
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

	.carousel-status {
		margin: 0;
		max-width: none;
		color: var(--text-secondary);
		font: 500 var(--text-label-m-size) / var(--text-label-m-line) var(--font-sans);
	}

	@media (min-width: 40rem) {
		.grid {
			gap: var(--spacing-6);
		}

		.grid li {
			flex-basis: calc((100% - var(--spacing-6)) / 2);
		}
	}

	@media (min-width: 64rem) {
		.grid li {
			flex-basis: calc((100% - 2 * var(--spacing-6)) / 3);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.grid {
			scroll-behavior: auto;
		}

		.carousel-btn {
			transition: none;
		}
	}
</style>
