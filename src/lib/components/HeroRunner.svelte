<svelte:options namespace="svg" />

<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { on } from 'svelte/events';
	import { createRunner, formatDistance, jump, notice, step, type RunnerFrame, type Vehicle } from '#lib/hero-runner.js';

	/*
	 * Partie en cours du mini-jeu de la scène d’accueil, dessinée dans le SVG `.land` de
	 * HeroScene (chargée seulement au lancement du jeu). Le cycliste et le relief restent dans
	 * HeroScene : à chaque image, `onframe` lui transmet la hauteur du saut, la distance
	 * (parallaxe), le véhicule et le clignotement après un choc.
	 */
	let {
		surface,
		onframe,
		onend,
		onquit
	}: {
		/** Zone qui fait sauter au clic (la scène). */
		surface: HTMLElement;
		onframe: (frame: RunnerFrame) => void;
		/** Chute : distance parcourue, mise en forme (« 1,4 km »). */
		onend: (distance: string) => void;
		onquit: () => void;
	} = $props();

	const game = $state(createRunner());

	// Repères au sol qui défilent, pour donner la vitesse.
	const markSpacing = 180;
	const markCount = Math.ceil(1600 / markSpacing);
	const markOffset = $derived(game.distance % markSpacing);
	// Consigne affichée jusqu’à l’arrivée du premier obstacle, puis message à chaque changement de véhicule.
	const onward: Record<Vehicle, string> = {
		hoverboard: 'en hoverboard',
		bike: 'à vélo',
		unicycle: 'en monocycle',
		skateboard: 'en skateboard',
		walk: 'à pied'
	};
	const messages = {
		hit: (vehicle: Vehicle) => `Aïe ! On continue ${onward[vehicle]}`,
		boost: (vehicle: Vehicle) => `Super ! On repart ${onward[vehicle]}`
	};
	const hint = $derived.by(() => {
		const current = notice(game);
		if (current) {
			return messages[current](game.vehicle);
		}
		return game.distance < 900 ? 'Espace ou clic : sauter · Échap : quitter' : '';
	});

	/** Boucle de jeu : une image par rafraîchissement, à l’arrêt après la chute. */
	const run: Attachment<SVGGElement> = () => {
		let frame = 0;
		let last = 0;

		const tick = (time: number) => {
			// Pas plafonné : au retour d’un onglet masqué (rAF suspendu), pas de saut dans le temps.
			const dt = last ? Math.min((time - last) / 1000, 1 / 20) : 0;
			last = time;
			step(game, dt);
			onframe({ lift: game.lift, distance: game.distance, vehicle: game.vehicle, hurt: game.recovery > 0 });
			if (game.crashed) {
				stop();
				onend(formatDistance(game.distance));
				return;
			}
			frame = requestAnimationFrame(tick);
		};

		const offs = [
			on(document, 'keydown', (event) => {
				if (event.key === ' ' || event.key === 'ArrowUp') {
					event.preventDefault();
					jump(game);
				} else if (event.key === 'Escape') {
					stop();
					onquit();
				}
			}),
			on(surface, 'pointerdown', (event) => {
				if (event.button === 0) {
					jump(game);
				}
			})
		];

		function stop() {
			cancelAnimationFrame(frame);
			for (const off of offs.splice(0)) {
				off();
			}
		}

		frame = requestAnimationFrame(tick);
		return stop;
	};
</script>

<g class={['runner', { stopped: game.crashed }]} {@attach run}>
	{#each { length: markCount }, index (index)}
		<rect class="mark" x={index * markSpacing - markOffset} y="303" width="16" height="3" rx="1.5" />
	{/each}

	{#each game.obstacles as obstacle (obstacle.id)}
		<g transform="translate({obstacle.x} 289)">
			{#if obstacle.kind === 'rock'}
				<path fill="var(--scene-rock)" d="M2 0 C0 -8 6 -18 15 -20 C25 -21 33 -12 34 0 Z" />
				<path fill="var(--scene-rock-shade)" d="M20 -19.6 C28 -16 33 -9 34 0 L23 0 C25 -7 24 -13 20 -19.6 Z" />
			{:else if obstacle.kind === 'cone'}
				<polygon fill="var(--scene-cone)" points="3,-4 9,-32 15,-32 21,-4" />
				<polygon fill="var(--scene-cone-stripe)" points="4.7,-12 5.8,-17 18.2,-17 19.3,-12" />
				<polygon fill="var(--scene-cone-stripe)" points="6.9,-22 7.7,-26 16.3,-26 17.1,-22" />
				<rect fill="var(--scene-cone)" x="0" y="-4" width="24" height="4" rx="1" />
			{:else}
				<rect fill="var(--scene-log)" x="0" y="-18" width="64" height="18" rx="9" />
				<circle fill="var(--scene-log-end)" cx="55" cy="-9" r="8" />
				<circle fill="none" stroke="var(--scene-log)" stroke-width="1.5" cx="55" cy="-9" r="4" />
			{/if}
		</g>
	{/each}

	<!-- Piles à attraper en sautant ; elles flottent doucement. -->
	{#each game.bonuses as bonus (bonus.id)}
		<g transform="translate({bonus.x} {289 - bonus.height})">
			<g class="bonus">
				<circle r="16" fill="var(--scene-bonus-glow)" />
				<circle r="11" fill="var(--scene-bonus)" />
				<path d="M2 -7 L-4 1 L0 1 L-2 7 L4 -1 L0 -1 Z" fill="var(--scene-bonus-mark)" />
			</g>
		</g>
	{/each}

	<text class="hud distance" x="1410" y="128" text-anchor="end">{formatDistance(game.distance)}</text>
	{#if hint}
		<text class="hud hint" x="1410" y="100" text-anchor="end">{hint}</text>
	{/if}
</g>

<style>
	.bonus {
		animation: float 700ms ease-in-out infinite alternate;
	}

	/* Partie finie (bulle du score) : plus rien ne bouge. */
	.stopped .bonus {
		animation-play-state: paused;
	}

	@keyframes float {
		from {
			transform: translateY(3px);
		}

		to {
			transform: translateY(-3px);
		}
	}

	.mark {
		fill: var(--scene-mid);
	}

	.hud {
		fill: var(--text-primary);
		font-family: var(--font-heading);
		font-weight: 600;
	}

	.distance {
		font-size: 24px;
		font-variant-numeric: tabular-nums;
	}

	.hint {
		fill: var(--text-secondary);
		font-family: var(--font-sans);
		font-size: 15px;
		font-weight: 500;
	}
</style>
