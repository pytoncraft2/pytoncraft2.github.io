<script lang="ts">
	import { onMount } from 'svelte';
	import { asset, resolve } from '$app/paths';
	import { page } from '$app/state';

	const cvHref = asset('/cv-timothee-hennequin.pdf');
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
	});

	const dropEdges = ['bottom', 'left', 'right'] as const;
	const preview = $derived(dragging ? nearestPlacement(dragX, dragY) : null);

	const routeId = $derived(page.route.id ?? '');
	const hash = $derived(page.url.hash);

	const items = $derived([
		{
			id: 'accueil',
			label: 'Accueil',
			href: resolve('/'),
			active: routeId === '/' && hash !== '#projets' && hash !== '#contact'
		},
		{
			id: 'parcours',
			label: 'Parcours',
			href: resolve('/a-propos'),
			active: routeId === '/a-propos'
		},
		{
			id: 'projets',
			label: 'Projets',
			href: `${resolve('/')}#projets`,
			active: routeId.startsWith('/projets') || (routeId === '/' && hash === '#projets')
		},
		{
			id: 'contact',
			label: 'Contact',
			href: `${resolve('/')}#contact`,
			active: hash === '#contact'
		},
		{
			id: 'cv',
			label: 'CV',
			href: cvHref,
			active: false,
			external: true
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
					aria-label={item.external ? `${item.label} (PDF)` : undefined}
					target={item.external ? '_blank' : undefined}
					rel={item.external ? 'noreferrer' : undefined}
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
						{:else if item.id === 'parcours'}
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
						{:else if item.id === 'contact'}
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
						{:else}
							<svg viewBox="0 0 24 24" fill="none">
								<path
									d="M7 4h7l5 5v11H7V4Z"
									stroke="currentColor"
									stroke-width="1.75"
									stroke-linejoin="round"
								/>
								<path d="M14 4v5h5" stroke="currentColor" stroke-width="1.75" />
								<path
									d="M10 13h6M10 16.5h4"
									stroke="currentColor"
									stroke-width="1.75"
									stroke-linecap="round"
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

	.item {
		min-width: 44px;
		min-height: 44px;
		display: flex;
		flex: 1 1 0;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-1);
		padding: var(--spacing-1);
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

		:global(html[data-dock='left']) .dock:not(.dragging) {
			top: 50%;
			right: auto;
			bottom: auto;
			left: var(--spacing-5);
			transform: translateY(-50%);
		}

		:global(html[data-dock='right']) .dock:not(.dragging) {
			top: 50%;
			right: var(--spacing-5);
			bottom: auto;
			left: auto;
			transform: translateY(-50%);
		}

		:global(html[data-dock='left']) .dock,
		:global(html[data-dock='right']) .dock {
			flex-direction: column;
		}

		:global(html[data-dock='left']) .items,
		:global(html[data-dock='right']) .items {
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
			left: var(--spacing-5);
			width: 5.75rem;
			height: min(28rem, 70vh);
			transform: translateY(-50%);
		}

		.slot[data-edge='right'] {
			top: 50%;
			right: var(--spacing-5);
			width: 5.75rem;
			height: min(28rem, 70vh);
			transform: translateY(-50%);
		}
	}
</style>
