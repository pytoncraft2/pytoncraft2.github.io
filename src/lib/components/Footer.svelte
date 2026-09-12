<script lang="ts">
	const name = 'Timothée Hennequin';
	const year = new Date().getFullYear();
</script>

<footer class="footer">
	<p class="copy">© {year} {name}</p>
</footer>

<style>
	.footer {
		margin-top: auto;
		padding: var(--spacing-6) var(--spacing-4) calc(5.5rem + env(safe-area-inset-bottom));
	}

	.copy {
		margin: 0;
		color: var(--text-secondary);
		font: 400 var(--text-body-s-size) / var(--text-body-s-line) var(--font-sans);
		text-align: center;
	}

	@media (min-width: 40rem) {
		.footer {
			padding-bottom: calc(var(--spacing-16) + 4.5rem);
		}

		:global(html[data-dock='left']) .footer,
		:global(html[data-dock='right']) .footer {
			padding-bottom: var(--spacing-8);
		}
	}
</style>
