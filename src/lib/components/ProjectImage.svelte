<script lang="ts">
	let {
		src,
		alt,
		caption,
		transitionName
	}: {
		src: string;
		alt: string;
		caption?: string;
		transitionName?: string;
	} = $props();
</script>

<figure
	class="figure"
	style:view-transition-name={transitionName}
	style:view-transition-class={transitionName ? 'project-media' : undefined}
>
	<img {src} {alt} />
	{#if caption}
		<figcaption class="ds-body-s">{caption}</figcaption>
	{/if}
</figure>

<style>
	.figure {
		width: 100%;
		max-width: 45rem;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-3);
	}

	img {
		width: 100%;
		height: auto;
		aspect-ratio: 35 / 18;
		object-fit: cover;
		border-radius: var(--radius-md);
		background: var(--surface-subtle);
		border: 1px solid var(--border-default);
	}

	figcaption {
		margin: 0;
		color: var(--text-secondary);
	}
</style>
