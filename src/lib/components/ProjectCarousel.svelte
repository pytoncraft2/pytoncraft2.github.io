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

	function pageLabel(page: number) {
		const start = page * visibleCount;
		const end = Math.min(projectCount, start + visibleCount);
		const titles = projects.slice(start, end).map((project) => project.title);
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

		measureVisibleCount();
		initialProjectIndex = Math.floor(initialProjectIndex / visibleCount) * visibleCount;
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
			<div class="carousel-dots" style:--dot-count={pageCount}>
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

	.carousel-status {
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
		flex: 0 0 clamp(24px, (100vw - 10rem) / var(--dot-count), 44px);
		min-width: 0;
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

		.carousel-btn,
		.carousel-dot span::after {
			transition: none;
		}
	}
</style>
