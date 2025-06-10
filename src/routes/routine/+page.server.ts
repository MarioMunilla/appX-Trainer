import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch(`/api/routines?user_id=9844e6c1-0812-4f01-aa1b-1258abc17d65`);

	if (!response.ok) {
		throw error(500, 'Fallo al cargar datos de exercise');
	}

	const { routine_id, exercises } = await response.json();

	return {
		routine_id,
		exercises
	};
};
