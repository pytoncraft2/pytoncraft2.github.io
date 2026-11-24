<script lang="ts">
	import type { Attachment } from 'svelte/attachments';

	type Star = {
		x: number;
		y: number;
		r: number;
		opacity: number;
		twinkle: boolean;
		duration: number;
		delay: number;
	};

	/** Générateur pseudo-aléatoire déterministe : même ciel au pré-rendu et à l’hydratation. */
	function seeded(seed: number) {
		let value = seed;
		return () => {
			value = (value * 16807) % 2147483647;
			return (value - 1) / 2147483646;
		};
	}

	function round(value: number) {
		return Math.round(value * 10) / 10;
	}

	function createStars(count: number): Star[] {
		const random = seeded(11);
		const result: Star[] = [];

		while (result.length < count) {
			const x = random() * 1440;
			const y = random() * 420;
			// Pas d’étoile derrière le texte du hero (zone gauche, sous l’en-tête).
			if (x < 900 && y > 30 && y < 380) {
				continue;
			}

			result.push({
				x: round(x),
				y: round(y),
				r: round(0.6 + random() * 1.2),
				opacity: round(0.45 + random() * 0.5),
				twinkle: result.length % 3 === 0,
				// Un seul scintillement, terminé avant 5 s (au plus 1,4 + 3,5 s).
				duration: round(2 + random() * 1.5),
				delay: round(random() * 1.4)
			});
		}

		return result;
	}

	const stars = createStars(46);

	let inView = $state(true);

	const watchVisibility: Attachment<HTMLElement> = (node) => {
		const observer = new IntersectionObserver(([entry]) => {
			inView = entry.isIntersecting;
		});
		observer.observe(node);
		return () => observer.disconnect();
	};
</script>

<div class={['scene', { offscreen: !inView }]} aria-hidden="true" {@attach watchVisibility}>
	<!-- Tout le décor, agrandi vers le vélo en bas de l'accueil (voir contact-bubble.ts). -->
	<div class="zoom">
		<div class="sky"></div>
		<!-- Ciel d’orage du jeu (data-game-weather='storm'), par-dessus le dégradé du ciel. -->
		<div class="weather-storm"></div>

		<svg class="sky-layer" viewBox="0 0 1440 640" preserveAspectRatio="xMidYMin slice" focusable="false">
			<defs>
				<linearGradient id="hero-scene-trail" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="-110" y2="0">
					<stop offset="0" stop-color="#ffffff" stop-opacity="0.95" />
					<stop offset="1" stop-color="#ffffff" stop-opacity="0" />
				</linearGradient>
			</defs>

			<g class="night">
				{#each stars as star, index (index)}
					<circle
						class={['star', { twinkle: star.twinkle }]}
						cx={star.x}
						cy={star.y}
						r={star.r}
						opacity={star.opacity}
						style:--duration="{star.duration}s"
						style:--delay="{star.delay}s"
					/>
				{/each}

				<g transform="translate(1260 60) rotate(152)">
					<g class="meteor">
						<line x1="0" y1="0" x2="-110" y2="0" stroke="url(#hero-scene-trail)" stroke-width="2" stroke-linecap="round" />
						<circle r="1.8" fill="#ffffff" />
					</g>
				</g>
			</g>

			<g class="day">
				<g class="cloud cloud-a" transform="translate(940 70)">
					<rect x="-46" y="0" width="112" height="24" rx="12" />
					<circle cx="-10" cy="2" r="18" />
					<circle cx="22" cy="-4" r="24" />
				</g>
				<g class="cloud cloud-b" transform="translate(1290 420) scale(0.8)">
					<rect x="-46" y="0" width="112" height="24" rx="12" />
					<circle cx="-10" cy="2" r="18" />
					<circle cx="22" cy="-4" r="24" />
				</g>
				<g class="cloud cloud-c" transform="translate(620 470) scale(0.6)">
					<rect x="-46" y="0" width="112" height="24" rx="12" />
					<circle cx="-10" cy="2" r="18" />
					<circle cx="22" cy="-4" r="24" />
				</g>
			</g>
		</svg>

		<!-- data-horizon-y : ligne du sol (où roule le cycliste), lue par dock-horizon.ts. -->
		<svg
			class="land"
			viewBox="0 0 1440 320"
			preserveAspectRatio="xMidYMax slice"
			focusable="false"
			data-horizon-y="289"
		>
			<defs>
				<linearGradient id="hero-scene-beam" gradientUnits="userSpaceOnUse" x1="20" y1="0" x2="100" y2="0">
					<stop offset="0" stop-color="var(--scene-lamp)" stop-opacity="0.5" />
					<stop offset="1" stop-color="var(--scene-lamp)" stop-opacity="0" />
				</linearGradient>
				<mask id="hero-scene-moon-mask" maskUnits="userSpaceOnUse">
					<rect x="960" y="40" width="100" height="100" fill="#ffffff" />
					<circle cx="1024" cy="82" r="22" fill="#000000" />
				</mask>
			</defs>

			<!-- Astre : le soleil se couche et la lune se lève quand le thème passe en sombre. -->
			<g class="layer astre-rise" style:--depth-offset="16px" style:--game-pan="22px" style:--game-overscan=".08">
				<g class="astre sun">
					<circle cx="1010" cy="92" r="62" fill="var(--scene-sun-glow)" />
					<circle cx="1010" cy="92" r="38" fill="var(--scene-sun)" />
				</g>
				<g class="astre moon">
					<circle cx="1010" cy="92" r="52" fill="var(--scene-moon-glow)" />
					<circle cx="1010" cy="92" r="28" fill="var(--scene-moon)" mask="url(#hero-scene-moon-mask)" />
				</g>
			</g>

			<!-- Éclair lointain de l’orage, derrière les montagnes : position et affichage posés par CyclistGame.astro. -->
			<path class="game-bolt" data-game-bolt d="M0 20 L-9 62 L-1 62 L-12 112 L10 54 L2 54 L9 20 Z" fill="var(--scene-lamp)" transform="translate(400 0)" />

			<g class="layer" style:--i="1" style:--depth-offset="12px" style:--game-pan="30px" style:--game-overscan=".09">
				<path
					fill="var(--scene-far)"
					d="M0 210 L120 150 L210 185 L330 110 L440 170 L560 122 L690 180 L800 136 L930 175 L1050 105 L1180 165 L1300 130 L1440 172 L1440 320 L0 320 Z"
				/>
				<path fill="var(--scene-snow)" d="M330 110 L303.6 126.5 L316 122 L326 128 L338 121 L354.2 123.2 Z" />
				<path fill="var(--scene-snow)" d="M1050 105 L1023.6 120.4 L1036 117 L1046 123 L1060 116 L1078.6 118.2 Z" />
			</g>

			<g class="day">
				<g class="flock">
					<!-- Chaque oiseau est dessiné autour de son corps (0, 0) : seules les ailes bougent. -->
					<path class="bird" transform="translate(12 0)" d="M-12 -5 Q-6 -7 0 0 Q6 -7 12 -5" />
					<g transform="translate(40 -14) scale(0.83)">
						<path class="bird bird-b" d="M-12 -5 Q-6 -7 0 0 Q6 -7 12 -5" />
					</g>
					<g transform="translate(52 8) scale(0.67)">
						<path class="bird bird-c" d="M-12 -5 Q-6 -7 0 0 Q6 -7 12 -5" />
					</g>
				</g>
			</g>

			<g class="layer" style:--i="2" style:--depth-offset="7px" style:--game-pan="42px" style:--game-overscan=".1">
				<path
					fill="var(--scene-mid)"
					d="M0 230 C160 190 300 200 420 220 C560 245 700 195 860 200 C1010 205 1120 240 1260 225 C1350 215 1400 205 1440 210 L1440 320 L0 320 Z"
				/>
			</g>

			<!-- Mot bonus du jeu, posé sur les collines du plan du milieu (texte et position : CyclistGame.astro). -->
			<text class="game-bonus" data-game-bonus x="1440" y="206"></text>

			<!--
				Train du jeu, sur le plan du milieu : les rails et leur gare entrent par la droite vers la fin du parcours,
				le train arrive pendant le mot où il propose une suggestion (début des rails, position et texte
				posés par CyclistGame.astro). Générique, sans nom.
			-->
			<line class="game-rails" x1="1440" y1="229" x2="4440" y2="229" stroke="var(--scene-bike)" stroke-width="1.5" opacity="0.35" />
			<!-- Petite gare au début des rails (origine : début des rails), derrière le train qui s’y arrête. -->
			<g class="game-station" data-game-station transform="translate(1440 229)">
				<path d="M-4 0 V-6 H0" fill="none" stroke="var(--scene-bike)" stroke-width="1.5" stroke-linejoin="round" />
				<rect x="10" y="-29" width="60" height="29" fill="var(--scene-snow)" stroke="var(--scene-bike)" stroke-width="1" />
				<path d="M5 -28 L40 -41 L75 -28 Z" fill="var(--scene-trunk)" stroke="var(--scene-bike)" stroke-width="1" stroke-linejoin="round" />
				<circle cx="40" cy="-32.5" r="2.6" fill="var(--scene-snow)" stroke="var(--scene-bike)" stroke-width="0.8" />
				<path d="M18 -24 h8 v6 h-8 Z M36 -24 h8 v6 h-8 Z M54 -24 h8 v6 h-8 Z" fill="var(--scene-bike)" opacity="0.6" />
				<path class="night" d="M18 -24 h8 v6 h-8 Z M36 -24 h8 v6 h-8 Z M54 -24 h8 v6 h-8 Z" fill="var(--scene-lamp)" />
				<line x1="82" y1="0" x2="82" y2="-20" stroke="var(--scene-bike)" stroke-width="1.2" />
				<circle cx="82" cy="-21" r="1.8" fill="var(--scene-bike)" />
				<circle class="night" cx="82" cy="-21" r="1.8" fill="var(--scene-lamp)" />
			</g>
			<g class="game-train" data-game-train transform="translate(1440 228)">
				<g fill="var(--scene-snow)" stroke="var(--scene-bike)" stroke-width="1" stroke-linejoin="round">
					<path d="M0 0 L5 -6 Q9 -10 18 -10 H40 V0 Z" />
					<rect x="42" y="-10" width="36" height="10" rx="2" />
					<rect x="80" y="-10" width="36" height="10" rx="2" />
				</g>
				<path d="M10 -6.5 H38 M45 -6.5 H75 M83 -6.5 H113" stroke="var(--scene-bike)" stroke-width="2" stroke-dasharray="4 2" opacity="0.6" />
				<path class="night" d="M10 -6.5 H38 M45 -6.5 H75 M83 -6.5 H113" stroke="var(--scene-lamp)" stroke-width="2" stroke-dasharray="4 2" />
				<text class="train-suggestion" x="58" y="-47" text-anchor="middle"></text>
			</g>

			<g class="layer" style:--i="3" style:--depth-offset="3px" style:--game-pan="54px" style:--game-overscan=".12">
				<path
					fill="var(--scene-near)"
					d="M0 250 C120 222 250 214 370 236 C450 251 520 266 620 270 C760 274 840 262 960 248 C1080 234 1200 230 1300 242 C1370 250 1410 256 1440 258 L1440 320 L0 320 Z"
				/>

				<g fill="var(--scene-tree-shade)">
					<path d="M1246 178 L1226 238 L1266 238 Z" />
					<path d="M1278 200 L1264 240 L1292 240 Z" />
				</g>

				<rect x="415" y="196" width="10" height="52" rx="3" fill="var(--scene-trunk)" />
				<g class="foliage">
					<circle cx="420" cy="178" r="34" fill="var(--scene-tree)" />
					<circle cx="394" cy="194" r="24" fill="var(--scene-tree-shade)" />
					<circle cx="448" cy="192" r="26" fill="var(--scene-tree)" />
				</g>
			</g>

			<g class="layer" style:--i="4">
				<path fill="var(--scene-ground)" d="M0 292 C300 286 600 288 720 288 C900 288 1200 286 1440 290 L1440 320 L0 320 Z" />
			</g>
			<!-- Verglas du jeu : voile glacé sur la route, avec quelques reflets. -->
			<g class="game-ice">
				<path fill="var(--scene-ice)" d="M0 292 C300 286 600 288 720 288 C900 288 1200 286 1440 290 L1440 320 L0 320 Z" />
				<path d="M80 300h46M330 306h30M560 298h52M820 304h36M1060 299h48M1290 305h34" stroke="var(--scene-snow)" stroke-width="1.5" stroke-linecap="round" />
			</g>

			<g class="game-obstacle" data-game-obstacle transform="translate(1240 289)" fill="none"
				stroke="var(--scene-bike)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
				<path class="game-rock" d="M-13 0-5-16l8 1L13 0Z" />
				<path class="game-fence" d="M-12 0v-10h24V0m-18-10v10m12-10v10" />
				<path class="game-puddle" d="M-16-2q6-6 12 0t12 0t12 0m-31-6q6-5 12 0t12 0" />
				<path class="game-cones" d="M-15 0-7-18 1 0m-12-5H9m-5 5 6-14 6 14" />
				<path class="game-gate" d="M-15 0v-22h30V0m-30-15h30" />
			</g>

			<g transform="translate(0 289)">
				<g class="rider">
					<!-- Faisceau du phare avant, dont la pointe part de la lampe. -->
					<polygon class="night beam unicycle-pose longboard-pose hoverboard-hidden" points="19,-33 100,-17 100,0" fill="url(#hero-scene-beam)" style:--unicycle-pose="matrix(1, 0, 0, 1, -5, -4.5)" style:--longboard-pose="matrix(1, 0, 0, 1, -5, -4.5)" />
					<g class="bike-frame" fill="none" stroke="var(--scene-bike)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="-20" cy="-11" r="11" />
						<circle cx="20" cy="-11" r="11" />
						<!-- Rayons : 12 par roue (6 diamètres tous les 30°), moyeu au centre. -->
						<g class="spokes" stroke-width="0.8">
							<path d="M-29.5 -11H-10.5M-28.23 -15.75L-11.77 -6.25M-24.75 -19.23L-15.25 -2.77M-20 -20.5V-1.5M-15.25 -19.23L-24.75 -2.77M-11.77 -15.75L-28.23 -6.25" />
							<circle cx="-20" cy="-11" r="1.6" fill="var(--scene-bike)" />
						</g>
						<g class="spokes" stroke-width="0.8">
							<path d="M10.5 -11H29.5M11.77 -15.75L28.23 -6.25M15.25 -19.23L24.75 -2.77M20 -20.5V-1.5M24.75 -19.23L15.25 -2.77M28.23 -15.75L11.77 -6.25" />
							<circle cx="20" cy="-11" r="1.6" fill="var(--scene-bike)" />
						</g>
						<polyline points="-20,-11 -2,-12 -8,-30 -20,-11" />
						<polyline points="-8,-30 14,-31 -2,-12" />
						<polyline points="14,-31 20,-11" />
						<polyline points="14,-31 17,-37 22,-37" />
						<line x1="-12" y1="-32" x2="-4" y2="-32" />
						<!-- Porte-bagages arrière, au-dessus de la roue : affiché seulement pendant le jeu. -->
						<g class="rack" stroke-width="1.8">
							<polyline points="-32,-25 -11,-25" />
							<line x1="-28" y1="-25" x2="-20" y2="-11" />
						</g>
					</g>
					<g class="game-unicycle" fill="none" stroke="var(--scene-bike)" stroke-width="2.5" stroke-linecap="round">
						<circle cx="0" cy="-11" r="11" />
						<path d="M0-11-5-32m-5 0h9" />
						<path class="spokes" stroke-width="0.8" d="M-10-11H10M0-21V-1M-7-18 7-4M-7-4 7-18" />
					</g>
					<!-- Longboard : planche à kicktails, trucks et roues (deux visibles de profil). -->
					<g class="game-longboard" fill="var(--scene-bike)">
						<path d="M-24.5 -8 Q-23 -5.5 -19.5 -5.5 H10.5 Q14 -5.5 15.5 -8" fill="none" stroke="var(--scene-bike)" stroke-width="2.5" stroke-linecap="round" />
						<path d="M-17 -4.5 h4 l-1 1.5 h-2 Z" />
						<path d="M4 -4.5 h4 l-1 1.5 h-2 Z" />
						<circle class="board-wheel" cx="-15" cy="-2" r="2" />
						<circle class="board-wheel" cx="6" cy="-2" r="2" />
					</g>
					<!-- Hoverboard : la même planche, plus haut, avec des réacteurs à la place des roues. -->
					<g class="game-hoverboard" fill="var(--scene-lamp)">
						<ellipse class="hover-shadow" cx="-4.5" cy="-0.5" rx="14" ry="1" fill="var(--scene-bike)" opacity="0.2" />
						<ellipse class="hover-glow" cx="-15" cy="-5" rx="3" ry="4" opacity="0.3" />
						<ellipse class="hover-glow" cx="6" cy="-5" rx="3" ry="4" opacity="0.3" />
						<ellipse cx="-15" cy="-8.5" rx="3.5" ry="1.2" />
						<ellipse cx="6" cy="-8.5" rx="3.5" ry="1.2" />
						<path d="M-24.5 -13 Q-23 -10.5 -19.5 -10.5 H10.5 Q14 -10.5 15.5 -13" fill="none" stroke="var(--scene-bike)" stroke-width="2.5" stroke-linecap="round" />
					</g>
					<rect class="game-bag game-bag-one" x="-30" y="-32.5" width="15.5" height="6.5" rx="2" fill="var(--scene-lamp)" />
					<rect class="game-bag game-bag-two" x="-29.5" y="-23" width="15" height="10.5" rx="2" fill="var(--scene-lamp)" />

					<!-- Phare avant, sur le tube de direction (allumé la nuit) ; dans la main en monocycle et en longboard. -->
					<rect class="unicycle-pose longboard-pose hoverboard-hidden" x="15.5" y="-35" width="4" height="3.4" rx="1.2" fill="var(--scene-bike)" style:--unicycle-pose="matrix(1, 0, 0, 1, -5, -4.5)" style:--longboard-pose="matrix(1, 0, 0, 1, -5, -4.5)" />
					<circle class="night unicycle-pose longboard-pose hoverboard-hidden" cx="19" cy="-33.3" r="1.7" fill="var(--scene-lamp)" style:--unicycle-pose="matrix(1, 0, 0, 1, -5, -4.5)" style:--longboard-pose="matrix(1, 0, 0, 1, -5, -4.5)" />
					<!-- Feu arrière, sur le hauban (contre la selle en monocycle, sur le casque en longboard) : visible seulement la nuit. -->
					<circle class="night unicycle-pose longboard-pose hoverboard-hidden" cx="-11" cy="-25.3" r="3.8" fill="var(--scene-rear-glow)" style:--unicycle-pose="matrix(1, 0, 0, 1, -1.5, -6.7)" style:--longboard-pose="matrix(1, 0, 0, 1, 2, -40.2)" />
					<rect class="night unicycle-pose longboard-pose hoverboard-hidden" x="-12.3" y="-26.5" width="2.6" height="2.4" rx="0.8" fill="var(--scene-rear)" style:--unicycle-pose="matrix(1, 0, 0, 1, -1.5, -6.7)" style:--longboard-pose="matrix(1, 0, 0, 1, 2, -40.2)" />
					<g fill="none" stroke="var(--scene-rider)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
						<!-- Bras qui reste sur le guidon (épaule, coude, main), derrière le buste. -->
						<polyline class="unicycle-pose longboard-pose hoverboard-pose" points="6,-50 11,-41 19,-37" style:--unicycle-pose="matrix(0.9562, 0.2923, -0.2923, 0.9562, -21.492, -9.659)" style:--longboard-pose="matrix(0.9562, 0.2923, -0.2923, 0.9562, -21.492, -9.659)" style:--hoverboard-pose="matrix(0.9562, 0.2923, -0.2923, 0.9562, -21.492, -14.659)" />
						<polyline class="longboard-hidden hoverboard-hidden" points="-8,-35 2,-24 -1,-12" />
						<polyline class="unicycle-pose longboard-pose hoverboard-pose" points="-8,-35 6,-52" style:--unicycle-pose="matrix(0.9204, -0.3908, 0.3908, 0.9204, 13.253, -5.58)" style:--longboard-pose="matrix(0.9204, -0.3908, 0.3908, 0.9204, 13.253, -5.58)" style:--hoverboard-pose="matrix(0.9204, -0.3908, 0.3908, 0.9204, 13.253, -10.58)" />
					</g>
					<!-- Jambes debout sur la planche (longboard et hoverboard), à la place de la jambe qui pédale. -->
					<g class="board-legs hoverboard-pose" fill="none" stroke="var(--scene-rider)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" style:--hoverboard-pose="matrix(1, 0, 0, 1, 0, -5)">
						<polyline points="-7.8,-34.7 -11,-21 -13,-8.5" />
						<polyline points="-7.8,-34.7 -1,-21.5 4,-8.5" />
					</g>
					<circle class="unicycle-pose longboard-pose hoverboard-pose" cx="10" cy="-60" r="6.5" fill="var(--scene-rider)" style:--unicycle-pose="matrix(0.9993, -0.035, 0.035, 0.9993, -9.092, -4.16)" style:--longboard-pose="matrix(0.9993, -0.035, 0.035, 0.9993, -9.092, -4.16)" style:--hoverboard-pose="matrix(0.9993, -0.035, 0.035, 0.9993, -9.092, -9.16)" />
					<path class="unicycle-pose longboard-pose hoverboard-pose" d="M2.4,-61 A7.7,7.7 0 0 1 17.8,-61.6 L19.5,-60.4 Z" fill="var(--scene-helmet)" style:--unicycle-pose="matrix(0.9993, -0.035, 0.035, 0.9993, -9.092, -4.16)" style:--longboard-pose="matrix(0.9993, -0.035, 0.035, 0.9993, -9.092, -4.16)" style:--hoverboard-pose="matrix(0.9993, -0.035, 0.035, 0.9993, -9.092, -9.16)" />
					<!--
						Bras qui fait coucou : même forme que le bras du guidon, avec lequel il se confond au
						repos. Il tourne à l'épaule (.wave-arm) et l'avant-bras se déplie au coude
						(.wave-forearm). Dessiné après la tête pour passer devant le casque.
					-->
					<g fill="none" stroke="var(--scene-rider)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" transform="translate(6 -50)">
						<g class="wave-arm">
							<polyline class="unicycle-pose longboard-pose hoverboard-pose" points="0,0 5,9" style:--unicycle-pose="matrix(0.9876, 0.1563, -0.1563, 0.9876, -7.694, -3.793)" style:--longboard-pose="matrix(0.9876, 0.1563, -0.1563, 0.9876, -7.694, -3.793)" style:--hoverboard-pose="matrix(0.9876, 0.1563, -0.1563, 0.9876, -7.694, -8.793)" />
							<g transform="translate(5 9)">
								<polyline class="wave-forearm unicycle-pose longboard-pose hoverboard-pose" points="0,0 8,4" style:--unicycle-pose="matrix(0.9876, 0.1563, -0.1563, 0.9876, -8.429, -2.198)" style:--longboard-pose="matrix(0.9876, 0.1563, -0.1563, 0.9876, -8.429, -2.198)" style:--hoverboard-pose="matrix(0.9876, 0.1563, -0.1563, 0.9876, -8.429, -7.198)" />
							</g>
						</g>
					</g>
				</g>
			</g>
		</svg>

		<!-- Pluie du jeu (data-game-weather='rain'), par-dessus tout le décor. -->
		<div class="weather-rain"></div>
	</div>
</div>


<style>
	/* Décor pleine largeur, derrière le contenu du hero (qui fournit --hero-scene-band). */
	.scene {
		--band: var(--hero-scene-band, 16rem);
		position: absolute;
		z-index: -1;
		top: calc(-1 * var(--spacing-8));
		bottom: 0;
		left: 50%;
		width: 100vw;
		translate: -50% 0;
		overflow: hidden;
		pointer-events: none;
	}

	@media (min-width: 40rem) {
		.scene {
			margin-left: calc(var(--dock-gutter) / -2);
		}
	}

	/*
	 * Bas de l'accueil (section Contact affichée) : le décor s'agrandit vers le vélo
	 * (`--zoom-origin`, posé par contact-bubble.ts) et le cycliste fait coucou.
	 */
	.zoom {
		position: absolute;
		inset: 0;
		transform-origin: var(--zoom-origin, 25% 100%);
	}

	@media (min-width: 40rem) {
		:global(html[data-section='contact']) .zoom {
			scale: var(--zoom-scale, 1.6);
		}
	}

	@media (min-width: 40rem) and (prefers-reduced-motion: no-preference) {
		.sky-layer {
			--depth-offset: 20px;
		}

		.sky-layer,
		.layer {
			transition: translate 900ms cubic-bezier(0.4, 0, 0.2, 1);
		}

		:global(html[data-section='contact']:not([data-reduced-motion])) :is(.sky-layer, .layer) {
			translate: 0 var(--depth-offset, 0px);
		}
	}

	/* Bras qui fait coucou : rotations autour de l'épaule et du coude (origine de leur groupe). */
	.wave-arm,
	.wave-forearm {
		transform-box: view-box;
		transform-origin: 0 0;
	}

	.sky {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to bottom,
			var(--scene-sky-top) 0%,
			var(--scene-sky-top) 20%,
			var(--scene-sky-horizon) 100%
		);
		transition:
			--scene-sky-top 900ms ease,
			--scene-sky-horizon 900ms ease;
	}

	.sky-layer,
	.land {
		position: absolute;
		left: 0;
		display: block;
		width: 100%;
	}

	.sky-layer {
		top: 0;
		height: 100%;
	}

	/* Météo du jeu : couches absentes hors partie. */
	.weather-storm,
	.weather-rain {
		position: absolute;
		inset: 0;
		display: none;
		pointer-events: none;
	}

	.weather-storm {
		background: var(--scene-storm);
	}

	/* Gouttes en traits obliques : motif répété en masque, coloré par --scene-rain. */
	.weather-rain {
		background: var(--scene-rain);
		mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cpath d='M12 4l-3 12M44 22l-3 12M70 6l-3 12M26 44l-3 12M58 54l-3 12M76 34l-3 12M8 62l-3 12' stroke='black' stroke-width='1.4' stroke-linecap='round'/%3E%3C/svg%3E");
		mask-size: 80px 80px;
	}

	:global(.hero[data-playing][data-game-weather='storm']) .weather-storm,
	:global(.hero[data-playing][data-game-weather='rain']) .weather-rain {
		display: block;
	}

	@media (prefers-reduced-motion: no-preference) {
		:global(html:not([data-reduced-motion]) .hero[data-playing]) .weather-rain {
			animation: rain-fall 900ms linear infinite;
		}
	}

	/* Un motif entier par cycle (80 px en x, 320 px en y), dans le sens des traits : pas de saut. */
	@keyframes rain-fall {
		to {
			mask-position: -80px 320px;
		}
	}

	/* Légèrement débordante pour éviter un liseré de ciel sous le sol. */
	.land {
		bottom: -2px;
		height: calc(var(--band) + 2px);
	}

	/* Hero sur une colonne : le texte occupe toute la largeur, le ciel reste uni derrière. */
	@media (max-width: 63.99rem) {
		.sky-layer {
			mask-image: linear-gradient(to bottom, transparent 50%, #000 72%);
		}
	}

	/* Jour / nuit */
	.day,
	.night {
		transition: opacity 900ms ease;
	}

	.night {
		opacity: 0;
	}

	:global(html[data-theme='dark']) .night {
		opacity: 1;
	}

	:global(html[data-theme='dark']) .day {
		opacity: 0;
	}

	.astre {
		transition:
			transform 1400ms cubic-bezier(0.45, 0, 0.25, 1),
			opacity 1400ms ease;
	}

	.moon,
	:global(html[data-theme='dark']) .sun {
		transform: translateY(190px);
		opacity: 0;
	}

	:global(html[data-theme='dark']) .moon {
		transform: none;
		opacity: 1;
	}

	/* Éléments */
	.star {
		fill: var(--scene-star);
	}

	.cloud {
		fill: var(--scene-cloud);
	}

	.bird {
		fill: none;
		stroke: var(--scene-bike);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.flock {
		transform: translate(640px, 58px);
	}

	.meteor {
		opacity: 0;
	}

	/* Position d’arrivée du cycliste, au quart du paysage (aussi le décor fixe). */
	.rider {
		transform: translateX(360px);
	}

	.game-obstacle, .game-obstacle path, .game-bag, .game-unicycle, .rack, .game-longboard, .game-hoverboard, .board-legs, .game-rails, .game-station, .game-train, .game-bonus, .game-ice, .game-bolt {
		display: none;
	}

	:global(.hero[data-playing]) .rider {
		animation: none;
		transform: translateX(var(--game-rider-x, 360px));
	}

	@media (prefers-reduced-motion: no-preference) {
		.sky-layer { --game-pan: 16px; --game-overscan: 0.08; }

		:global(html:not([data-reduced-motion]) .hero[data-playing]) :is(.sky-layer, .layer) {
			/* Élargir les plans à mesure qu’ils glissent pour garder les bords couverts. */
			transform-origin: center;
			translate: calc(-1 * var(--game-pan, 0px) * var(--game-pan-progress, 0)) 0;
			scale: calc(1 + var(--game-overscan, 0) * var(--game-pan-progress, 0)) 1;
			transition: none;
		}
	}

	:global(.hero[data-playing]) .spokes {
		animation: none;
		rotate: var(--game-wheel-angle, 0rad);
	}

	:global(.hero[data-playing]) .game-obstacle,
	:global(.hero[data-playing][data-game-rails]) :is(.game-rails, .game-station),
	:global(.hero[data-playing][data-game-train]) .game-train,
	:global(.hero[data-playing][data-game-bonus]) .game-bonus,
	:global(.hero[data-playing][data-game-weather='ice']) .game-ice,
	:global(.hero[data-playing][data-game-weather='storm'][data-game-flash]) .game-bolt,
	:global(.hero[data-playing]) .rack,
	:global(.hero[data-playing][data-game-missed='0']) .game-bag-one,
	:global(.hero[data-playing]:is([data-game-missed='0'], [data-game-missed='1'])) .game-bag-two,
	:global(.hero[data-playing][data-game-obstacle='0']) .game-rock,
	:global(.hero[data-playing][data-game-obstacle='1']) .game-fence,
	:global(.hero[data-playing][data-game-obstacle='2']) .game-puddle,
	:global(.hero[data-playing][data-game-obstacle='3']) .game-cones,
	:global(.hero[data-playing][data-game-obstacle='4']) .game-gate,
	:global(.hero[data-playing]:is([data-game-missed='3'], [data-game-missed='4'], [data-game-missed='5'])) .game-unicycle {
		display: inline;
	}

	:global(.hero[data-playing]:is([data-game-missed='3'], [data-game-missed='4'], [data-game-missed='5'])) .bike-frame {
		display: none;
	}

	/*
	 * Pose sur le monocycle : cycliste redressé, phare remonté. Chaque pièce porte sa matrice,
	 * exprimée dans le repère de son groupe parent, dans --unicycle-pose.
	 */
	:global(.hero[data-playing]:is([data-game-missed='3'], [data-game-missed='4'], [data-game-missed='5'])) .unicycle-pose {
		transform: var(--unicycle-pose);
		transform-box: view-box;
		transform-origin: 0 0;
	}

	/*
	 * Planches (longboard, puis hoverboard) : data-game-mount remplace le vélo. Chaque pièce du
	 * cycliste porte sa pose par monture (--longboard-pose, --hoverboard-pose) ; les pièces
	 * inutiles sur une planche portent la classe <monture>-hidden.
	 */
	:global(.hero[data-playing][data-game-mount='longboard']) :is(.game-longboard, .board-legs),
	:global(.hero[data-playing][data-game-mount='hoverboard']) :is(.game-hoverboard, .board-legs) {
		display: inline;
	}

	:global(.hero[data-playing][data-game-mount]) :is(.bike-frame, .game-bag, .game-unicycle),
	:global(.hero[data-playing][data-game-mount='longboard']) .longboard-hidden,
	:global(.hero[data-playing][data-game-mount='hoverboard']) .hoverboard-hidden {
		display: none;
	}

	:global(.hero[data-playing][data-game-mount='longboard']) .longboard-pose {
		transform: var(--longboard-pose);
		transform-box: view-box;
		transform-origin: 0 0;
	}

	:global(.hero[data-playing][data-game-mount='hoverboard']) .hoverboard-pose {
		transform: var(--hoverboard-pose);
		transform-box: view-box;
		transform-origin: 0 0;
	}

	.spokes,
	.foliage {
		transform-box: fill-box;
		transform-origin: center;
	}

	.foliage {
		transform-origin: 50% 100%;
	}

	/*
	 * Animations : uniquement transform et opacity. Chaque élément bouge une seule fois et
	 * s’arrête avant 5 s à la place qu’il occupe dans le décor fixe (WCAG 2.2.2).
	 */
	@media (prefers-reduced-motion: no-preference) {
		.layer {
			animation: rise 1100ms cubic-bezier(0.2, 0.7, 0.2, 1) both;
			animation-delay: calc(var(--i, 0) * 120ms);
		}

		.astre-rise {
			animation: astre-rise 1800ms cubic-bezier(0.2, 0.7, 0.2, 1) 200ms both;
		}

		.twinkle {
			animation: twinkle var(--duration) ease-in-out var(--delay) both;
		}

		.meteor {
			animation: meteor 900ms ease-in 3s both;
		}

		.cloud {
			animation: drift 4.5s cubic-bezier(0.25, 0.6, 0.3, 1) both;
		}

		.cloud-b {
			animation-name: drift-reverse;
		}

		/*
		 * Vol à vitesse constante depuis le quart droit du paysage, puis léger ralentissement
		 * sur la fin (voir @keyframes fly) ; posé avant 5 s.
		 */
		.flock {
			animation: fly 4.4s linear both;
		}

		/*
		 * Battement d’ailes par morphose du tracé, pendant le vol seulement : un nombre pair
		 * d’allers-retours finit ailes déployées. Sans support de `d` en CSS, vol plané.
		 */
		.bird {
			animation: flap 440ms ease-in-out 10 alternate;
		}

		.bird-b {
			animation-delay: -180ms;
		}

		.bird-c {
			animation-delay: -340ms;
		}

		.foliage {
			animation: sway 4.5s ease-in-out both;
		}

		/* Passage unique du cycliste, qui ralentit et s’arrête au quart avant 5 s (WCAG 2.2.2). */
		.rider,
		.spokes {
			animation: ride 4s cubic-bezier(0.25, 0.6, 0.3, 1) 400ms both;
		}

		.spokes {
			animation-name: roll;
		}

		/*
		 * Déjà jouées dans la session (retour arrière, nouvelle visite de l’accueil) :
		 * décor fixe directement (`data-scene-played`, posé avant le rendu par `index.astro`).
		 */
		:global(html[data-scene-played]) .scene * {
			animation: none;
		}

		.zoom {
			transition: scale 900ms cubic-bezier(0.4, 0, 0.2, 1);
		}

		/*
		 * Coucou, à chaque arrivée en bas de page pendant le zoom : le bras quitte le guidon
		 * (où il se confond avec l’autre bras, et reste en mouvement réduit), se lève, fait six
		 * allers-retours, puis redescend (fini en 3,3 s). Chaque étape ne s'applique qu'une fois commencée (`forwards`), la suivante prenant le relais.
		 * Plus précis que la règle des animations déjà jouées, qui ne le concerne pas.
		 */
		:global(html[data-section='contact']) .scene .wave-arm {
			animation:
				raise 450ms cubic-bezier(0.3, 0, 0.2, 1) 600ms both,
				wave 300ms ease-in-out 1050ms 6 alternate forwards,
				lower 450ms ease-in-out 2850ms forwards;
		}

		/* L'avant-bras se déplie pendant la montée et se replie à la descente. */
		:global(html[data-section='contact']) .scene .wave-forearm {
			animation:
				unfold 450ms cubic-bezier(0.3, 0, 0.2, 1) 600ms both,
				fold 450ms ease-in-out 2850ms forwards;
		}

		/* Hors écran : suspension, l’animation reprend là où elle s’était arrêtée. */
		.offscreen,
		.offscreen * {
			animation-play-state: paused;
		}
	}

	@keyframes rise {
		from {
			transform: translateY(32px);
			opacity: 0;
		}
	}

	@keyframes astre-rise {
		from {
			transform: translateY(150px);
		}
	}

	@keyframes twinkle {
		50% {
			opacity: 0.15;
		}
	}

	@keyframes meteor {
		0% {
			transform: translateX(0);
			opacity: 0;
		}

		18% {
			opacity: 1;
		}

		100% {
			transform: translateX(340px);
			opacity: 0;
		}
	}

	@keyframes drift {
		from {
			translate: -40px 0;
		}
	}

	@keyframes drift-reverse {
		from {
			translate: 40px 0;
		}
	}

	/* Arrivée par la droite jusqu’à la place de la nuée dans le décor fixe. */
	/*
	 * 80 % du temps à vitesse constante (89 % du trajet), puis une décélération dont la vitesse
	 * de départ égale celle du vol (pente initiale de la courbe : 2), pour éviter une cassure.
	 */
	@keyframes fly {
		from {
			transform: translate(1080px, 49px);
			animation-timing-function: linear;
		}

		80% {
			transform: translate(689px, 57px);
			animation-timing-function: cubic-bezier(0.2, 0.4, 0.4, 1);
		}
	}

	@keyframes flap {
		from {
			d: path('M-12 -5 Q-6 -7 0 0 Q6 -7 12 -5');
		}

		to {
			d: path('M-10 5 Q-5 -2 0 1 Q5 -2 10 5');
		}
	}

	@keyframes sway {
		25% {
			transform: rotate(-1.5deg);
		}

		75% {
			transform: rotate(1.5deg);
		}
	}

	@keyframes ride {
		from {
			transform: translateX(-140px);
		}
	}

	/* 500 px parcourus pour une roue de 69 px de circonférence : environ 7,25 tours. */
	@keyframes roll {
		from {
			transform: rotate(-2610deg);
		}
	}

	/*
	 * Bras du coucou dessiné comme le bras du guidon (0°). Levé : bras tourné à −169° à
	 * l’épaule, avant-bras déplié de 48° au coude ; il bat ensuite jusqu’à −199°.
	 * Les deux extrémités sont explicites : une extrémité omise prendrait la valeur laissée
	 * par les animations précédentes de la liste (le bras ne redescendrait pas).
	 */
	@keyframes raise {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(-169deg);
		}
	}

	@keyframes lower {
		from {
			transform: rotate(-169deg);
		}

		to {
			transform: rotate(0deg);
		}
	}

	@keyframes wave {
		from {
			transform: rotate(-169deg);
		}

		to {
			transform: rotate(-199deg);
		}
	}

	@keyframes unfold {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(48deg);
		}
	}

	@keyframes fold {
		from {
			transform: rotate(48deg);
		}

		to {
			transform: rotate(0deg);
		}
	}
</style>
