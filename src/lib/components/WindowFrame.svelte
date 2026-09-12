<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		parent,
		children
	}: {
		title: string;
		parent: { href: string; label: string };
		children: Snippet;
	} = $props();
</script>

<section class="window" aria-label={title}>
	<div class="titlebar">
		<a class="back" href={parent.href}>
			<svg class="chevron" viewBox="0 0 24 24" fill="none" aria-hidden="true">
				<path
					d="M14 6 8 12l6 6"
					stroke="currentColor"
					stroke-width="1.75"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			{parent.label}
		</a>
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

	.back {
		justify-self: start;
		min-height: 44px;
		display: inline-flex;
		align-items: center;
		gap: var(--spacing-1);
		margin-left: calc(var(--spacing-2) * -1);
		padding-inline: var(--spacing-2);
		border-radius: var(--radius-sm);
		color: var(--text-primary);
		font: 500 var(--text-label-m-size) / var(--text-label-m-line) var(--font-sans);
		text-decoration: none;
	}

	.back:hover {
		background: var(--surface-elevated);
	}

	.back:focus-visible {
		outline: 2px solid var(--action-focus);
		outline-offset: 2px;
	}

	.chevron {
		width: 1rem;
		height: 1rem;
		flex-shrink: 0;
	}

	.title {
		margin: 0;
		max-width: 42vw;
		overflow: hidden;
		justify-self: center;
		color: var(--text-primary);
		font: 500 var(--text-label-m-size) / var(--text-label-m-line) var(--font-sans);
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.body {
		padding: var(--spacing-6);
	}

	@media (min-width: 40rem) {
		.title {
			max-width: none;
		}

		.body {
			padding: var(--spacing-8);
		}
	}
</style>
