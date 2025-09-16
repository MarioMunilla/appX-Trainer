import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { supabase } from '$lib/supabaseClient'

export const load: PageServerLoad = async ({
    fetch,
    cookies,
    url,
    request
}) => {
    console.log('Request ===> ', request)
    const jwt = cookies.get('session')
    if (!jwt) throw error(401, 'No autenticado')

    const {
        data: { user },
        error: authError
    } = await supabase.auth.getUser(jwt)

    if (authError || !user) throw error(401, 'No autenticado')

    // 1. Obtener todas las rutinas del usuario
    const response = await fetch('/api/routines')
    if (!response.ok) {
        const { error: message } = await response.json()
        throw error(response.status, message || 'Error al cargar rutina')
    }
    const { routines } = await response.json()

    if (!routines || routines.length === 0) {
        return {
            routines: [],
            routine_id: null,
            name: null,
            description: null,
            exercises: [],
            user_id: user.id
        }
    }

    const requestedId = url.searchParams.get('id')
    console.log('Requested ID:', requestedId, 'Routines:', routines)

    // Encontrar la rutina específica si hay un ID en la URL
    const selectedRoutine = requestedId
        ? routines.find((r: { id: string }) => r.id === requestedId)
        : routines[0] // Si no hay ID, usar la primera (más reciente)

    if (!selectedRoutine) {
        return {
            routines,
            routine_id: null,
            name: null,
            description: null,
            exercises: [],
            user_id: user.id
        }
    }

    // 2. Obtener los detalles completos de la rutina seleccionada y sus ejercicios
    const routineRes = await fetch(`/api/routines/${selectedRoutine.id}`)
    if (!routineRes.ok) {
        const { error: message } = await routineRes.json()
        throw error(
            routineRes.status,
            message || 'Error al cargar los detalles de la rutina'
        )
    }
    const routineData = await routineRes.json()
    console.log('Routine Data ===> ', routineData)
    return {
        routines,
        routine_id: routineData.id,
        exercises: routineData.exercises,
        name: routineData.name,
        description: routineData.description,
        user_id: user.id
    }
}
