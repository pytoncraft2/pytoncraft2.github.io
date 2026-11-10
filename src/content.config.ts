import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Études de cas : une par fichier Markdown dans src/content/projects/.
 * Le nom du fichier donne le slug (vroum.md → /projets/vroum).
 */
const projects = defineCollection({
	loader: glob({ pattern: '*.md', base: './src/content/projects' }),
	schema: z.object({
		title: z.string(),
		/** Ordre d’affichage dans le carrousel et pour « Projet suivant ». */
		order: z.number().int(),
		meta: z.string(),
		tags: z.array(z.string()),
		description: z.string(),
		stack: z.array(z.string()),
		role: z.string(),
		year: z.string(),
		featured: z.boolean().default(true),
		/** Fichier de public/, sans base (ex. vroum.png). */
		image: z.string(),
		imageAlt: z.string()
	})
});

export const collections = { projects };
