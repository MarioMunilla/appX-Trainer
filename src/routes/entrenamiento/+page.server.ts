import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const [exercisesResponse, bodyPartsResponse] = await Promise.all([
		fetch(`/api/exercises?${url.searchParams.toString()}`),
		fetch(`/api/body_parts`)
	]);

	if (!exercisesResponse.ok || !bodyPartsResponse.ok) {
		throw error(500, 'Fallo al cargar datos de entrenamiento');
	}

	const exercises = await exercisesResponse.json();
	const bodyParts = await bodyPartsResponse.json();
	return {
		exercises,
		bodyParts
	};
};
