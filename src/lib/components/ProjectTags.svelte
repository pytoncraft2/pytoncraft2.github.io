<script lang="ts">
	let { tags }: { tags: string[] } = $props();
</script>

{#if tags.length}
	<ul class="tags">
		{#each tags as tag (tag)}
			<li>{tag}</li>
		{/each}
	</ul>
{/if}

<style>
	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-2);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.tags li {
		padding: var(--spacing-1) var(--spacing-2);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-sm);
		background: var(--surface-subtle);
		color: var(--text-secondary);
		font: 500 0.75rem / 1rem var(--font-sans);
	}
</style>
