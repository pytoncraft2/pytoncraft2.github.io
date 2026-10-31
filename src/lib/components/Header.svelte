<script lang="ts">
	import { onMount } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';

	const themeDuration = 220;
	const themeColors = {
		light: '#eee9ec',
		dark: '#0f0f0f'
	} as const;

	let theme = $state<'light' | 'dark'>('light');
	let themeTimer = 0;
	let visible = $state(true);
	let hashChanged = false;
	let lastScroll = 0;

	function onWindowScroll() {
		const scroll = window.scrollY;
		if (!hashChanged) {
			visible = scroll === lastScroll ? visible : scroll < 50 || scroll < lastScroll;
		}

		lastScroll = scroll;
		hashChanged = false;
	}

	function syncBrowserChrome(next: 'light' | 'dark') {
		document.documentElement.style.colorScheme = next;

		let meta = document.querySelector('meta[name="theme-color"]');
		if (!meta) {
			meta = document.createElement('meta');
			meta.setAttribute('name', 'theme-color');
			document.head.appendChild(meta);
		}
		meta.setAttribute('content', themeColors[next]);
	}

	onMount(() => {
		const current = document.documentElement.dataset.theme;
		if (current === 'dark' || current === 'light') {
			theme = current;
			syncBrowserChrome(current);
		}

		lastScroll = window.scrollY;
	});

	function applyTheme(next: 'light' | 'dark') {
		theme = next;
		localStorage.setItem('theme', next);
		syncBrowserChrome(next);

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

<svelte:window onscroll={onWindowScroll} onhashchange={() => (hashChanged = true)} />

<header class={['header', { visible }]}>
	<div class="inner">
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
		height: 0;
		overflow: visible;
		pointer-events: none;
		view-transition-name: app-header;
	}

	.inner {
		display: flex;
		justify-content: flex-end;
		padding: var(--spacing-3);
	}

	.theme {
		pointer-events: auto;
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

	@media (max-width: 39.99rem) {
		.theme {
			transition: transform 0.2s;
		}

		.header:not(.visible) .theme:not(:focus-visible) {
			transform: translateY(calc(-100% - var(--spacing-4)));
		}
	}

	@media (min-width: 64rem) {
		.inner {
			padding: var(--spacing-4) var(--spacing-5);
		}
	}
</style>
