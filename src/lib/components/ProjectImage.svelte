<script lang="ts">
	let {
		src,
		alt,
		caption
	}: {
		src: string;
		alt: string;
		caption?: string;
	} = $props();
</script>

<figure class="figure">
	<img {src} {alt} />
	{#if caption}
		<figcaption class="ds-body-s">{caption}</figcaption>
	{/if}
</figure>

<style>
	.figure {
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-3);
	}

	img {
		width: 100%;
		height: auto;
		border-radius: var(--radius-md);
		background: var(--surface-subtle);
		border: 1px solid var(--border-default);
	}

	figcaption {
		margin: 0;
		color: var(--text-secondary);
	}
</style>
