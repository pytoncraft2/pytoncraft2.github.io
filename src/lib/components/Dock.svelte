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

	/** Sur l'accueil, « Accueil » remonte en haut de la page au lieu de la recharger. */
	function onItemClick(event: MouseEvent, id: string) {
		const plainClick =
			event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
		if (id !== 'accueil' || !isHome || !plainClick) {
			return;
		}

		event.preventDefault();
		if (window.location.hash) {
			history.replaceState(history.state, '', window.location.pathname + window.location.search);
			hash = '';
		}
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		window.scrollTo({ top: 0, behavior: reduceMotion ? 'instant' : 'smooth' });
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
					onclick={(event) => onItemClick(event, item.id)}
					aria-current={item.active ? (isHome ? 'location' : 'page') : undefined}
				>
					<span class="icon" aria-hidden="true">
						<!--
							Icônes Phosphor (style Duotone) : mountains, map-trifold, path, envelope-simple.
							Copyright (c) 2023 Phosphor Icons, licence MIT :
							https://github.com/phosphor-icons/core/blob/main/LICENSE
						-->
						{#if item.id === 'accueil'}
							<svg viewBox="0 0 256 256" fill="currentColor">
								<path opacity=".2" d="M144 52a20 20 0 1 1 20 20a20 20 0 0 1-20-20m49.44 55.92a8 8 0 0 0-13.77 0l-33 55.75l-21-35.67H50.35L8 200h240Z" />
								<path d="M164 80a28 28 0 1 0-28-28a28 28 0 0 0 28 28m0-40a12 12 0 1 1-12 12a12 12 0 0 1 12-12m90.88 155.92l-54.56-92.08A15.87 15.87 0 0 0 186.55 96a15.85 15.85 0 0 0-13.76 7.84L146.63 148l-44.84-76.1a16 16 0 0 0-27.58 0L1.11 195.94A8 8 0 0 0 8 208h240a8 8 0 0 0 6.88-12.08M88 80l23.57 40H64.43ZM22 192l33-56h66l33 56Zm150.57 0l-16.66-28.28L186.55 112L234 192Z" />
							</svg>
						{:else if item.id === 'projets'}
							<svg viewBox="0 0 256 256" fill="currentColor">
								<path opacity=".2" d="M160 72v144l-64-32V40Z" />
								<path d="M228.92 49.69a8 8 0 0 0-6.86-1.45l-61.13 15.28l-61.35-30.68a8 8 0 0 0-5.52-.6l-64 16A8 8 0 0 0 24 56v144a8 8 0 0 0 9.94 7.76l61.13-15.28l61.35 30.68a8.15 8.15 0 0 0 3.58.84a8 8 0 0 0 1.94-.24l64-16A8 8 0 0 0 232 200V56a8 8 0 0 0-3.08-6.31M104 52.94l48 24v126.12l-48-24Zm-64 9.31l48-12v127.5l-48 12Zm176 131.5l-48 12V78.25l48-12Z" />
							</svg>
						{:else if item.id === 'profil'}
							<svg viewBox="0 0 256 256" fill="currentColor">
								<path opacity=".2" d="M224 200a24 24 0 1 1-24-24a24 24 0 0 1 24 24" />
								<path d="M200 168a32.06 32.06 0 0 0-31 24H72a32 32 0 0 1 0-64h96a40 40 0 0 0 0-80H72a8 8 0 0 0 0 16h96a24 24 0 0 1 0 48H72a48 48 0 0 0 0 96h97a32 32 0 1 0 31-40m0 48a16 16 0 1 1 16-16a16 16 0 0 1-16 16" />
							</svg>
						{:else}
							<svg viewBox="0 0 256 256" fill="currentColor">
								<path opacity=".2" d="m224 56l-96 88l-96-88Z" />
								<path d="M224 48H32a8 8 0 0 0-8 8v136a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a8 8 0 0 0-8-8m-20.57 16L128 133.15L52.57 64ZM216 192H40V74.19l82.59 75.71a8 8 0 0 0 10.82 0L216 74.19z" />
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
