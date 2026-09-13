<script lang="ts">
	import type { Snippet } from 'svelte';
	import { asset, resolve } from '$app/paths';
	import type { Project } from '$lib/data/projects';
	import { getNextProject, projectPath } from '$lib/data/projects';
	import Button from './Button.svelte';
	import ProjectImage from './ProjectImage.svelte';
	import ProjectTags from './ProjectTags.svelte';
	import WindowFrame from './WindowFrame.svelte';

	let {
		project,
		children
	}: {
		project: Project;
		children: Snippet;
	} = $props();

	const nextProject = $derived(getNextProject(project.slug));
</script>

<svelte:head>
	<title>{project.title} — Case study</title>
	<meta name="description" content={project.description} />
</svelte:head>

<WindowFrame title={project.title} parent={{ href: `${resolve('/')}#projets`, label: 'Projets' }}>
	<article>
		<header class="hero">
			<h1 class="ds-h1">{project.title}</h1>
			<p class="subtitle ds-body-l">{project.subtitle}</p>
			<ProjectTags tags={project.tags} />
			{#if project.image}
				<ProjectImage src={asset(project.image)} alt={project.imageAlt} />
			{/if}
		</header>

	{@render children()}

	{#if nextProject}
		<nav class="next" aria-label="Projet suivant">
			<p class="next-label ds-label-m">Projet suivant</p>
			<p class="next-title ds-h3">{nextProject.title}</p>
			<Button href={resolve(projectPath(nextProject.slug))} variant="secondary">
				Voir {nextProject.title}
			</Button>
		</nav>
	{/if}
	</article>
</WindowFrame>

<style>
	.hero {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--spacing-4);
		padding-bottom: var(--spacing-8);
	}

	.subtitle {
		margin: 0;
		color: var(--text-secondary);
	}

	h1 {
		margin: 0;
	}

	.next {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--spacing-3);
		margin-top: var(--spacing-8);
		padding-top: var(--spacing-10);
		border-top: 1px solid var(--border-default);
	}

	.next-label,
	.next-title {
		margin: 0;
	}

	.next-label {
		color: var(--text-secondary);
	}
</style>
