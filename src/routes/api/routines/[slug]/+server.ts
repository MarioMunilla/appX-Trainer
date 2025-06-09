import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabaseClient';

// GET: Obtener ejercicios de una rutina específica (por ID)
export const GET: RequestHandler = async ({ params }) => {
	const { slug } = params;

	const { data, error } = await supabase
		.from('routines_exercises')
		.select(
			`
			exercise_id,
			exercises (*)
		`
		)
		.eq('routine_id', slug);

	if (error) return json({ error: error.message }, { status: 500 });

	return json(data);
};

// POST: Añadir un ejercicio a la rutina "Mi rutina" del usuario
export const POST: RequestHandler = async ({ request, params }) => {
	const routineName = 'Mi rutina';
	const exercise_id = params.slug;

	const body = await request.json();
	const user_id = body.user_id;

	// 1. Buscar o crear la rutina "Mi rutina"
	const { data, error: routineError } = await supabase
		.from('routines')
		.select('*')
		.eq('user_id', user_id)
		.eq('name', routineName)
		.single();
	let routine = data;

	if (routineError || !routine) {
		const { data: newRoutine, error: createError } = await supabase
			.from('routines')
			.insert([
				{
					user_id,
					name: routineName,
					difficulty: 'beginner',
					description: 'Rutina predeterminada'
				}
			])
			.select()
			.single();

		if (createError) return json({ error: createError.message }, { status: 500 });

		routine = newRoutine;
	}

	// 2. Verificar si ya existe ese ejercicio en la rutina
	const { data: existing } = await supabase
		.from('routines_exercises')
		.select('*')
		.eq('routine_id', routine.id)
		.eq('exercise_id', exercise_id)
		.single();

	if (!existing) {
		// 3. Insertar el ejercicio si no estaba
		const { error: insertError } = await supabase.from('routines_exercises').insert([
			{
				routine_id: routine.id,
				exercise_id,
				repetitions: 10
			}
		]);

		if (insertError) return json({ error: insertError.message }, { status: 500 });
	}

	return json({ message: 'Ejercicio añadido a la rutina' });
};
