import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const user_id = url.searchParams.get('user_id');

	if (!user_id) {
		return json({ error: 'Falta user_id' }, { status: 400 });
	}

	// Buscar rutina llamada "Mi rutina"
	const { data: routine, error: routineError } = await supabase
		.from('routines')
		.select('id')
		.eq('user_id', user_id)
		.eq('name', 'Mi rutina')
		.single();

	if (routineError || !routine) {
		return json([]); // Devuelve vacío si no hay rutina
	}

	// Buscar ejercicios en esa rutina
	const { data, error } = await supabase
		.from('routines_exercises')
		.select(
			`
			exercise_id,
			exercises (*)
		`
		)
		.eq('routine_id', routine.id);

	if (error) {
		return json({ error: error.message }, { status: 500 });
	}

	return json(data);
};

export const POST: RequestHandler = async ({ request }) => {
	const { user_id, exercise_id, repetitions = 10, order = 1 } = await request.json();

	// 1. Buscar o crear la rutina "Mi rutina"
	const { data: existingRoutine, error: routineError } = await supabase
		.from('routines')
		.select('id')
		.eq('user_id', user_id)
		.eq('name', 'Mi rutina')
		.single();

	let routine_id: string;

	if (routineError && routineError.code !== 'PGRST116') {
		return json({ error: 'Error retrieving routine' }, { status: 500 });
	}

	if (existingRoutine) {
		routine_id = existingRoutine.id;
	} else {
		const { data: newRoutine, error: createError } = await supabase
			.from('routines')
			.insert([
				{
					user_id,
					name: 'Mi rutina',
					description: 'Rutina personalizada'
				}
			])
			.select('id')
			.single();

		if (createError || !newRoutine) {
			return json({ error: 'Error creating routine' }, { status: 500 });
		}
		routine_id = newRoutine.id;
	}

	// 2. Insertar el ejercicio en la rutina
	const { error: insertError } = await supabase.from('routines_exercises').insert([
		{
			routine_id,
			exercise_id,
			repetitions,
			order
		}
	]);

	if (insertError) {
		return json({ error: 'Error inserting exercise to routine' }, { status: 500 });
	}

	return json({ success: true });
};
