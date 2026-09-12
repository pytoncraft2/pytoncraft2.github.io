<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import NavLink from './NavLink.svelte';

	const brandName = 'Timothée Hennequin';

	let theme = $state<'light' | 'dark'>('light');

	const routeId = $derived(page.route.id ?? '');

	onMount(() => {
		const current = document.documentElement.dataset.theme;
		if (current === 'dark' || current === 'light') {
			theme = current;
		}
	});

	function applyTheme(next: 'light' | 'dark') {
		theme = next;
		document.documentElement.dataset.theme = next;
		localStorage.setItem('theme', next);
	}

	function toggleTheme() {
		applyTheme(theme === 'dark' ? 'light' : 'dark');
	}
</script>

<header class="header">
	<div class="inner shell">
		<a class="brand" href={resolve('/')}>{brandName}</a>

		<nav class="nav" aria-label="Principale">
			<NavLink href={resolve('/')} active={routeId === '/'}>Accueil</NavLink>
			<NavLink href="{resolve('/')}#projets" active={routeId.startsWith('/projets')}>Projets</NavLink>
			<NavLink href={resolve('/a-propos')} active={routeId === '/a-propos'}>À propos</NavLink>
		</nav>

		<button
			class="theme"
			type="button"
			onclick={toggleTheme}
			aria-label={theme === 'dark' ? 'Activer le thème clair' : 'Activer le thème sombre'}
		>
			{theme === 'dark' ? 'Clair' : 'Sombre'}
		</button>
	</div>
</header>

<style>
	.header {
		border-bottom: 1px solid var(--border-default);
		background: var(--surface-default);
	}

	.inner {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--spacing-3);
		padding-block: var(--spacing-3);
	}

	.brand {
		min-height: 44px;
		margin-right: auto;
		order: 1;
		display: inline-flex;
		align-items: center;
		color: var(--text-primary);
		font: 600 var(--text-body-l-size) / var(--text-body-l-line) var(--font-sans);
		text-decoration: none;
	}

	.brand:focus-visible {
		outline: 2px solid var(--action-focus);
		outline-offset: 2px;
		border-radius: var(--radius-sm);
	}

	.nav {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		flex: 1 1 100%;
		order: 3;
		gap: var(--spacing-1);
	}

	.theme {
		min-width: 44px;
		min-height: 44px;
		order: 2;
		padding: var(--spacing-2) var(--spacing-4);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-md);
		background: var(--surface-default);
		color: var(--text-primary);
		font: 500 var(--text-label-m-size) / var(--text-label-m-line) var(--font-sans);
		cursor: pointer;
	}

	@media (min-width: 40rem) {
		.nav {
			flex: 0 1 auto;
			order: 2;
		}

		.theme {
			order: 3;
		}
	}

	.theme:hover {
		background: var(--surface-subtle);
		border-color: var(--border-strong);
	}

	.theme:focus-visible {
		outline: 2px solid var(--action-focus);
		outline-offset: 2px;
	}
</style>
