<script lang="ts">
	import { onMount } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { resolve } from '$app/paths';

	const brandName = 'Timothée Hennequin';
	const themeDuration = 220;

	let theme = $state<'light' | 'dark'>('light');
	let themeTimer = 0;

	onMount(() => {
		const current = document.documentElement.dataset.theme;
		if (current === 'dark' || current === 'light') {
			theme = current;
		}
	});

	function applyTheme(next: 'light' | 'dark') {
		theme = next;
		localStorage.setItem('theme', next);

		const root = document.documentElement;
		window.clearTimeout(themeTimer);

		if (prefersReducedMotion.current) {
			root.classList.remove('theme-transition');
			root.dataset.theme = next;
			return;
		}

		root.classList.add('theme-transition');
		requestAnimationFrame(() => {
			root.dataset.theme = next;
			themeTimer = window.setTimeout(() => {
				root.classList.remove('theme-transition');
			}, themeDuration);
		});
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
			{#if theme === 'dark'}
				<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<circle cx="12" cy="12" r="3.25" stroke="currentColor" stroke-width="1.75" />
					<path
						d="M12 5V3.25M12 20.75V19M5 12H3.25M20.75 12H19M6.9 6.9 5.7 5.7M18.3 18.3 17.1 17.1M6.9 17.1 5.7 18.3M18.3 5.7 17.1 6.9"
						stroke="currentColor"
						stroke-width="1.75"
						stroke-linecap="round"
					/>
				</svg>
			{:else}
				<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<path
						d="M15.5 13.5A6.25 6.25 0 0 1 10.5 4.4 7.25 7.25 0 1 0 19.6 13.5 6.25 6.25 0 0 1 15.5 13.5Z"
						stroke="currentColor"
						stroke-width="1.75"
						stroke-linejoin="round"
					/>
				</svg>
			{/if}
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
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: var(--spacing-2);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-md);
		background: var(--surface-elevated);
		color: var(--text-primary);
		cursor: pointer;
	}

	.icon {
		display: block;
		width: 1.25rem;
		height: 1.25rem;
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
			padding-left: var(--dock-gutter);
		}

		:global(html[data-dock='right']) .header {
			padding-right: var(--dock-gutter);
		}
	}
</style>
