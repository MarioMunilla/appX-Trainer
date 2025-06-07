import { supabase } from '$lib/supabaseClient';
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
	const user_id = url.searchParams.get('user_id') ?? '9844e6c1-0812-4f01-aa1b-1258abc17d65';

	// Obtener la rutina "Mi rutina"
	const { data: routines, error: routineError } = await supabase
		.from('user_routines')
		.select('id')
		.eq('user_id', user_id)
		.eq('name', 'Mi rutina')
		.single();

	if (routineError || !routines) {
		return json([], { status: 200 });
	}

	// Obtener ejercicios de la rutina
	const { data: exercises, error: exerciseError } = await supabase
		.from('user_routine_exercises')
		.select('exercise_id, exercises (*)')
		.eq('routine_id', routines.id);

	if (exerciseError) {
		return json({ error: 'Error loading routine exercises' }, { status: 500 });
	}

	return json(exercises);
}
