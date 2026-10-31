<script lang="ts">
	import type { TechId } from '#lib/data/skills.js';
	import { techIcons } from '#lib/data/tech-icons.js';

	let { name }: { name: TechId } = $props();

	const icon = $derived(techIcons[name]);
</script>

<img
	class={['icon', icon.invertible && 'invertible']}
	src={icon.src}
	alt=""
	width="24"
	height="24"
	decoding="async"
/>

<style>
	.icon {
		display: block;
		width: var(--tech-icon-size, 1.5rem);
		height: var(--tech-icon-size, 1.5rem);
		flex-shrink: 0;
		object-fit: contain;
	}

	:global(html[data-theme='dark']) .invertible {
		filter: invert(1);
	}
</style>
