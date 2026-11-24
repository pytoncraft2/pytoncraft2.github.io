// Obstacles spéciaux du jeu du cycliste : un par partie, à la place d’un mot ordinaire de la route.

export type SpecialKind = 'glass' | 'bear' | 'tree';

export type Special = {
	kind: SpecialKind;
	round: number;
};

export const specialWords = {
	glass: 'verre',
	bear: 'chut',
	// L’arbre tombé : plus long à franchir, sauf en hoverboard, qui le survole.
	tree: 'branchage',
	treeHover: 'tronc',
	// Réparation d’une crevaison, proposée tant que le pneu est à plat.
	repair: 'rustine'
} as const;

// Initiales réservées : un mot bonus ne doit jamais commencer comme l’un de ces mots.
export const specialInitials = new Set(Object.values(specialWords).map(word => word[0]));

// Délai minimal entre deux lettres devant l’ours endormi.
export const bearMinInterval = 250;

/**
 * Tire l’obstacle spécial d’une partie : l’arbre seulement pendant l’orage, sur l’un des mots proposés.
 */
export function pickSpecial(storm: boolean, rounds: readonly number[], random: () => number = Math.random): Special {
	const kinds: SpecialKind[] = storm ? ['glass', 'bear', 'tree'] : ['glass', 'bear'];
	return {
		kind: kinds[Math.floor(random() * kinds.length)],
		round: rounds[Math.floor(random() * rounds.length)]
	};
}

/**
 * Devant l’ours, une frappe est trop rapide si plusieurs lettres arrivent d’un coup (collage)
 * ou si la lettre suit la précédente de moins de bearMinInterval millisecondes.
 */
export function isTooFast(previousLetterAt: number | undefined, now: number, added: number): boolean {
	return added > 1 || (previousLetterAt !== undefined && now - previousLetterAt < bearMinInterval);
}
