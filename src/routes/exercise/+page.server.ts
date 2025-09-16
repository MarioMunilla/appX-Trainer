import type { PageServerLoad } from './$types'
import type { BodyPartsResponse, ExercisesResponse } from '$lib/types'

export const load: PageServerLoad = async ({ fetch, url, request }) => {
    const cookieHeader = request.headers.get('cookie') ?? ''

    const exercisesResponse = await fetch(`/api/exercises?${url.searchParams.toString()}`, {
        headers: {
            cookie: cookieHeader // enviamos las cookies originales del cliente
        }
    })

    const bodyPartsResponse = await fetch('/api/body_parts')

    if (!exercisesResponse.ok || !bodyPartsResponse.ok) {
        throw new Error('Fallo al cargar datos de exercise')
    }

    const exercises = await exercisesResponse.json() as ExercisesResponse
    const bodyParts = await bodyPartsResponse.json() as BodyPartsResponse

    return {
        exercises,
        bodyParts
    }
}
