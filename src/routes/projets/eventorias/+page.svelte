<script lang="ts">
 import CaseStudyLayout from '#lib/components/CaseStudyLayout.svelte';
 import CaseStudySection from '#lib/components/CaseStudySection.svelte';
 import { getProject } from '#lib/data/projects.js';
 const project = getProject('eventorias');
</script>

{#if project}
 <CaseStudyLayout {project}>
  <CaseStudySection title="Contexte" id="contexte">
   <p>Dans le cadre de ma formation Product Designer chez OpenClassrooms, j’ai travaillé sur Eventorias, une application mobile de découverte d’événements à Paris. Le projet s’adresse principalement aux touristes anglophones, qui doivent souvent comparer plusieurs sources pour trouver une activité adaptée à leurs dates, leur budget et leur langue.</p>
   <p>La mission consistait à concevoir un prototype no-code, à tester les parcours essentiels et à préparer une passation exploitable par une équipe de développement.</p>
  </CaseStudySection>
  <CaseStudySection title="Problème et périmètre" id="probleme">
   <p>Comment permettre à un visiteur de découvrir rapidement un événement pertinent, tout en donnant aux organisateurs un moyen simple de publier et de gérer leurs propositions ?</p>
   <p>Le MVP couvre la recherche et les filtres, la consultation des fiches événement, l’ajout au calendrier, ainsi que la création, la modification et l’annulation d’événements. L’ajout au calendrier n’est pas une réservation : le périmètre n’inclut ni paiement, ni billetterie, ni messagerie.</p>
  </CaseStudySection>
  <CaseStudySection title="Mon rôle" id="role">
   <p>J’ai structuré les parcours utilisateurs, étudié des applications comparables, conçu et ajusté le prototype mobile, organisé des micro-tests d’usage avec Maze, analysé les retours et préparé la documentation de passation aux développeurs.</p>
  </CaseStudySection>
  <CaseStudySection title="Démarche" id="demarche">
   <h4>Deux parcours prioritaires</h4>
   <p>Le parcours visiteur part de l’exploration des événements, passe par les filtres et la fiche détaillée, puis aboutit à l’ajout au calendrier. Le parcours organisateur permet de créer un événement à travers trois étapes : informations générales, date et lieu, puis détails complémentaires.</p>
   <h4>Une veille reliée aux décisions</h4>
   <p>Le benchmark d’Eventbrite a nourri la hiérarchisation des filtres : catégories rapides sur Explore, critères détaillés sur un écran dédié. L’observation de Meetup a contribué à la réflexion sur les parcours guidés et sur la confirmation explicite d’une action. Dans Eventorias, cette dernière confirme uniquement l’ajout au calendrier, et non une inscription à l’événement.</p>
   <h4>Un prototype pour confronter les hypothèses à l’usage</h4>
   <p>Le prototype no-code permet de parcourir les principaux écrans et de tester les interactions avant le développement. Il ne constitue pas une application de production : l’authentification et certaines intégrations y sont simulées.</p>
  </CaseStudySection>
  <CaseStudySection title="Micro-tests et améliorations" id="tests">
   <p>J’ai mené des micro-tests qualitatifs avec trois participants sur deux missions : trouver un événement et l’ajouter au calendrier, puis créer et publier un événement. Ce petit échantillon permet d’identifier des difficultés d’usage, mais pas de mesurer statistiquement la réussite du produit.</p>
   <h4>Rendre la confirmation explicite</h4>
   <p>Un retour signalait une incertitude sur le résultat de l’action. J’ai renforcé l’écran de confirmation et ajouté un état persistant « In your calendar » sur la fiche de l’événement.</p>
   <h4>Faciliter l’accès à la création</h4>
   <p>L’action « Create event » a été rendue plus visible dans l’espace organisateur afin de clarifier le point d’entrée du parcours.</p>
   <h4>Renforcer l’identité du produit</h4>
   <p>Un retour indiquait que l’entrée dans Eventorias n’était pas suffisamment perceptible. Un court écran de démarrage avec le logo a été ajouté.</p>
  </CaseStudySection>
  <CaseStudySection title="Décisions UX/UI et règles métier" id="decisions">
   <p>La consultation des événements reste accessible sans compte ; une authentification est demandée lorsque l’utilisateur souhaite enregistrer un événement. Le formulaire organisateur signale les champs obligatoires et les erreurs de validation. Les actions importantes doivent produire un retour compréhensible.</p>
   <p>La séparation des rôles est essentielle : un organisateur doit pouvoir modifier ou annuler uniquement ses propres événements. Les permissions devront être vérifiées côté serveur lors de l’implémentation.</p>
  </CaseStudySection>
  <CaseStudySection title="Passation aux développeurs" id="passation">
   <p>J’ai préparé une documentation Notion et une vidéo de passation pour expliciter les parcours, les règles métier, les comportements attendus et les limites du prototype. Le prototype sert de référence d’interaction et de conception, mais l’équipe doit encore implémenter les services réels : authentification, persistance des données, stockage des images et intégration au calendrier.</p>
  </CaseStudySection>
  <CaseStudySection title="Résultats et apprentissages" id="resultats">
   <p>Le projet aboutit à un prototype mobile parcourable, enrichi après les micro-tests, ainsi qu’à une documentation de passation. Les retours qualitatifs ont permis de cibler des corrections concrètes, sans constituer une validation exhaustive auprès de la population cible.</p>
   <p>Ce travail m’a permis de relier recherche, décisions UX/UI, prototypage et contraintes d’implémentation. En tant que développeur web, j’y ai particulièrement travaillé la manière de transmettre des intentions de conception sous forme de comportements et de règles exploitables par une équipe technique.</p>
  </CaseStudySection>
  <CaseStudySection title="Documentation" id="ressources">
   <ul>
    <li><a href="https://app.notion.com/p/Inspirations-et-veille-4392b1ba3e45824885d381fe85897826" target="_blank" rel="noopener noreferrer">Inspirations et veille UX/UI — Notion</a></li>
    <li><a href="https://app.notion.com/p/Eventorias-App-Passation-aux-d-veloppeurs-f4e2b1ba3e4582859985017792f9377d" target="_blank" rel="noopener noreferrer">Passation aux développeurs — Notion</a></li>
   </ul>
  </CaseStudySection>
 </CaseStudyLayout>
{/if}
