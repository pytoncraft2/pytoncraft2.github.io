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
	let settingsOpen = $state(false);
	let reducedMotion = $state(false);
	let systemReducesMotion = $state(false);

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

		const root = document.documentElement;
		const media = matchMedia('(prefers-reduced-motion: reduce)');
		const syncMotion = () => {
			systemReducesMotion = media.matches;
			reducedMotion = root.hasAttribute('data-reduced-motion');
		};
		syncMotion();
		const observer = new MutationObserver(syncMotion);
		observer.observe(root, { attributes: true, attributeFilter: ['data-reduced-motion'] });
		media.addEventListener('change', syncMotion);
		return () => {
			observer.disconnect();
			media.removeEventListener('change', syncMotion);
		};
	});

	function toggleMotion() {
		reducedMotion = !reducedMotion;
		document.documentElement.toggleAttribute('data-reduced-motion', reducedMotion);
		try {
			localStorage.setItem('reduce-motion', String(reducedMotion));
		} catch {
			// Le choix s’applique sur la page courante même sans stockage.
		}
	}

	function applyTheme(next: 'light' | 'dark') {
		theme = next;
		localStorage.setItem('theme', next);
		syncBrowserChrome(next);

		const root = document.documentElement;
		window.clearTimeout(themeTimer);

		if (prefersReducedMotion.current || reducedMotion) {
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
		<button
			class="settings-button"
			type="button"
			popovertarget="portfolio-settings"
			aria-label="Paramètres"
			aria-expanded={settingsOpen}
			aria-controls="portfolio-settings"
			title="Paramètres"
		>
			<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round" aria-hidden="true">
				<path d="m10 3-.5 2.5-2 .9-2.2-.9-2 3.4L5 10.6v2.8l-1.7 1.7 2 3.4 2.2-.9 2 .9.5 2.5h4l.5-2.5 2-.9 2.2.9 2-3.4-1.7-1.7v-2.8l1.7-1.7-2-3.4-2.2.9-2-.9L14 3z" />
				<circle cx="12" cy="12" r="3" />
			</svg>
		</button>
		<div
			id="portfolio-settings"
			class="settings-panel"
			popover="auto"
			ontoggle={(event) => (settingsOpen = event.newState === 'open')}
		>
			<button class="setting" type="button" onclick={toggleTheme} aria-pressed={theme === 'dark'}>
				<span>Thème sombre</span>
				<span aria-hidden="true" class="setting-state">{theme === 'dark' ? '✓' : ''}</span>
			</button>
			<button
				class="setting"
				type="button"
				onclick={toggleMotion}
				aria-pressed={reducedMotion}
				disabled={systemReducesMotion}
				aria-describedby={systemReducesMotion ? 'motion-system' : undefined}
			>
				<span>Réduire les animations</span>
				<span aria-hidden="true" class="setting-state">{reducedMotion ? '✓' : ''}</span>
			</button>
			{#if systemReducesMotion}
				<p id="motion-system">Activé dans les réglages du système.</p>
			{/if}
			<button class="setting game-setting" type="button" data-game-launch aria-controls="cyclist-game" hidden>
				<span>Jouer avec le cycliste</span>
				<svg class="icon play-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
					<path d="M8 5v14l11-7z" />
				</svg>
			</button>
		</div>
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
		--settings-top: var(--spacing-3);
		--settings-right: var(--spacing-3);
		display: flex;
		justify-content: flex-end;
		padding: var(--settings-top) var(--settings-right);
	}

	.settings-button,
	.setting {
		min-height: 44px;
		padding: var(--spacing-2);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-md);
		background: var(--surface-elevated);
		color: var(--text-primary);
		cursor: pointer;
	}

	.settings-button {
		pointer-events: auto;
		width: 44px;
		display: grid;
		place-items: center;
	}

	.settings-panel {
		position: fixed;
		inset: calc(var(--settings-top) + 44px + var(--spacing-2)) var(--settings-right) auto auto;
		width: min(18rem, calc(100% - 2 * var(--settings-right)));
		max-height: calc(100% - var(--settings-top) - 44px - 2 * var(--spacing-2));
		margin: 0;
		padding: var(--spacing-2);
		border: 1px solid var(--border-strong);
		border-radius: var(--radius-lg);
		background: var(--surface-elevated);
		color: var(--text-primary);
		pointer-events: auto;
	}

	/* Voile léger qui détache le panneau des encarts du hero. Il laisse passer les clics :
	   un clic à côté ferme toujours le panneau et atteint l’élément visé, comme sans voile. */
	.settings-panel::backdrop {
		background: var(--overlay-scrim, rgb(32 32 48 / 0.18));
		pointer-events: none;
	}

	.setting {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--spacing-2);
		width: 100%;
		font: 500 var(--text-label-m-size) / var(--text-label-m-line) var(--font-sans);
		text-align: left;
	}

	.setting + .setting { margin-top: var(--spacing-2); }

	.game-setting[hidden] { display: none; }

	.game-setting {
		margin-top: var(--spacing-2);
		border-top-color: var(--border-strong);
	}

	.setting-state {
		flex: 0 0 1em;
		color: var(--action-primary);
	}

	.setting:disabled { cursor: default; }

	.settings-panel p {
		margin: var(--spacing-2);
		color: var(--text-secondary);
		font: 400 var(--text-body-s-size) / var(--text-body-s-line) var(--font-sans);
	}

	.icon {
		width: 1.25rem;
		height: 1.25rem;
	}

	.play-icon { flex-shrink: 0; }

	.settings-button:hover,
	.setting:hover:not(:disabled) {
		background: var(--surface-subtle);
		border-color: var(--border-strong);
	}

	@media (min-width: 64rem) {
		.inner {
			--settings-top: var(--spacing-4);
			--settings-right: var(--spacing-5);
		}
	}
</style>
