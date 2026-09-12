<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    href,
    active = false,
    children
  }: {
    href: string;
    active?: boolean;
    children: Snippet;
  } = $props();
</script>

<a class:active class="nav-link" {href} aria-current={active ? 'page' : undefined}>
  {@render children()}
</a>

<style>
  .nav-link {
    min-height: 49px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-4) var(--spacing-3);
    border-radius: var(--radius-sm);
    color: var(--text-primary);
    font: 500 var(--text-label-m-size) / var(--text-label-m-line) var(--font-sans);
    text-decoration: none;
    transition: background-color 140ms ease, color 140ms ease;
  }

  .nav-link:hover {
    background: var(--surface-subtle);
  }

  .nav-link.active {
    color: var(--action-primary);
  }

  .nav-link:focus-visible {
    outline: 2px solid var(--action-focus);
    outline-offset: 2px;
  }
</style>
