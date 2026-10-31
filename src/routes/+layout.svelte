<script lang="ts">
	import '#lib/styles/tokens.css';
	import '#lib/styles/typography.css';
	import '#lib/styles/global.css';
	import favicon from '#lib/assets/favicon.svg';
	import Dock from '#lib/components/Dock.svelte';
	import Footer from '#lib/components/Footer.svelte';
	import Header from '#lib/components/Header.svelte';
	import { onNavigate } from '$app/navigation';

	let { children } = $props();

	function projectSlug(url: URL | undefined) {
		const match = url?.pathname.match(/^\/projets\/([^/]+)\/?$/);
		return match?.[1] ?? null;
	}

	onNavigate((navigation) => {
		if (navigation.shallow && navigation.type === 'goto') return;

		if (typeof document.startViewTransition !== 'function') {
			return;
		}

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			return;
		}

		if (navigation.from?.url.pathname === navigation.to?.url.pathname) {
			return;
		}

		const fromSlug = projectSlug(navigation.from?.url);
		const toSlug = projectSlug(navigation.to?.url);
		const root = document.documentElement;
		if (fromSlug !== toSlug && (fromSlug || toSlug)) {
			root.dataset.projectTransition = toSlug ?? fromSlug ?? '';
		}

		const previousScrollBehavior = root.style.scrollBehavior;
		root.style.scrollBehavior = 'auto';

		return new Promise<void>((resolve) => {
			const transition = document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
			transition.finished.finally(() => {
				root.style.scrollBehavior = previousScrollBehavior;
				delete root.dataset.projectTransition;
				document.querySelectorAll('[data-project-card][data-transition]').forEach((node) => {
					node.removeAttribute('data-transition');
				});
			});
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="color-scheme" content="light dark" />

	<link
		rel="preconnect"
		href="https://fonts.googleapis.com"
	/>

	<link
		rel="preconnect"
		href="https://fonts.gstatic.com"
		crossorigin="anonymous"
	/>

	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

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
		:global(html[data-dock="left"]) .stage {
			padding-left: var(--dock-gutter);
		}

		:global(html[data-dock="right"]) .stage {
			padding-right: var(--dock-gutter);
		}
	}
</style>
