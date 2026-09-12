<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';

	const brandName = 'Timothée Hennequin';

	let theme = $state<'light' | 'dark'>('light');

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
	<div class="inner">
		<a class="home" href={resolve('/')}>Accueil</a>
		<p class="title">{brandName}</p>
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
		position: sticky;
		top: 0;
		z-index: 15;
		border-bottom: 1px solid var(--border-default);
		background: var(--surface-elevated);
		view-transition-name: app-header;
	}

	.inner {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: var(--spacing-3);
		width: min(100% - var(--spacing-6), 72rem);
		min-height: 44px;
		margin-inline: auto;
		padding-block: var(--spacing-1);
	}

	.home {
		justify-self: start;
		min-height: 44px;
		display: inline-flex;
		align-items: center;
		color: var(--text-primary);
		font: 600 var(--text-label-m-size) / var(--text-label-m-line) var(--font-sans);
		text-decoration: none;
	}

	.home:focus-visible {
		outline: 2px solid var(--action-focus);
		outline-offset: 2px;
		border-radius: var(--radius-sm);
	}

	.title {
		margin: 0;
		max-width: 42vw;
		overflow: hidden;
		color: var(--text-primary);
		font: 600 var(--text-body-s-size) / var(--text-body-s-line) var(--font-sans);
		text-align: center;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.theme {
		justify-self: end;
		min-width: 44px;
		min-height: 44px;
		padding: var(--spacing-2) var(--spacing-3);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-md);
		background: var(--surface-elevated);
		color: var(--text-primary);
		font: 500 var(--text-label-m-size) / var(--text-label-m-line) var(--font-sans);
		cursor: pointer;
	}

	.theme:hover {
		background: var(--surface-subtle);
		border-color: var(--border-strong);
	}

	.theme:focus-visible {
		outline: 2px solid var(--action-focus);
		outline-offset: 2px;
	}

	@media (min-width: 40rem) {
		.title {
			max-width: none;
			font: 600 var(--text-body-m-size) / var(--text-body-m-line) var(--font-sans);
		}

		:global(html[data-dock='left']) .header {
			padding-left: 6rem;
		}

		:global(html[data-dock='right']) .header {
			padding-right: 6rem;
		}
	}
</style>
