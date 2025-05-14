import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const [exercisesResponse, bodyPartsResponse] = await Promise.all([
		fetch('/api/exercises?' + url.searchParams),
		fetch('/api/body_parts')
	]);

	if (!exercisesResponse.ok || !bodyPartsResponse.ok) {
		throw new Error('Failed to fetch data');
	}

	const exercises = await exercisesResponse.json();
	const bodyParts = await bodyPartsResponse.json();
	/*  */

	return {
		exercises,
		bodyParts
	};
};
