<script lang="ts">
	import { asset } from '$app/paths';
	import Button from '$lib/components/Button.svelte';
	import WindowFrame from '$lib/components/WindowFrame.svelte';

	const name = 'Timothée Hennequin';
	const email = 'timothennequin@gmail.com';
	const linkedInHref = 'https://www.linkedin.com/in/timothee-hennequin/';
	const cvHref = asset('/cv-timothee-hennequin.pdf');
</script>

<svelte:head>
	<title>À propos — {name}</title>
	<meta
		name="description"
		content="Parcours de {name}, développeur web avec une compétence complémentaire en Product Design."
	/>
</svelte:head>

<WindowFrame title="Parcours">
	<article>
		<header class="hero">
		<h1 class="ds-h1">À propos</h1>
		<p class="lead ds-body-l">
			Développeur web de formation, je complète mon profil avec une formation Product Designer afin
			de mieux relier conception, usages et contraintes techniques.
		</p>
	</header>

	<section class="section" aria-labelledby="presentation-title">
		<h2 id="presentation-title" class="ds-h2">Présentation</h2>
		<p class="ds-body-m">
			Je conçois et développe des interfaces web claires, accessibles et maintenables. Mon parcours
			technique me permet de relier les contraintes de production aux décisions de conception, tout en
			gardant le développement web comme cœur de métier.
		</p>
	</section>

	<section class="section" aria-labelledby="parcours-title">
		<h2 id="parcours-title" class="ds-h2">Parcours</h2>
		<ul>
			<li>2020–2022 — Intégrateur / développeur web, Web@cadémie à Nancy</li>
			<li>2021–2025 — Développeur web en alternance chez EasySAV à Metz</li>
			<li>2022–2025 — Master of Science Epitech, spécialité IoT, à Nancy</li>
			<li>Depuis 2026 — Formation Product Designer chez OpenClassrooms</li>
			<li>
				En parallèle — Bénévole à LaToileScoute, avec notamment le développement de Vroum, un outil
				de covoiturage scout utilisé en production
			</li>
		</ul>
	</section>

	<section class="section" aria-labelledby="competences-title">
		<h2 id="competences-title" class="ds-h2">Compétences techniques</h2>
		<ul>
			<li>Front-end : SvelteKit, React, Twig</li>
			<li>Back-end : FastAPI, Flask, Symfony, Node.js</li>
			<li>Données : PostgreSQL, MySQL</li>
			<li>Qualité et livraison : Git, GitLab CI, Docker, Playwright</li>
			<li>Outils et environnements : EasyAdmin, Raspberry Pi, Arduino</li>
		</ul>
	</section>

	<section class="section" aria-labelledby="product-design-title">
		<h2 id="product-design-title" class="ds-h2">Product Design, compétence complémentaire</h2>
		<p class="ds-body-m">
			Je développe cette compétence afin d’être plus autonome dans la conception de mes produits et
			de mieux comprendre les usages avant de passer au code. La formation m’a notamment permis de
			travailler la recherche utilisateur, le prototypage Figma, le design system, l’accessibilité et
			la structuration de case studies.
		</p>
	</section>

	<section class="section" aria-labelledby="methode-title">
		<h2 id="methode-title" class="ds-h2">Méthode de travail</h2>
		<p class="ds-body-m">
			Je commence par clarifier le besoin et les contraintes avant de choisir une solution. Je préfère
			avancer par itérations courtes : structurer l’information, prototyper lorsque c’est utile,
			implémenter, puis confronter le résultat aux usages et aux retours. En équipe, je cherche à rendre
			les décisions compréhensibles et à garder un lien direct entre conception, faisabilité technique,
			accessibilité et maintenance.
		</p>
	</section>

	<section class="section" aria-labelledby="cv-title">
		<h2 id="cv-title" class="ds-h2">CV</h2>
		<Button href={cvHref} variant="secondary">Télécharger mon CV</Button>
	</section>

	<section id="contact" class="section" aria-labelledby="contact-title">
		<h2 id="contact-title" class="ds-h2">Contact</h2>
		<p class="ds-body-m">Pour un échange autour d’un projet ou d’une opportunité, vous pouvez me contacter directement.</p>
		<div class="contact-links">
			<a href={`mailto:${email}`}>{email}</a>
			<a href={linkedInHref} target="_blank" rel="noreferrer">LinkedIn</a>
		</div>
	</section>
	</article>
</WindowFrame>

<style>
	.hero {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-4);
		padding-bottom: var(--spacing-8);
	}

	.hero h1,
	.lead {
		margin: 0;
	}

	.lead {
		max-width: 40rem;
		color: var(--text-secondary);
	}

	.section {
		padding-block: var(--spacing-10);
	}

	.section h2 {
		margin: 0 0 var(--spacing-5);
	}

	.section p,
	.section ul {
		margin: 0 0 var(--spacing-4);
		max-width: 40rem;
	}

	.section ul {
		padding-left: 1.25rem;
		font: 400 var(--text-body-m-size) / var(--text-body-m-line) var(--font-sans);
	}

	.section li + li {
		margin-top: var(--spacing-2);
	}

	.contact-links {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-4);
	}

	.contact-links a {
		min-height: 44px;
		display: inline-flex;
		align-items: center;
		color: var(--action-primary);
		font: 500 var(--text-label-m-size) / var(--text-label-m-line) var(--font-sans);
		text-decoration: none;
	}

	.contact-links a:hover {
		text-decoration: underline;
	}

	.contact-links a:focus-visible {
		outline: 2px solid var(--action-focus);
		outline-offset: 2px;
		border-radius: var(--radius-sm);
	}
</style>
