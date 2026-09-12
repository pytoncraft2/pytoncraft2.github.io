<script lang="ts">
	import '$lib/styles/tokens.css';
	import '$lib/styles/typography.css';
	import '$lib/styles/global.css';
	import favicon from '$lib/assets/favicon.svg';
	import Dock from '$lib/components/Dock.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';

	let { children } = $props();
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

<a class="skip-link" href="#contenu">Aller au contenu</a>
<div class="app">
	<Header />
	<div class="stage">
		<main id="contenu">
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

	@media (min-width: 40rem) {
		:global(html[data-dock='left']) .stage {
			padding-left: 6rem;
		}

		:global(html[data-dock='right']) .stage {
			padding-right: 6rem;
		}
	}
</style>
