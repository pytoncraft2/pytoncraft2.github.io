<script lang="ts">
	import { resolve } from '$app/paths';

	const name = 'Timothée Hennequin';
	const year = new Date().getFullYear();
</script>

<footer class="footer">
	<div class="inner shell">
		<p class="copy">© {year} {name}</p>
		<nav class="nav" aria-label="Pied de page">
			<a href={resolve('/')}>Accueil</a>
			<a href="{resolve('/')}#projets">Projets</a>
			<a href={resolve('/a-propos')}>À propos</a>
			<a href="{resolve('/')}#contact">Contact</a>
		</nav>
	</div>
</footer>

<style>
	.footer {
		margin-top: auto;
		border-top: 1px solid var(--border-default);
		background: var(--surface-subtle);
	}

	.inner {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--spacing-4);
		padding-block: var(--spacing-8);
	}

	.copy {
		margin: 0;
		color: var(--text-secondary);
		font: 400 var(--text-body-s-size) / var(--text-body-s-line) var(--font-sans);
	}

	.nav {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-2);
	}

	.nav a {
		min-height: 44px;
		display: inline-flex;
		align-items: center;
		padding-inline: var(--spacing-2);
		color: var(--text-primary);
		font: 500 var(--text-label-m-size) / var(--text-label-m-line) var(--font-sans);
		text-decoration: none;
	}

	.nav a:hover {
		text-decoration: underline;
	}

	.nav a:focus-visible {
		outline: 2px solid var(--action-focus);
		outline-offset: 2px;
		border-radius: var(--radius-sm);
	}
</style>
