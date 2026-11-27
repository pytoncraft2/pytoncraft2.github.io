/**
 * Logique du mini-jeu de la scène d’accueil (easter-egg du cycliste), sans DOM : le cycliste
 * reste au quart du paysage, les obstacles arrivent par la droite et il faut sauter. Chaque
 * obstacle touché fait descendre d’un véhicule (hoverboard → vélo → monocycle → skateboard →
 * à pied) ; à pied, c’est la chute. Une pile attrapée en sautant fait remonter d’un véhicule ;
 * le hoverboard ne s’obtient que comme ça.
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
	/** Déjà touché : ne compte plus. */
	hit: boolean;
}

/** Pile à attraper en sautant, au milieu d’un grand écart entre deux obstacles. */
export interface Bonus {
	id: number;
	/** Centre, dans le repère du paysage. */
	x: number;
	/** Hauteur du centre au-dessus du sol. */
	height: number;
}

export type Vehicle = 'hoverboard' | 'bike' | 'unicycle' | 'skateboard' | 'walk';

/**
 * Du plus rapide au plus lent : chaque obstacle touché fait passer au suivant, chaque pile au
 * précédent. La partie commence à vélo.
 */
export const vehicles: readonly Vehicle[] = ['hoverboard', 'bike', 'unicycle', 'skateboard', 'walk'];

interface Handling {
	/** Part de la vitesse de base : plus on perd de véhicules, plus on va lentement. */
	pace: number;
	/** Vitesse verticale au départ du saut. */
	jump: number;
	gravity: number;
	/** Demi-largeur au sol, moins une petite tolérance. */
	halfWidth: number;
}

/**
 * Le hoverboard est le plus rapide, saute bas mais retombe lentement ; le vélo est
 * équilibré ; le monocycle saute moins haut ; le skateboard saute court et vif ; à pied, on
 * va lentement mais on saute le plus haut.
 */
const handling: Record<Vehicle, Handling> = {
	hoverboard: { pace: 1.15, jump: 440, gravity: 1300, halfWidth: 22 },
	bike: { pace: 1, jump: 560, gravity: 1800, halfWidth: 27 },
	unicycle: { pace: 0.85, jump: 500, gravity: 1800, halfWidth: 12 },
	skateboard: { pace: 0.75, jump: 580, gravity: 2000, halfWidth: 20 },
	walk: { pace: 0.6, jump: 640, gravity: 1700, halfWidth: 10 }
};

export interface RunnerState {
	/** Distance parcourue depuis le départ. */
	distance: number;
	/** Vitesse de base, qui augmente avec la distance. */
	cruise: number;
	/** Vitesse réelle : vitesse de base × allure du véhicule. */
	speed: number;
	vehicle: Vehicle;
	/** Temps restant pendant lequel les obstacles ne comptent pas, après en avoir touché un. */
	recovery: number;
	/** Temps restant d’affichage du message, après avoir attrapé une pile. */
	boost: number;
	/** Hauteur au-dessus du sol (0 : au sol). */
	lift: number;
	/** Vitesse verticale, positive vers le haut. */
	velocity: number;
	obstacles: Obstacle[];
	bonuses: Bonus[];
	/** Distance restante avant le prochain obstacle. */
	untilNext: number;
	nextId: number;
	crashed: boolean;
}

/** Ce que la partie transmet au décor à chaque image (HeroRunner → HeroScene). */
export interface RunnerFrame {
	lift: number;
	distance: number;
	vehicle: Vehicle;
	/** Clignotement : les obstacles ne comptent pas, après un choc. */
	hurt: boolean;
}

/** Message affiché après un changement de véhicule. */
export type Notice = 'hit' | 'boost' | null;

/** Position du cycliste (centre, entre les roues du vélo), comme dans le décor fixe. */
export const riderX = 360;
/** Tolérance verticale : frôler un obstacle ne compte pas. */
const heightTolerance = 4;
/** Durée pendant laquelle les obstacles ne comptent pas après un choc (clignotement). */
export const recoveryTime = 1.2;
/** Hauteur du cycliste, casque compris, quel que soit le véhicule. */
const riderHeight = 70;
/** Pile : rayon, hauteur de son centre (il faut sauter pour l’attraper). */
const bonusRadius = 11;
const bonusHeight = 100;
/** Une pile n’apparaît qu’au milieu d’un grand écart (en secondes de trajet), une fois sur trois. */
const bonusMinGap = 2;
const bonusChance = 0.35;

const startSpeed = 300;
const maxSpeed = 560;
/** Gain de vitesse de base par unité parcourue. */
const acceleration = 0.012;
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

/** Message du moment : le dernier changement de véhicule, s’il est récent. */
export function notice(state: RunnerState): Notice {
	return state.recovery > 0 ? 'hit' : state.boost > 0 ? 'boost' : null;
}

export function createRunner(): RunnerState {
	return {
		distance: 0,
		cruise: startSpeed,
		speed: startSpeed,
		vehicle: 'bike',
		recovery: 0,
		boost: 0,
		lift: 0,
		velocity: 0,
		obstacles: [],
		bonuses: [],
		untilNext: firstGap,
		nextId: 0,
		crashed: false
	};
}

/** Saut, seulement depuis le sol. */
export function jump(state: RunnerState): void {
	if (!state.crashed && state.lift === 0) {
		state.velocity = handling[state.vehicle].jump;
	}
}

/**
 * Écart avant l’obstacle suivant, proportionnel à la vitesse réelle : toujours assez pour
 * retomber et ressauter, quel que soit le véhicule.
 */
function nextGap(speed: number, random: () => number): number {
	return speed * (1.3 + random() * 1.4);
}

function reaches(state: RunnerState, bonus: Bonus): boolean {
	const halfWidth = handling[state.vehicle].halfWidth;
	return Math.abs(bonus.x - riderX) < halfWidth + bonusRadius &&
		bonus.height - bonusRadius < state.lift + riderHeight &&
		bonus.height + bonusRadius > state.lift;
}

function collides(state: RunnerState, obstacle: Obstacle): boolean {
	const halfWidth = handling[state.vehicle].halfWidth;
	const overlaps = obstacle.x < riderX + halfWidth && obstacle.x + obstacle.width > riderX - halfWidth;
	return overlaps && state.lift < obstacle.height - heightTolerance;
}

/** Avance la partie de `dt` secondes. */
export function step(state: RunnerState, dt: number, random: () => number = Math.random): void {
	if (state.crashed) {
		return;
	}

	const travelled = state.speed * dt;
	state.distance += travelled;
	state.cruise = Math.min(maxSpeed, startSpeed + state.distance * acceleration);
	state.speed = state.cruise * handling[state.vehicle].pace;
	state.recovery = Math.max(0, state.recovery - dt);
	state.boost = Math.max(0, state.boost - dt);

	// Saut : trajectoire balistique, retour exact au sol.
	if (state.lift > 0 || state.velocity > 0) {
		state.velocity -= handling[state.vehicle].gravity * dt;
		state.lift = Math.max(0, state.lift + state.velocity * dt);
		if (state.lift === 0) {
			state.velocity = 0;
		}
	}

	for (const obstacle of state.obstacles) {
		obstacle.x -= travelled;
	}
	state.obstacles = state.obstacles.filter((obstacle) => obstacle.x + obstacle.width > -40);
	for (const bonus of state.bonuses) {
		bonus.x -= travelled;
	}

	// Pile attrapée : un véhicule de mieux (rien de plus en hoverboard).
	const caught = state.bonuses.find((bonus) => reaches(state, bonus));
	const better = vehicles[vehicles.indexOf(state.vehicle) - 1];
	if (caught && better) {
		state.vehicle = better;
		state.boost = recoveryTime;
	}
	state.bonuses = state.bonuses.filter((bonus) => bonus !== caught && bonus.x + bonusRadius > -40);

	state.untilNext -= travelled;
	if (state.untilNext <= 0) {
		const kind = kinds[Math.floor(random() * kinds.length)] ?? 'rock';
		const shape = shapes[kind];
		state.obstacles.push({ id: state.nextId++, kind, x: spawnX, ...shape, hit: false });
		state.untilNext = nextGap(state.speed, random);
		// Pile au milieu de l’écart, s’il est assez grand pour sauter trois fois de suite.
		if (state.vehicle !== 'hoverboard' && state.untilNext >= state.speed * bonusMinGap && random() < bonusChance) {
			const x = spawnX + (shape.width + state.untilNext) / 2;
			state.bonuses.push({ id: state.nextId++, x, height: bonusHeight });
		}
	}

	if (state.recovery > 0) {
		return;
	}
	const obstacle = state.obstacles.find((candidate) => !candidate.hit && collides(state, candidate));
	if (!obstacle) {
		return;
	}
	const next = vehicles[vehicles.indexOf(state.vehicle) + 1];
	if (next) {
		obstacle.hit = true;
		state.vehicle = next;
		state.recovery = recoveryTime;
		state.boost = 0;
	} else {
		state.crashed = true;
	}
}

const kilometers = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** Distance affichée, en kilomètres (« 1,4 km »). */
export function formatDistance(distance: number): string {
	return `${kilometers.format(distance / unitsPerKilometer)} km`;
}
