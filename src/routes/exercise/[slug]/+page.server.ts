import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params, fetch }) => {
	const [exerciseResponse, bodyPartsResponse] = await Promise.all([
		fetch(`/api/exercises/${params.slug}`),
		fetch('/api/body_parts')
	])

	if (!exerciseResponse.ok || !bodyPartsResponse.ok) {
		throw error(500, 'Fallo al cargar datos de exercise')
	}

	const exercise = await exerciseResponse.json()
	const bodyParts = await bodyPartsResponse.json()

	return {
		exercise,
		bodyParts
	}
}
