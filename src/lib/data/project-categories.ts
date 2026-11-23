/** Familles de projets, dans l’ordre de la page « Tous les projets ». */
export const projectCategories = ['web', 'design', 'iot'] as const;

export type ProjectCategory = (typeof projectCategories)[number];

export const projectCategoryLabels: Record<ProjectCategory, string> = {
	web: 'Développement web',
	design: 'Conception UX/UI',
	iot: 'IoT et systèmes embarqués'
};
