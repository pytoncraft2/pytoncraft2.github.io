<script lang="ts">
	import { onMount } from 'svelte';
	import { withBase } from '#lib/paths.js';

	/** Chemin de la page courante, fourni par Astro (Astro.url.pathname). */
	let { pathname }: { pathname: string } = $props();

	const homeHref = withBase('/');

	let visible = $state(true);
	// Empêche le show/hide pendant le premier scroll déclenché par un hash (comme svelte.dev)
	let hashChanged = false;
	let lastScroll = 0;

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

	onMount(() => {
		lastScroll = window.scrollY;
		hash = window.location.hash;

		// Section courante de l'accueil, posée sur <html> par trackSection (snap-blocks.ts).
		const readSection = () => {
			section = document.documentElement.dataset.section ?? null;
		};
		readSection();
		const observer = new MutationObserver(readSection);
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-section'] });
		return () => observer.disconnect();
	});

	let hash = $state('');
	let section = $state<string | null>(null);
	const isHome = $derived(pathname === homeHref || pathname === homeHref.replace(/\/$/, '') || pathname.endsWith('/index.html'));
	const isProject = $derived(pathname.includes('/projets/'));

	/** Sur l'accueil, la section affichée ; sinon (ou sans suivi), l'ancre de l'adresse. */
	function isActiveSection(id: string, fromHash: boolean) {
		return isHome && section ? section === id : fromHash;
	}

	const items = $derived([
		{
			id: 'accueil',
			label: 'Accueil',
			href: homeHref,
			active: isActiveSection('accueil', isHome && hash !== '#projets' && hash !== '#profil' && hash !== '#contact')
		},
		{
			id: 'projets',
			label: 'Projets',
			href: `${homeHref}#projets`,
			active: isProject || isActiveSection('projets', isHome && hash === '#projets')
		},
		{
			id: 'profil',
			label: 'Profil',
			href: `${homeHref}#profil`,
			active: isActiveSection('profil', hash === '#profil')
		},
		{
			id: 'contact',
			label: 'Contact',
			href: `${homeHref}#contact`,
			active: isActiveSection('contact', hash === '#contact')
		}
	]);
</script>

<svelte:window
	onscroll={onWindowScroll}
	onhashchange={onHashChange}
/>

<nav
	id="menu"
	class={['dock', { visible }]}
	aria-label="Principale"
	tabindex="-1"
>
	<ul class="items">
		{#each items as item (item.id)}
			<li>
				<a
					class="item"
					class:active={item.active}
					href={item.href}
					aria-current={item.active ? (isHome ? 'location' : 'page') : undefined}
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

	@media (min-width: 40rem) {
		.dock {
			--dock-bevel: 3.5rem;
			--dock-round: 1rem;
			display: flex;
			flex-direction: column;
			align-items: center;
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

		/* Sur le bord gauche, vertical, en biseau. */
		:global(html:not([data-dock-horizon])) .dock {
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
			border: none;
			border-radius: 0;
			background: transparent;
			transform: translateY(-50%);
		}

		@supports (clip-path: shape(from 0 0, line to 0 0)) {
			:global(html:not([data-dock-horizon])) .dock {
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
		}

		:global(html:not([data-dock-horizon])) .dock::before,
		:global(html:not([data-dock-horizon])) .dock::after {
			content: '';
			position: absolute;
			z-index: -1;
			inset: 0;
			clip-path: var(--dock-shape);
		}

		:global(html:not([data-dock-horizon])) .dock::before {
			background: var(--border-default);
		}

		:global(html:not([data-dock-horizon])) .dock::after {
			inset: 1px 1px 1px 0;
			background: var(--surface-elevated);
		}

		:global(html:not([data-dock-horizon])) .items {
			flex-direction: column;
		}

		/*
		 * Accueil, page en haut (`data-dock-horizon`, géré par dock-horizon.ts) : le dock,
		 * horizontal, est centré sur l’horizon du paysage (`--dock-lift`, mesuré depuis sa
		 * place en bas). Au défilement, il s’efface puis réapparaît sur le bord gauche
		 * (`data-dock-switch`), et inversement en haut de page.
		 */
		:global(html[data-dock-horizon]) .dock {
			right: auto;
			bottom: var(--spacing-5);
			left: 50%;
			width: max-content;
			padding: var(--spacing-2) var(--spacing-3);
			border: 1px solid var(--border-default);
			border-radius: var(--radius-xl);
			transform: translateX(-50%);
			translate: 0 calc(-1 * var(--dock-lift, 0px));
		}

		:global(html[data-dock-horizon]) .items {
			flex-direction: row;
		}

		.dock {
			transition:
				translate 450ms cubic-bezier(0.4, 0, 0.2, 1),
				opacity 220ms ease;
		}

		:global(html[data-dock-switch]) .dock {
			opacity: 0;
		}

		:global(html[data-dock-switch='out']) .dock {
			transition:
				translate 180ms ease-in,
				opacity 180ms ease-in;
		}

		/* Nouvelle place posée sans transition, puis révélée à la fin du changement. */
		:global(html[data-dock-switch='in']) .dock {
			transition: none;
		}

		:global(html[data-dock-switch][data-dock-horizon]) .dock {
			translate: 0 calc(0.75rem - var(--dock-lift, 0px));
		}

		:global(html[data-dock-switch]:not([data-dock-horizon])) .dock {
			translate: -0.75rem 0;
		}
	}
</style>
