<script lang="ts">
	import { onMount } from 'svelte';
	import { withBase } from '#lib/paths.js';

	/** Chemin de la page courante, fourni par Astro (Astro.url.pathname). */
	let { pathname }: { pathname: string } = $props();

	const homeHref = withBase('/');
	const storageKey = 'dock-placement';
	const dragThreshold = 8;

	type DockPlacement = 'bottom' | 'left' | 'right';

	let placement = $state<DockPlacement>('left');
	let dragging = $state(false);
	let dragX = $state(0);
	let dragY = $state(0);
	let grabX = $state(0);
	let grabY = $state(0);

	let pending = false;
	let startX = 0;
	let startY = 0;
	let ignoreClick = false;
	let visible = $state(true);
	// Empêche le show/hide pendant le premier scroll déclenché par un hash (comme svelte.dev)
	let hashChanged = false;
	let lastScroll = 0;

	function isDockPlacement(value: string | null | undefined): value is DockPlacement {
		return value === 'bottom' || value === 'left' || value === 'right';
	}

	function isDesktop() {
		return window.matchMedia('(min-width: 40rem)').matches;
	}

	function persistPlacement(next: DockPlacement) {
		placement = next;
		document.documentElement.dataset.dock = next;
		localStorage.setItem(storageKey, next);
	}

	function nearestPlacement(x: number, y: number): DockPlacement {
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		const points: Record<DockPlacement, { x: number; y: number }> = {
			bottom: { x: vw / 2, y: vh },
			left: { x: 0, y: vh / 2 },
			right: { x: vw, y: vh / 2 }
		};

		let next: DockPlacement = 'bottom';
		let min = Number.POSITIVE_INFINITY;

		for (const key of ['bottom', 'left', 'right'] as const) {
			const point = points[key];
			const dist = (x - point.x) ** 2 + (y - point.y) ** 2;
			if (dist < min) {
				min = dist;
				next = key;
			}
		}

		return next;
	}

	function clearDragStyles() {
		document.body.style.userSelect = '';
		document.body.style.cursor = '';
	}

	function beginDrag(event: PointerEvent, dock: HTMLElement) {
		if (event.button !== 0 || !isDesktop()) {
			return;
		}

		const rect = dock.getBoundingClientRect();
		pending = true;
		startX = event.clientX;
		startY = event.clientY;
		grabX = event.clientX - rect.left;
		grabY = event.clientY - rect.top;
	}

	function onPointerMove(event: PointerEvent) {
		if (!pending && !dragging) {
			return;
		}

		const x = event.clientX;
		const y = event.clientY;

		if (!dragging) {
			if (Math.hypot(x - startX, y - startY) < dragThreshold) {
				return;
			}

			dragging = true;
			ignoreClick = true;
			document.body.style.userSelect = 'none';
			document.body.style.cursor = 'grabbing';
		}

		dragX = x;
		dragY = y;
	}

	function onPointerUp(event: PointerEvent) {
		pending = false;

		if (!dragging) {
			return;
		}

		dragging = false;
		clearDragStyles();
		persistPlacement(nearestPlacement(event.clientX, event.clientY));
		window.setTimeout(() => {
			ignoreClick = false;
		}, 0);
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key !== 'Escape' || (!dragging && !pending)) {
			return;
		}

		pending = false;
		dragging = false;
		ignoreClick = false;
		clearDragStyles();
	}

	function onWindowClick(event: MouseEvent) {
		if (!ignoreClick) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();
		ignoreClick = false;
	}

	function onHashChange() {
		hashChanged = true;
		hash = window.location.hash;
	}

	function onWindowScroll() {
		const scroll = window.scrollY;
		if (!hashChanged) {
			visible = scroll === lastScroll ? visible : scroll < 50 || scroll < lastScroll;
		}

		lastScroll = scroll;
		hashChanged = false;
	}

	function dockDrag(node: HTMLElement) {
		function onPointerDown(event: PointerEvent) {
			beginDrag(event, node);
		}

		node.addEventListener('pointerdown', onPointerDown);
		window.addEventListener('click', onWindowClick, true);

		return () => {
			node.removeEventListener('pointerdown', onPointerDown);
			window.removeEventListener('click', onWindowClick, true);
		};
	}

	onMount(() => {
		const stored = document.documentElement.dataset.dock || localStorage.getItem(storageKey);
		if (isDockPlacement(stored)) {
			persistPlacement(stored);
		} else {
			placement = 'left';
			document.documentElement.dataset.dock = 'left';
		}

		lastScroll = window.scrollY;
		hash = window.location.hash;
	});

	const dropEdges = ['bottom', 'left', 'right'] as const;
	const preview = $derived(dragging ? nearestPlacement(dragX, dragY) : null);

	let hash = $state('');
	const isHome = $derived(pathname === homeHref || pathname === homeHref.replace(/\/$/, '') || pathname.endsWith('/index.html'));
	const isProject = $derived(pathname.includes('/projets/'));

	const items = $derived([
		{
			id: 'accueil',
			label: 'Accueil',
			href: homeHref,
			active: isHome && hash !== '#projets' && hash !== '#profil' && hash !== '#contact'
		},
		{
			id: 'projets',
			label: 'Projets',
			href: `${homeHref}#projets`,
			active: isProject || (isHome && hash === '#projets')
		},
		{
			id: 'profil',
			label: 'Profil',
			href: `${homeHref}#profil`,
			active: hash === '#profil'
		},
		{
			id: 'contact',
			label: 'Contact',
			href: `${homeHref}#contact`,
			active: hash === '#contact'
		}
	]);
</script>

<svelte:window
	onpointermove={onPointerMove}
	onpointerup={onPointerUp}
	onpointercancel={onPointerUp}
	onkeydown={onKeydown}
	onscroll={onWindowScroll}
	onhashchange={onHashChange}
/>

{#if dragging}
	<div class="slots" aria-hidden="true">
		{#each dropEdges as edge (edge)}
			<div class={['slot', preview === edge && 'active']} data-edge={edge}></div>
		{/each}
	</div>
{/if}

<nav
	id="menu"
	class={['dock', { dragging, visible }]}
	style:--drag-x="{dragX}px"
	style:--drag-y="{dragY}px"
	style:--grab-x="{grabX}px"
	style:--grab-y="{grabY}px"
	aria-label="Principale"
	data-placement={placement}
	tabindex="-1"
	{@attach dockDrag}
>
	<ul class="items">
		{#each items as item (item.id)}
			<li>
				<a
					class="item"
					class:active={item.active}
					href={item.href}
					aria-current={item.active ? 'page' : undefined}
				>
					<span class="icon" aria-hidden="true">
						{#if item.id === 'accueil'}
							<svg viewBox="0 0 24 24" fill="none">
								<path
									d="M4 11 12 4l8 7"
									stroke="currentColor"
									stroke-width="1.75"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
								<path
									d="M6 10.5V20h12v-9.5"
									stroke="currentColor"
									stroke-width="1.75"
									stroke-linejoin="round"
								/>
							</svg>
						{:else if item.id === 'profil'}
							<svg viewBox="0 0 24 24" fill="none">
								<circle cx="12" cy="8" r="3.25" stroke="currentColor" stroke-width="1.75" />
								<path
									d="M5.5 19.25c.7-3.1 3.1-4.75 6.5-4.75s5.8 1.65 6.5 4.75"
									stroke="currentColor"
									stroke-width="1.75"
									stroke-linecap="round"
								/>
							</svg>
						{:else if item.id === 'projets'}
							<svg viewBox="0 0 24 24" fill="none">
								<path
									d="M4 8h6l1.5 2H20v10H4V8Z"
									stroke="currentColor"
									stroke-width="1.75"
									stroke-linejoin="round"
								/>
								<path d="M4 8V6h5l1.5 2" stroke="currentColor" stroke-width="1.75" />
							</svg>
						{:else}
							<svg viewBox="0 0 24 24" fill="none">
								<rect
									x="3.5"
									y="6"
									width="17"
									height="12"
									rx="1.5"
									stroke="currentColor"
									stroke-width="1.75"
								/>
								<path
									d="m4.5 7.5 7.5 5.5 7.5-5.5"
									stroke="currentColor"
									stroke-width="1.75"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						{/if}
					</span>
					<span class="label">{item.label}</span>
				</a>
			</li>
		{/each}
	</ul>
	<button
		class="handle"
		type="button"
		aria-label="Déplacer le dock"
	>
		<svg class="grip" viewBox="0 0 12 18" aria-hidden="true">
			<circle cx="3" cy="3" r="1.5" />
			<circle cx="9" cy="3" r="1.5" />
			<circle cx="3" cy="9" r="1.5" />
			<circle cx="9" cy="9" r="1.5" />
			<circle cx="3" cy="15" r="1.5" />
			<circle cx="9" cy="15" r="1.5" />
		</svg>
	</button>
</nav>

<style>
	.dock {
		position: fixed;
		z-index: 15;
		right: 0;
		bottom: 0;
		left: 0;
		padding: var(--spacing-2) var(--spacing-3) calc(var(--spacing-2) + env(safe-area-inset-bottom));
		border-top: 1px solid var(--border-default);
		background: var(--surface-elevated);
		view-transition-name: app-dock;
	}

	.dock:focus {
		outline: 2px solid var(--action-focus);
		outline-offset: 4px;
	}

	@media (max-width: 39.99rem) {
		.dock {
			transition: transform 0.2s;
		}

		.dock:not(.visible):not(:focus-within) {
			transform: translate(0, 100%);
		}
	}

	.items {
		display: flex;
		align-items: stretch;
		justify-content: space-between;
		gap: var(--spacing-1);
		width: min(100%, 32rem);
		margin: 0 auto;
		padding: 0;
		list-style: none;
	}

	.items > li {
		display: flex;
		flex: 1 1 0;
		min-width: 0;
	}

	.item {
		min-width: 44px;
		min-height: 44px;
		display: flex;
		flex: 1 1 auto;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-1);
		padding: var(--spacing-2) var(--spacing-3);
		border-radius: var(--radius-md);
		color: var(--text-primary);
		text-decoration: none;
	}

	.item:hover {
		background: var(--surface-subtle);
	}

	.item.active {
		color: var(--action-primary);
		background: var(--surface-subtle);
	}

	.item:focus-visible {
		outline: 2px solid var(--action-focus);
		outline-offset: 2px;
	}

	.icon {
		display: flex;
		width: 1.5rem;
		height: 1.5rem;
	}

	.icon svg {
		width: 100%;
		height: 100%;
	}

	.label {
		font: 500 0.75rem / 1 var(--font-sans);
	}

	.handle {
		display: none;
	}

	.slots {
		display: none;
	}

	@media (min-width: 40rem) {
		.dock {
			--dock-bevel: 3.5rem;
			right: auto;
			bottom: var(--spacing-5);
			left: 50%;
			width: max-content;
			padding: var(--spacing-2) var(--spacing-3);
			border: 1px solid var(--border-default);
			border-radius: var(--radius-xl);
			transform: translateX(-50%);
			display: flex;
			align-items: center;
			cursor: grab;
		}

		.items {
			width: auto;
			gap: var(--spacing-2);
		}

		.items > li {
			flex: 0 0 auto;
		}

		.item {
			flex: 0 0 auto;
			min-width: 4.5rem;
			padding: var(--spacing-2) var(--spacing-3);
		}

		.handle {
			display: flex;
			flex-shrink: 0;
			order: -1;
			align-items: center;
			justify-content: center;
			min-width: 28px;
			min-height: 44px;
			margin: 0;
			padding: 0;
			border: 0;
			border-radius: var(--radius-md);
			background: transparent;
			cursor: grab;
		}

		.grip {
			display: block;
			width: 0.75rem;
			height: 1.125rem;
			fill: var(--text-secondary);
		}

		.handle:focus-visible {
			outline: 2px solid var(--action-focus);
			outline-offset: 2px;
		}

		/*
		 * Accueil, page en haut (`data-dock-horizon`, géré par dock-horizon.ts) : le dock,
		 * horizontal quelle que soit sa place, est centré sur l’horizon du paysage
		 * (`--dock-lift`). Au défilement, il rejoint sa place : en glissant s’il est en bas,
		 * en sortant puis en entrant (`data-dock-switch`) s’il est sur un côté.
		 */
		.dock:not(.dragging) {
			transition:
				translate 450ms cubic-bezier(0.4, 0, 0.2, 1),
				opacity 220ms ease;
		}

		:global(html[data-dock-horizon]) .dock:not(.dragging) {
			translate: 0 calc(-1 * var(--dock-lift, 0px));
		}

		:global(html[data-dock-switch]) .dock:not(.dragging) {
			opacity: 0;
		}

		:global(html[data-dock-switch='out']) .dock:not(.dragging) {
			transition:
				translate 180ms ease-in,
				opacity 180ms ease-in;
		}

		/* Nouvelle place posée sans transition, puis révélée à la fin du changement. */
		:global(html[data-dock-switch='in']) .dock:not(.dragging) {
			transition: none;
		}

		:global(html[data-dock-switch][data-dock-horizon]) .dock:not(.dragging) {
			translate: 0 calc(0.75rem - var(--dock-lift, 0px));
		}

		:global(html[data-dock-switch][data-dock='left']:not([data-dock-horizon])) .dock:not(.dragging) {
			translate: -0.75rem 0;
		}

		:global(html[data-dock-switch][data-dock='right']:not([data-dock-horizon])) .dock:not(.dragging) {
			translate: 0.75rem 0;
		}

		.dock.dragging,
		.dock.dragging .handle {
			cursor: grabbing;
		}

		.dock.dragging {
			top: var(--drag-y);
			right: auto;
			bottom: auto;
			left: var(--drag-x);
			cursor: grabbing;
			transform: translate(calc(-1 * var(--grab-x)), calc(-1 * var(--grab-y)));
		}

		:global(html[data-dock='left']:not([data-dock-horizon])) .dock:not(.dragging) {
			top: 50%;
			right: auto;
			bottom: auto;
			left: 0;
			--dock-shape: polygon(
				0 0,
				100% var(--dock-bevel),
				100% calc(100% - var(--dock-bevel)),
				0 100%
			);
			padding: var(--dock-bevel) var(--spacing-3) var(--dock-bevel) var(--spacing-2);
			transform: translateY(-50%);
		}

		:global(html[data-dock='right']:not([data-dock-horizon])) .dock:not(.dragging) {
			top: 50%;
			right: 0;
			bottom: auto;
			left: auto;
			--dock-shape: polygon(
				100% 0,
				0 var(--dock-bevel),
				0 calc(100% - var(--dock-bevel)),
				100% 100%
			);
			padding: var(--dock-bevel) var(--spacing-2) var(--dock-bevel) var(--spacing-3);
			transform: translateY(-50%);
		}

		@supports (clip-path: shape(from 0 0, line to 0 0)) {
			:global(html[data-dock='left']:not([data-dock-horizon])) .dock:not(.dragging) {
				--dock-shape: shape(
					from 0 0,
					line to calc(100% - var(--dock-round)) calc(var(--dock-bevel) - var(--dock-round) / 2),
					curve to 100% calc(var(--dock-bevel) + var(--dock-round)) with 100% var(--dock-bevel),
					line to 100% calc(100% - var(--dock-bevel) - var(--dock-round)),
					curve to calc(100% - var(--dock-round)) calc(100% - var(--dock-bevel) + var(--dock-round) / 2)
						with 100% calc(100% - var(--dock-bevel)),
					line to 0 100%,
					close
				);
			}

			:global(html[data-dock='right']:not([data-dock-horizon])) .dock:not(.dragging) {
				--dock-shape: shape(
					from 100% 0,
					line to var(--dock-round) calc(var(--dock-bevel) - var(--dock-round) / 2),
					curve to 0 calc(var(--dock-bevel) + var(--dock-round)) with 0 var(--dock-bevel),
					line to 0 calc(100% - var(--dock-bevel) - var(--dock-round)),
					curve to var(--dock-round) calc(100% - var(--dock-bevel) + var(--dock-round) / 2)
						with 0 calc(100% - var(--dock-bevel)),
					line to 100% 100%,
					close
				);
			}
		}

		:global(html[data-dock='left']:not([data-dock-horizon])) .dock:not(.dragging),
		:global(html[data-dock='right']:not([data-dock-horizon])) .dock:not(.dragging) {
			--dock-round: 1rem;
			border: none;
			border-radius: 0;
			background: transparent;
		}

		:global(html[data-dock='left']:not([data-dock-horizon])) .dock:not(.dragging)::before,
		:global(html[data-dock='left']:not([data-dock-horizon])) .dock:not(.dragging)::after,
		:global(html[data-dock='right']:not([data-dock-horizon])) .dock:not(.dragging)::before,
		:global(html[data-dock='right']:not([data-dock-horizon])) .dock:not(.dragging)::after {
			content: '';
			position: absolute;
			z-index: -1;
			inset: 0;
			clip-path: var(--dock-shape);
		}

		:global(html[data-dock='left']:not([data-dock-horizon])) .dock:not(.dragging)::before,
		:global(html[data-dock='right']:not([data-dock-horizon])) .dock:not(.dragging)::before {
			background: var(--border-default);
		}

		:global(html[data-dock='left']:not([data-dock-horizon])) .dock:not(.dragging)::after,
		:global(html[data-dock='right']:not([data-dock-horizon])) .dock:not(.dragging)::after {
			background: var(--surface-elevated);
		}

		:global(html[data-dock='left']:not([data-dock-horizon])) .dock:not(.dragging)::after {
			inset: 1px 1px 1px 0;
		}

		:global(html[data-dock='right']:not([data-dock-horizon])) .dock:not(.dragging)::after {
			inset: 1px 0 1px 1px;
		}

		:global(html[data-dock='left']:not([data-dock-horizon])) .dock,
		:global(html[data-dock='right']:not([data-dock-horizon])) .dock {
			flex-direction: column;
		}

		:global(html[data-dock='left']:not([data-dock-horizon])) .items,
		:global(html[data-dock='right']:not([data-dock-horizon])) .items {
			flex-direction: column;
		}

		.slots {
			display: contents;
		}

		.slot {
			position: fixed;
			z-index: 14;
			pointer-events: none;
			border: 1px dashed var(--border-strong);
			border-radius: var(--radius-xl);
			background: color-mix(in srgb, var(--action-primary) 8%, transparent);
			opacity: 0.45;
		}

		.slot.active {
			border-color: var(--action-primary);
			border-style: solid;
			background: color-mix(in srgb, var(--action-primary) 18%, transparent);
			opacity: 1;
		}

		.slot[data-edge='bottom'] {
			left: 50%;
			bottom: var(--spacing-5);
			width: min(28rem, 70vw);
			height: 4.75rem;
			transform: translateX(-50%);
		}

		.slot[data-edge='left'] {
			top: 50%;
			left: 0;
			width: 5.75rem;
			height: min(28rem, 70vh);
			transform: translateY(-50%);
		}

		.slot[data-edge='right'] {
			top: 50%;
			right: 0;
			width: 5.75rem;
			height: min(28rem, 70vh);
			transform: translateY(-50%);
		}
	}
</style>
