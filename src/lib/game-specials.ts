// Obstacles spéciaux du jeu du cycliste : un par partie, à la place d’un mot ordinaire de la route.

export type SpecialKind = 'glass';

export type Special = {
	kind: SpecialKind;
	round: number;
};

export const specialWords = {
	glass: 'verre',
	// Réparation d’une crevaison, proposée tant que le pneu est à plat.
	repair: 'rustine'
} as const;

// Initiales réservées : un mot bonus ne doit jamais commencer comme l’un de ces mots.
export const specialInitials = new Set(Object.values(specialWords).map(word => word[0]));

/**
 * Tire l’obstacle spécial d’une partie, sur l’un des mots proposés.
 */
export function pickSpecial(rounds: readonly number[], random: () => number = Math.random): Special {
	const kinds: SpecialKind[] = ['glass'];
	return {
		kind: kinds[Math.floor(random() * kinds.length)],
		round: rounds[Math.floor(random() * rounds.length)]
	};
}
