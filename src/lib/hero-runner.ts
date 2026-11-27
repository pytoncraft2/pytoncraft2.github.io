/**
 * Logique du mini-jeu de la scène d’accueil (easter-egg du cycliste), sans DOM : le vélo
 * reste au quart du paysage, les obstacles arrivent par la droite et il faut sauter.
 * Unités : celles du dessin du paysage (SVG `.land`, 1440 × 320, sol à y = 289), en secondes.
 */

export type ObstacleKind = 'rock' | 'cone' | 'log';

export interface Obstacle {
	id: number;
	kind: ObstacleKind;
	/** Bord gauche, dans le repère du paysage. */
	x: number;
	width: number;
	height: number;
}

export interface RunnerState {
	/** Distance parcourue depuis le départ. */
	distance: number;
	speed: number;
	/** Hauteur des roues au-dessus du sol (0 : au sol). */
	lift: number;
	/** Vitesse verticale, positive vers le haut. */
	velocity: number;
	obstacles: Obstacle[];
	/** Distance restante avant le prochain obstacle. */
	untilNext: number;
	nextId: number;
	crashed: boolean;
}

/** Position du vélo (centre, entre les roues), comme dans le décor fixe. */
export const riderX = 360;
/** Demi-largeur du vélo, roues comprises, moins une petite tolérance. */
const riderHalfWidth = 27;
/** Tolérance verticale : frôler un obstacle ne compte pas. */
const heightTolerance = 4;

const startSpeed = 300;
const maxSpeed = 560;
/** Gain de vitesse par unité parcourue. */
const acceleration = 0.012;
const gravity = 1800;
const jumpVelocity = 560;
/** Les obstacles apparaissent juste hors du paysage, à droite. */
const spawnX = 1520;
/** Distance avant le premier obstacle : le temps de lire la consigne. */
const firstGap = 600;
/** Unités par kilomètre affiché. */
const unitsPerKilometer = 10000;

const shapes: Record<ObstacleKind, { width: number; height: number }> = {
	rock: { width: 34, height: 20 },
	cone: { width: 24, height: 32 },
	log: { width: 64, height: 18 }
};
const kinds = Object.keys(shapes) as ObstacleKind[];

export function createRunner(): RunnerState {
	return {
		distance: 0,
		speed: startSpeed,
		lift: 0,
		velocity: 0,
		obstacles: [],
		untilNext: firstGap,
		nextId: 0,
		crashed: false
	};
}

/** Saut, seulement depuis le sol. */
export function jump(state: RunnerState): void {
	if (!state.crashed && state.lift === 0) {
		state.velocity = jumpVelocity;
	}
}

/**
 * Écart avant l’obstacle suivant, proportionnel à la vitesse : toujours assez pour
 * retomber et ressauter (un saut couvre environ 0,62 s de trajet).
 */
function nextGap(speed: number, random: () => number): number {
	return speed * (1.3 + random() * 1.4);
}

function collides(state: RunnerState, obstacle: Obstacle): boolean {
	const overlaps = obstacle.x < riderX + riderHalfWidth && obstacle.x + obstacle.width > riderX - riderHalfWidth;
	return overlaps && state.lift < obstacle.height - heightTolerance;
}

/** Avance la partie de `dt` secondes. */
export function step(state: RunnerState, dt: number, random: () => number = Math.random): void {
	if (state.crashed) {
		return;
	}

	const travelled = state.speed * dt;
	state.distance += travelled;
	state.speed = Math.min(maxSpeed, startSpeed + state.distance * acceleration);

	// Saut : trajectoire balistique, retour exact au sol.
	if (state.lift > 0 || state.velocity > 0) {
		state.velocity -= gravity * dt;
		state.lift = Math.max(0, state.lift + state.velocity * dt);
		if (state.lift === 0) {
			state.velocity = 0;
		}
	}

	for (const obstacle of state.obstacles) {
		obstacle.x -= travelled;
	}
	state.obstacles = state.obstacles.filter((obstacle) => obstacle.x + obstacle.width > -40);

	state.untilNext -= travelled;
	if (state.untilNext <= 0) {
		const kind = kinds[Math.floor(random() * kinds.length)] ?? 'rock';
		state.obstacles.push({ id: state.nextId++, kind, x: spawnX, ...shapes[kind] });
		state.untilNext = nextGap(state.speed, random);
	}

	state.crashed = state.obstacles.some((obstacle) => collides(state, obstacle));
}

const kilometers = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** Distance affichée, en kilomètres (« 1,4 km »). */
export function formatDistance(distance: number): string {
	return `${kilometers.format(distance / unitsPerKilometer)} km`;
}
