<script lang="ts">
	import CaseStudyLayout from '$lib/components/CaseStudyLayout.svelte';
	import CaseStudySection from '$lib/components/CaseStudySection.svelte';
	import { getProject } from '$lib/data/projects';

	const project = getProject('sportsee');
</script>

{#if project}
	<CaseStudyLayout {project}>
		<CaseStudySection title="Contexte" id="contexte">
			<p>Dans le cadre de ma formation Product Designer chez OpenClassrooms, j’ai conçu l’interface de SportSee, une application de suivi d’activité sportive. La mission consistait à passer d’une structure fonctionnelle à des maquettes haute fidélité, puis à documenter un Design System réutilisable.</p>
			<p>Le périmètre couvre trois écrans : connexion, dashboard et profil, déclinés sur ordinateur, tablette et mobile. Il s’agit d’un projet de conception, sans application développée ou mise en production à ce stade.</p>
		</CaseStudySection>
		<CaseStudySection title="Problème" id="probleme">
			<p>Comment rendre les performances sportives faciles à comprendre, tout en conservant une interface motivante et cohérente sur plusieurs formats ? L’enjeu était de hiérarchiser les données essentielles et de permettre une lecture plus détaillée sans surcharger le dashboard.</p>
		</CaseStudySection>
		<CaseStudySection title="Mon rôle" id="role">
			<p>J’ai analysé le brief, les parcours utilisateurs et les wireframes annotés, réalisé le mini-benchmark et le moodboard, défini les fondations visuelles, construit les composants Figma et adapté les maquettes aux trois formats. J’ai également effectué les contrôles de conception et documenté le système dans Zeroheight.</p>
		</CaseStudySection>
		<CaseStudySection title="Démarche" id="demarche">
			<h4>Comparer pour choisir</h4>
			<p>J’ai étudié Strava, Komoot et Fitbit pour comparer la présentation des objectifs, la hiérarchie des données et la lecture de la progression. J’ai retenu des chiffres prioritaires bien identifiés, des graphiques simples et une motivation mesurée. Les classements sociaux, la cartographie et les scores médicaux sortaient du périmètre du projet.</p>
			<h4>Définir une direction graphique</h4>
			<p>Le moodboard associe une identité sportive à des surfaces claires et aérées. Le rouge sert d’accent pour les actions et les informations importantes. Manrope donne du caractère aux titres et aux données, tandis qu’Inter accompagne les textes d’interface.</p>
			<h4>Construire et appliquer le système</h4>
			<p>J’ai traduit cette direction en couleurs, typographies, espacements et composants réutilisables. Les wireframes ont servi de base à la structure ; Figma Make m’a aidé à explorer une direction visuelle, ensuite adaptée manuellement au Design System et aux contraintes responsive. Les maquettes finales constituent le livrable de référence.</p>
		</CaseStudySection>
		<CaseStudySection title="Décisions & arbitrages" id="decisions">
			<h4>Hiérarchiser avant de détailler</h4>
			<p>La connexion concentre l’attention sur l’identification. Le dashboard présente d’abord les indicateurs clés, puis les graphiques pour approfondir la lecture. Le profil regroupe les informations personnelles et les statistiques globales avec les mêmes repères visuels.</p>
			<h4>Réorganiser selon le format</h4>
			<p>Les grilles passent de 12 colonnes sur ordinateur à 8 sur tablette et 4 sur mobile. La navigation devient plus compacte, les cartes se réorganisent et les graphiques s’empilent. Les espacements et les titres s’adaptent à la largeur disponible, en conservant la priorité des informations.</p>
			<h4>Centraliser les styles</h4>
			<p>Les variables Figma portent les valeurs partagées. Modifier la couleur principale commence par la variable concernée : les composants et les instances liés héritent de sa nouvelle valeur. Les boutons, champs, éléments de navigation et cartes peuvent ensuite être réutilisés pour composer de nouveaux écrans.</p>
		</CaseStudySection>
		<CaseStudySection title="Accessibilité et contrôle qualité" id="accessibilite">
			<p>J’ai contrôlé les principales associations de couleurs pour préserver la lisibilité. Les composants prévoient des focus visibles, des labels de formulaire et des erreurs qui ne reposent pas uniquement sur la couleur. Sur tablette et mobile, les principales cibles tactiles mesurent au moins 44 pixels.</p>
			<p>Les graphiques associent couleurs, titres, unités et informations textuelles. J’ai également vérifié les neuf maquettes pour repérer les débordements, les problèmes d’espacement et les incohérences entre composants.</p>
			<p>Ces contrôles portent sur la conception. La navigation au clavier, les technologies d’assistance et le comportement réel devront être vérifiés lors du développement ; ils ne constituent pas une validation de l’accessibilité d’une application en production.</p>
		</CaseStudySection>
		<CaseStudySection title="Résultats et livrables" id="resultats">
			<p>Le projet aboutit à un mini-benchmark, un moodboard, des fondations visuelles, des composants Figma et neuf maquettes haute fidélité. Un prototype relie les écrans et permet d’explorer la navigation.</p>
			<p>La documentation Zeroheight rassemble le démarrage, les fondations (couleurs, typographies, espacements, tokens et iconographie) ainsi que les usages, variantes et bonnes pratiques des composants. Elle accompagne le fichier Figma pour faciliter la prise en main du système.</p>
			<p>Aucun gain d’usage n’a été mesuré auprès d’utilisateurs à ce stade. Une prochaine étape serait de tester les parcours et la compréhension des données avant l’implémentation.</p>
		</CaseStudySection>
		<CaseStudySection title="Apprentissages" id="apprentissages">
			<p>Ce projet m’a permis de relier une direction graphique à des règles concrètes et réutilisables. En tant que développeur web, cette démarche renforce mon autonomie pour concevoir mes propres interfaces et préparer leur implémentation avec des composants et des valeurs partagés.</p>
			<p>J’ai aussi appris à distinguer une exploration visuelle d’un livrable final : une proposition issue de Figma Make doit être adaptée, structurée et contrôlée pour s’intégrer au produit.</p>
		</CaseStudySection>
		<CaseStudySection title="Explorer le projet" id="ressources">
			<ul>
				<li><a href="https://www.figma.com/design/7oIV2vJHunlZkKaxUFk9iv/Sportsee-wireframes-annot%C3%A9s--Copy-?node-id=0-1" target="_blank" rel="noopener noreferrer">Consulter les maquettes et le prototype dans Figma</a></li>
				<li><a href="https://zeroheight.com/09f44adcf" target="_blank" rel="noopener noreferrer">Explorer le Design System dans Zeroheight</a></li>
			</ul>
		</CaseStudySection>
	</CaseStudyLayout>
{/if}
