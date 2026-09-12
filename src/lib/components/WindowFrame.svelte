<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		children
	}: {
		title: string;
		children: Snippet;
	} = $props();
</script>

<section class="window" aria-label={title}>
	<div class="titlebar">
		<span class="dots" aria-hidden="true">
			<span></span>
			<span></span>
			<span></span>
		</span>
		<p class="title">{title}</p>
	</div>
	<div class="body">
		{@render children()}
	</div>
</section>

<style>
	.window {
		overflow: hidden;
		border: 1px solid var(--border-default);
		border-radius: var(--radius-lg);
		background: var(--surface-elevated);
	}

	.titlebar {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		min-height: 44px;
		padding: var(--spacing-2) var(--spacing-4);
		background: var(--surface-subtle);
		border-bottom: 1px solid var(--border-default);
	}

	.dots {
		display: flex;
		gap: var(--spacing-2);
		justify-self: start;
	}

	.dots span {
		width: 0.75rem;
		height: 0.75rem;
		border-radius: var(--radius-full);
		background: var(--border-strong);
	}

	.title {
		margin: 0;
		justify-self: center;
		color: var(--text-primary);
		font: 500 var(--text-label-m-size) / var(--text-label-m-line) var(--font-sans);
	}

	.body {
		padding: var(--spacing-6);
	}

	@media (min-width: 40rem) {
		.body {
			padding: var(--spacing-8);
		}
	}
</style>
