import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const [exercisesResponse] = await Promise.all([
		fetch(`/api/routines?user_id=9844e6c1-0812-4f01-aa1b-1258abc17d65`)
	]);
	if (!exercisesResponse.ok) {
		throw error(500, 'Fallo al cargar datos de exercise');
	}

	const exercises = await exercisesResponse.json();
	return {
		exercises
	};
};
