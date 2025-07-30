import type { ExerciseCardProps } from '../../types/Exercise'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ fetch, url, request }) => {
	const cookieHeader = request.headers.get('cookie') ?? ''

	const exercisesResponse = await fetch(`/api/exercises?${url.searchParams.toString()}`, {
		headers: {
			cookie: cookieHeader // enviamos las cookies originales del cliente
		}
	})

	const bodyPartsResponse = await fetch(`/api/body_parts`)

	if (!exercisesResponse.ok || !bodyPartsResponse.ok) {
		throw new Error('Fallo al cargar datos de exercise')
	}

	const exercises = await exercisesResponse.json() as ExerciseCardProps[]
	const bodyParts = await bodyPartsResponse.json() as string[]

	return {
		exercises,
		bodyParts
	}
}
