<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		id,
		children
	}: {
		title: string;
		id?: string;
		children: Snippet;
	} = $props();

	const headingId = $derived(id ? `${id}-title` : undefined);
</script>

<section class="section" {id} aria-labelledby={headingId}>
	<h2 id={headingId} class="ds-h2">{title}</h2>
	<div class="content">
		{@render children()}
	</div>
</section>

<style>
	.section {
		padding-block: var(--spacing-10);
	}

	h2 {
		margin: 0 0 var(--spacing-5);
	}

	.content {
		max-width: 40rem;
		color: var(--text-primary);
		font: 400 var(--text-body-m-size) / var(--text-body-m-line) var(--font-sans);
	}

	.content :global(p) {
		margin: 0 0 var(--spacing-4);
	}

	.content :global(p:last-child) {
		margin-bottom: 0;
	}

	.content :global(ul) {
		margin: 0 0 var(--spacing-4);
		padding-left: 1.25rem;
	}

	.content :global(li + li) {
		margin-top: var(--spacing-2);
	}
</style>
