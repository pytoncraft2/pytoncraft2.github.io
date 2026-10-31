<script lang="ts">
	import { resolve } from '$app/paths';
	import { projectPath, type ProjectSlug } from '$lib/data/projects';
	import ProjectTags from './ProjectTags.svelte';

	let {
		slug,
		title,
		tags,
		description,
		linkLabel = 'Voir le projet →',
		imageSrc,
		imageAlt = ''
	}: {
		slug: ProjectSlug;
		title: string;
		tags: string[];
		description: string;
		linkLabel?: string;
		imageSrc?: string;
		imageAlt?: string;
	} = $props();

	const restored = $derived(
		typeof document !== 'undefined' && document.documentElement.dataset.projectTransition === slug
	);

	function arm(event: MouseEvent) {
		if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
			return;
		}

		const card = event.currentTarget;
		if (!(card instanceof HTMLElement)) {
			return;
		}

		document.querySelectorAll('[data-project-card][data-transition]').forEach((node) => {
			node.removeAttribute('data-transition');
		});
		card.closest('[data-project-card]')?.setAttribute('data-transition', '');
	}
</script>

<article
	class="card"
	data-project-card
	data-transition={restored ? '' : undefined}
	style:--vt-title={`project-${slug}-title`}
	style:--vt-media={`project-${slug}-media`}
	style:--vt-tags={`project-${slug}-tags`}
	style:--vt-summary={`project-${slug}-summary`}
	style:--vt-card={`project-${slug}-card`}
>
	<div class="media">
		{#if imageSrc}
			<img src={imageSrc} alt={imageAlt} />
		{/if}
	</div>
	<h3 class="title">{title}</h3>
	<ProjectTags {tags} />
	<p class="description">{description}</p>
	<a class="link" href={resolve(projectPath(slug))} onclick={arm}>{linkLabel}</a>
</article>

<style>
	.card {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-3);
		width: 100%;
		max-width: var(--project-card-max-width, 390px);
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

	.title,
	.card :global(.tags) {
		width: fit-content;
	}

	.description {
		margin: 0;
		color: var(--text-secondary);
		font: 400 var(--text-body-s-size) / var(--text-body-s-line) var(--font-sans);
	}

	.card[data-transition] {
		view-transition-name: var(--vt-card);
		view-transition-class: project-frame;
	}

	.card[data-transition] .title {
		view-transition-name: var(--vt-title);
		view-transition-class: project-text;
	}

	.card[data-transition] .media {
		view-transition-name: var(--vt-media);
		view-transition-class: project-media;
	}

	.card[data-transition] :global(.tags) {
		view-transition-name: var(--vt-tags);
		view-transition-class: project-text;
	}

	.card[data-transition] .description {
		view-transition-name: var(--vt-summary);
		view-transition-class: project-text;
	}

	.link {
		min-height: 44px;
		margin-top: auto;
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
