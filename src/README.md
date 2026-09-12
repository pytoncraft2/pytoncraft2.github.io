# Portfolio — Figma → SvelteKit design-system bridge

This starter mirrors the current Figma design system for the portfolio.

## Files

- `src/lib/styles/tokens.css`: primitives, semantic Light/Dark tokens, spacing, radius and typography sizes.
- `src/lib/styles/typography.css`: utility classes mirroring Figma typography styles.
- `src/lib/components/Button.svelte`: Primary / Secondary button with hover and keyboard focus states.
- `src/lib/components/NavLink.svelte`: header navigation link with active state.
- `src/lib/components/ProjectCard.svelte`: project card used on the portfolio homepage.

## SvelteKit integration

Import the styles once in `src/routes/+layout.svelte`:

```svelte
<script lang="ts">
  import '$lib/styles/tokens.css';
  import '$lib/styles/typography.css';
</script>

<slot />
```

## Dark mode

Set `data-theme="dark"` on `html` or any container:

```ts
document.documentElement.dataset.theme = 'dark';
```

Reset to light:

```ts
delete document.documentElement.dataset.theme;
```

## Mapping

The CSS custom-property names intentionally follow the Figma variable names:

- `text/primary` → `--text-primary`
- `surface/default` → `--surface-default`
- `action/primary` → `--action-primary`
- `spacing/4` → `--spacing-4`
- `radius/md` → `--radius-md`

This keeps implementation changes traceable back to Figma without adding a token-sync dependency.
