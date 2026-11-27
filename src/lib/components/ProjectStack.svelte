<script lang="ts">
	/** Technologies principales d’un projet (champ `stack`), sur la carte et sur l’étude de cas. */
	let { stack, transitionName }: { stack: string[]; transitionName?: string } = $props();
</script>

{#if stack.length}
	<ul
		class="stack"
		aria-label="Technologies"
		style:view-transition-name={transitionName}
		style:view-transition-class={transitionName ? 'project-text' : undefined}
	>
		{#each stack as tech (tech)}
			<li>{tech}</li>
		{/each}
	</ul>
{/if}

<style>
	/*
	 * Pastilles arrondies à contour, sans fond, pour se distinguer des tags
	 * (ProjectTags : fond plein, angles peu arrondis) tout en gardant leur taille.
	 */
	.stack {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-2);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.stack li {
		padding: var(--spacing-1) var(--spacing-3);
		border: 1px solid var(--border-strong);
		border-radius: var(--radius-full);
		color: var(--text-primary);
		font: 500 0.75rem / 1rem var(--font-sans);
	}
</style>
