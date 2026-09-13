<script lang="ts">
	import '$lib/styles/tokens.css';
	import '$lib/styles/typography.css';
	import '$lib/styles/global.css';
	import favicon from '$lib/assets/favicon.svg';
	import Dock from '$lib/components/Dock.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import { afterNavigate, onNavigate } from '$app/navigation';

	let { children } = $props();

	const highlightTargets = new Set(['projets', 'contact']);
	let highlightCleanup: (() => void) | null = null;
	let lastHighlightAt = 0;
	let lastHighlightId = '';

	function highlightAnchor(hash: string) {
		const id = decodeURIComponent(hash.replace(/^#/, ''));
		if (!highlightTargets.has(id)) {
			return;
		}

		const now = performance.now();
		if (id === lastHighlightId && now - lastHighlightAt < 80) {
			return;
		}

		const target = document.getElementById(id);
		if (!target) {
			return;
		}

		lastHighlightAt = now;
		lastHighlightId = id;
		highlightCleanup?.();
		target.classList.remove('is-highlighted');
		void target.offsetWidth;
		target.classList.add('is-highlighted');

		const onAnimationEnd = (event: AnimationEvent) => {
			if (event.animationName !== 'highlight-glow') {
				return;
			}

			target.classList.remove('is-highlighted');
			highlightCleanup = null;
			target.removeEventListener('animationend', onAnimationEnd);
		};

		target.addEventListener('animationend', onAnimationEnd);
		highlightCleanup = () => {
			target.removeEventListener('animationend', onAnimationEnd);
		};
	}

	afterNavigate(({ to }) => {
		highlightAnchor(to?.url.hash ?? '');
	});

	function onHashChange() {
		highlightAnchor(location.hash);
	}

	function onDocumentClick(event: MouseEvent) {
		const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
		if (!(link instanceof HTMLAnchorElement) || link.target === '_blank') {
			return;
		}

		let url: URL;
		try {
			url = new URL(link.href);
		} catch {
			return;
		}

		if (url.origin !== location.origin || url.pathname !== location.pathname) {
			return;
		}

		if (url.hash !== '#projets' && url.hash !== '#contact') {
			return;
		}

		requestAnimationFrame(() => {
			highlightAnchor(url.hash);
		});
	}

	onNavigate((navigation) => {
		if (typeof document.startViewTransition !== 'function') {
			return;
		}

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			return;
		}

		if (navigation.from?.url.pathname === navigation.to?.url.pathname) {
			return;
		}

		return new Promise<void>((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="color-scheme" content="light dark" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<svelte:window onhashchange={onHashChange} />
<svelte:document onclick={onDocumentClick} />

<a class="skip-link" href="#contenu">Aller au contenu</a>
<a class="skip-link" href="#menu">Aller au menu</a>
<div class="app">
	<Header />
	<div class="stage">
		<main id="contenu" tabindex="-1">
			{@render children()}
		</main>
	</div>
	<Footer />
	<Dock />
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.stage {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	main {
		flex: 1;
		width: min(100% - var(--spacing-8), 72rem);
		margin-inline: auto;
		padding-block: var(--spacing-8);
	}

	main:focus {
		outline: none;
	}

	@media (min-width: 40rem) {
		:global(html[data-dock='left']) .stage {
			padding-left: 6rem;
		}

		:global(html[data-dock='right']) .stage {
			padding-right: 6rem;
		}
	}
</style>
