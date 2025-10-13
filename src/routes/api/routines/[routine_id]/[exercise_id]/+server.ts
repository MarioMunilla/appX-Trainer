import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { supabase } from '$lib/supabaseClient'
import type {
    RoutineExerciseUpdateBody,
    RoutineExerciseUpdateResponse,
    RoutinesExercisesRow
} from '$lib/types'

export const PATCH: RequestHandler = async ({ params, request, cookies }) => {
    const { routine_id, exercise_id } = params
    const token = cookies.get('session')

    if (!token) {
        return json({ error: 'No autenticado' }, { status: 401 })
    }

    const {
        data: { user },
        error: authError
    } = await supabase.auth.getUser(token)

    if (authError || !user) {
        return json({ error: 'No autenticado' }, { status: 401 })
    }

    const { data: routine, error: routineError } = await supabase
        .from('routines')
        .select('user_id')
        .eq('id', routine_id)
        .single()

    if (routineError) {
        return json({ error: 'Error al verificar la rutina' }, { status: 500 })
    }

    if (!routine || routine.user_id !== user.id) {
        return json({ error: 'No autorizado' }, { status: 403 })
    }

    const body: RoutineExerciseUpdateBody = await request.json()
    const { weight, repetitions, order } = body

    const { error: checkError } = await supabase
        .from('routines_exercises')
        .select('*')
        .eq('routine_id', routine_id)
        .eq('exercise_id', exercise_id)
        .single()

    if (checkError) {
        return json({ error: 'Ejercicio no encontrado en la rutina' }, { status: 404 })
    }

    const updateData: Partial<RoutinesExercisesRow> = {}
    if (weight !== undefined) {
        updateData.weight = weight
    }
    if (repetitions !== undefined) {
        updateData.repetitions = repetitions
    }
    if (order !== undefined) {
        updateData.order = order
    }
    const { data, error } = await supabase
        .from('routines_exercises')
        .update(updateData)
        .eq('routine_id', routine_id)
        .eq('exercise_id', exercise_id)
        .select()
        .single()

    if (error) {
        console.error('Error updating routine exercise:', error)
        return json({ error: error.message }, { status: 500 })
    }

    const response: RoutineExerciseUpdateResponse = { success: true, data }
    return json(response)
}

export const DELETE: RequestHandler = async ({ params, cookies }) => {
    const { routine_id, exercise_id } = params
    const token = cookies.get('session')

    if (!token) {
        return json({ error: 'No autenticado' }, { status: 401 })
    }

    const {
        data: { user },
        error: authError
    } = await supabase.auth.getUser(token)

    if (authError || !user) {
        return json({ error: 'No autenticado' }, { status: 401 })
    }
    const { data: routine, error: routineError } = await supabase
        .from('routines')
        .select('user_id')
        .eq('id', routine_id)
        .single()

    if (routineError) {
        return json({ error: 'Error al verificar la rutina' }, { status: 500 })
    }

    if (!routine || routine.user_id !== user.id) {
        return json({ error: 'No autorizado' }, { status: 403 })
    }
    const { error } = await supabase
        .from('routines_exercises')
        .delete()
        .eq('routine_id', routine_id)
        .eq('exercise_id', exercise_id)

    if (error) {
        console.error('Error deleting routine exercise:', error)
        return json({ error: error.message }, { status: 500 })
    }

    const response = { success: true }
    return json(response)
}
