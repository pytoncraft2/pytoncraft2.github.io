<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    href,
    variant = 'primary',
    type = 'button',
    disabled = false,
    ariaLabel,
    children
  }: {
    href?: string;
    variant?: 'primary' | 'secondary';
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    ariaLabel?: string;
    children: Snippet;
  } = $props();
</script>

{#if href}
  <a class:primary={variant === 'primary'} class:secondary={variant === 'secondary'} class="button" {href} aria-label={ariaLabel}>
    {@render children()}
  </a>
{:else}
  <button class:primary={variant === 'primary'} class:secondary={variant === 'secondary'} class="button" {type} {disabled} aria-label={ariaLabel}>
    {@render children()}
  </button>
{/if}

<style>
  .button {
    min-height: 49px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-4);
    border-radius: var(--radius-md);
    font: 500 var(--text-label-m-size) / var(--text-label-m-line) var(--font-sans);
    text-decoration: none;
    border: 1px solid transparent;
    cursor: pointer;
    transition: background-color 140ms ease, border-color 140ms ease, color 140ms ease;
  }

  .primary {
    background: var(--action-primary);
    color: var(--text-inverse);
  }

  .primary:hover {
    background: var(--action-primary-hover);
  }

  .secondary {
    background: var(--surface-default);
    color: var(--text-primary);
    border-color: var(--border-default);
  }

  .secondary:hover {
    background: var(--surface-subtle);
    border-color: var(--border-strong);
  }

  .button:focus-visible {
    outline: 2px solid var(--action-focus);
    outline-offset: 2px;
  }

  .button:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
</style>
