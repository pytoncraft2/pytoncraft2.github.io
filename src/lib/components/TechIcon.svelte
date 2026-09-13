<script lang="ts">
	import type { TechId } from '$lib/data/skills';

	let { name }: { name: TechId } = $props();
</script>

<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
	{#if name === 'sveltekit'}
		<path
			d="M5.5 15.5 12 4.5l6.5 11c.7 1.2-.2 2.7-1.6 2.7H7.1c-1.4 0-2.3-1.5-1.6-2.7Z"
			stroke="currentColor"
			stroke-width="1.75"
			stroke-linejoin="round"
		/>
		<path
			d="M9 13.5h6M10.5 16.5h3"
			stroke="currentColor"
			stroke-width="1.75"
			stroke-linecap="round"
		/>
	{:else if name === 'react'}
		<circle cx="12" cy="12" r="1.6" fill="currentColor" />
		<ellipse cx="12" cy="12" rx="9.5" ry="3.6" stroke="currentColor" stroke-width="1.5" />
		<ellipse
			cx="12"
			cy="12"
			rx="9.5"
			ry="3.6"
			transform="rotate(60 12 12)"
			stroke="currentColor"
			stroke-width="1.5"
		/>
		<ellipse
			cx="12"
			cy="12"
			rx="9.5"
			ry="3.6"
			transform="rotate(120 12 12)"
			stroke="currentColor"
			stroke-width="1.5"
		/>
	{:else if name === 'twig'}
		<path
			d="M12 20.5c0-7.5 5.5-13 8-15.5-3 1.2-10 2.2-12 8.2-1.2 3.6.8 7.3 4 7.3Z"
			stroke="currentColor"
			stroke-width="1.75"
			stroke-linejoin="round"
		/>
		<path d="M12 20.5V11" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
	{:else if name === 'fastapi'}
		<path
			d="M13 3.5 6.5 13h5l-1 7.5L17.5 11h-5l.5-7.5Z"
			stroke="currentColor"
			stroke-width="1.75"
			stroke-linejoin="round"
		/>
	{:else if name === 'flask'}
		<path
			d="M9 4.5h6M10 4.5v5.2L5.8 18c-.6 1.1.2 2.5 1.5 2.5h9.4c1.3 0 2.1-1.4 1.5-2.5L14 9.7V4.5"
			stroke="currentColor"
			stroke-width="1.75"
			stroke-linejoin="round"
		/>
		<path d="M8.2 15.5h7.6" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
	{:else if name === 'symfony'}
		<path
			d="M8.5 8.5c-2.2 0-3.5 1.6-3.5 3.4 0 2.6 2.6 3.3 4.8 4.2 2 .8 3.2 1.4 3.2 2.6 0 1.1-1 1.8-2.4 1.8-1.8 0-3-.8-3.8-2"
			stroke="currentColor"
			stroke-width="1.75"
			stroke-linecap="round"
		/>
		<path
			d="M15.5 15.5c2.2 0 3.5-1.6 3.5-3.4 0-2.6-2.6-3.3-4.8-4.2-2-.8-3.2-1.4-3.2-2.6 0-1.1 1-1.8 2.4-1.8 1.8 0 3 .8 3.8 2"
			stroke="currentColor"
			stroke-width="1.75"
			stroke-linecap="round"
		/>
	{:else if name === 'nodejs'}
		<path
			d="M12 3.4 19.2 7.6v8.8L12 20.6 4.8 16.4V7.6L12 3.4Z"
			stroke="currentColor"
			stroke-width="1.75"
			stroke-linejoin="round"
		/>
		<path d="M12 8v8" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
	{:else if name === 'postgresql'}
		<ellipse cx="12" cy="8.2" rx="5.2" ry="3.2" stroke="currentColor" stroke-width="1.75" />
		<path
			d="M6.8 8.2v6.2c0 1.8 2.3 3.2 5.2 3.2s5.2-1.4 5.2-3.2V8.2"
			stroke="currentColor"
			stroke-width="1.75"
		/>
		<path d="M6.8 11.4c0 1.8 2.3 3.2 5.2 3.2s5.2-1.4 5.2-3.2" stroke="currentColor" stroke-width="1.75" />
	{:else if name === 'mysql'}
		<path
			d="M4.5 16.5c1.6-4.2 4-8.6 7.5-8.6 2.2 0 3.4 1.6 4.6 1.6 1.5 0 2.6-1.4 3.9-1.4"
			stroke="currentColor"
			stroke-width="1.75"
			stroke-linecap="round"
		/>
		<path
			d="M7 19.2c2.2-3.2 4.4-5.4 7.2-5.4 1.8 0 2.8 1.2 4.2 1.2 1.2 0 2.2-.8 3.1-.8"
			stroke="currentColor"
			stroke-width="1.75"
			stroke-linecap="round"
		/>
	{:else if name === 'playwright'}
		<rect
			x="3.5"
			y="5.5"
			width="11"
			height="9"
			rx="1.5"
			stroke="currentColor"
			stroke-width="1.75"
		/>
		<rect
			x="9.5"
			y="9.5"
			width="11"
			height="9"
			rx="1.5"
			stroke="currentColor"
			stroke-width="1.75"
		/>
	{:else if name === 'git'}
		<circle cx="7" cy="17" r="2" stroke="currentColor" stroke-width="1.75" />
		<circle cx="12" cy="7" r="2" stroke="currentColor" stroke-width="1.75" />
		<circle cx="17" cy="17" r="2" stroke="currentColor" stroke-width="1.75" />
		<path
			d="M12 9v3.2L8.6 15.4M12 12.2l3.4 3.2"
			stroke="currentColor"
			stroke-width="1.75"
			stroke-linecap="round"
		/>
	{:else if name === 'gitlab'}
		<path
			d="M12 20 4.6 8.8 7 3.5l2.4 5.3h5.2L17 3.5l2.4 5.3L12 20Z"
			stroke="currentColor"
			stroke-width="1.75"
			stroke-linejoin="round"
		/>
	{:else if name === 'docker'}
		<rect x="6" y="8.5" width="3" height="2.6" rx="0.4" stroke="currentColor" stroke-width="1.5" />
		<rect x="9.6" y="8.5" width="3" height="2.6" rx="0.4" stroke="currentColor" stroke-width="1.5" />
		<rect x="13.2" y="8.5" width="3" height="2.6" rx="0.4" stroke="currentColor" stroke-width="1.5" />
		<rect x="9.6" y="5.4" width="3" height="2.6" rx="0.4" stroke="currentColor" stroke-width="1.5" />
		<path
			d="M4.5 12.4h14.2c1.4 1.4 1.2 3.8-1 4.6-2 .7-6.6.8-9.4 0-2.6-.8-4.4-2.4-3.8-4.6Z"
			stroke="currentColor"
			stroke-width="1.75"
			stroke-linejoin="round"
		/>
	{:else if name === 'figma'}
		<circle cx="9.2" cy="6.4" r="2.4" stroke="currentColor" stroke-width="1.75" />
		<circle cx="14.8" cy="6.4" r="2.4" stroke="currentColor" stroke-width="1.75" />
		<circle cx="9.2" cy="12" r="2.4" stroke="currentColor" stroke-width="1.75" />
		<circle cx="14.8" cy="12" r="2.4" stroke="currentColor" stroke-width="1.75" />
		<circle cx="9.2" cy="17.6" r="2.4" stroke="currentColor" stroke-width="1.75" />
	{/if}
</svg>

<style>
	.icon {
		display: block;
		width: var(--tech-icon-size, 1.25rem);
		height: var(--tech-icon-size, 1.25rem);
		flex-shrink: 0;
	}
</style>
