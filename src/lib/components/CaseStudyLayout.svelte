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
	<title>{project.title} • Case study</title>
	<meta name="description" content={project.description} />
</svelte:head>

<WindowFrame
	title={project.title}
	parent={{ href: `${resolve('/')}#projets`, label: 'Projets' }}
	transitionName={`project-${project.slug}-card`}
>
	<article>
		<header class="hero">
			{#if project.image}
				<ProjectImage
					src={asset(project.image)}
					alt={project.imageAlt}
					transitionName={`project-${project.slug}-media`}
				/>
			{/if}
			<h1 class="ds-h1" style:view-transition-name={`project-${project.slug}-title`} style:view-transition-class="project-text">
				{project.title}
			</h1>
			<ProjectTags tags={project.tags} transitionName={`project-${project.slug}-tags`} />
			<p
				class="subtitle ds-body-l"
				style:view-transition-name={`project-${project.slug}-summary`}
				style:view-transition-class="project-text"
			>
				{project.description}
			</p>
		</header>

	{@render children()}

	{#if nextProject}
		<nav class="next" aria-label="Projet suivant">
			<div class="next-text">
				<p class="next-label ds-label-m">Projet suivant</p>
				<p class="next-title ds-h3">{nextProject.title}</p>
			</div>
			<Button href={resolve(projectPath(nextProject.slug))} variant="secondary">
				Voir le projet →
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
		max-width: 60ch;
		margin: 0;
		color: var(--text-secondary);
	}

	h1 {
		margin: 0;
	}

	.next {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--spacing-4);
		margin-top: var(--spacing-8);
		padding-top: var(--spacing-10);
		border-top: 1px solid var(--border-default);
	}

	.next-text {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-1);
	}

	.next-label,
	.next-title {
		margin: 0;
	}

	.next-label {
		color: var(--text-secondary);
	}
</style>
