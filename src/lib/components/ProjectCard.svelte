<script lang="ts">
	import ProjectTags from './ProjectTags.svelte';

	let {
		title,
		tags,
		description,
		href,
		linkLabel = 'Voir le projet →',
		imageSrc,
		imageAlt = ''
	}: {
		title: string;
		tags: string[];
		description: string;
		href: string;
		linkLabel?: string;
		imageSrc?: string;
		imageAlt?: string;
	} = $props();
</script>

<article class="card">
	<div class="media">
		{#if imageSrc}
			<img src={imageSrc} alt={imageAlt} />
		{/if}
	</div>
	<h3>{title}</h3>
	<ProjectTags {tags} />
	<p class="description">{description}</p>
	<a class="link" {href}>{linkLabel}</a>
</article>

<style>
	.card {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-3);
		width: 100%;
		max-width: 390px;
		padding: var(--spacing-5);
		background: var(--surface-elevated);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-lg);
	}

	.media {
		width: 100%;
		aspect-ratio: 35 / 18;
		overflow: hidden;
		background: var(--surface-subtle);
		border-radius: var(--radius-md);
	}

	.media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	h3 {
		margin: 0;
		color: var(--text-primary);
		font: 600 var(--text-h3-size) / var(--text-h3-line) var(--font-sans);
	}

	.description {
		margin: 0;
		color: var(--text-secondary);
		font: 400 var(--text-body-s-size) / var(--text-body-s-line) var(--font-sans);
	}

	.link {
		min-height: 44px;
		display: inline-flex;
		align-items: center;
		color: var(--action-primary);
		font: 500 var(--text-label-m-size) / var(--text-label-m-line) var(--font-sans);
		text-decoration: none;
	}

	.link:hover {
		text-decoration: underline;
	}

	.link:focus-visible {
		outline: 2px solid var(--action-focus);
		outline-offset: 3px;
		border-radius: var(--radius-sm);
	}
</style>
