import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabaseClient';

export const GET: RequestHandler = async ({ params }) => {
	const { slug: routine_id } = params;
	console.log(routine_id);
	const { data: routine, error: routineError } = await supabase
		.from('routines')
		.select('*')
		.eq('id', routine_id)
		.single();

	if (routineError) return json({ error: routineError.message }, { status: 500 });

	const { data: exercises, error: exercisesError } = await supabase
		.from('routines_exercises')
		.select('exercises(*), repetitions, order')
		.eq('routine_id', routine_id);

	if (exercisesError) return json({ error: exercisesError.message }, { status: 500 });

	return json({
		...routine,
		exercises
	});
};

export const POST: RequestHandler = async ({ params, cookies }) => {
	const { slug: exercise_id } = params;

	const sessionCookie = cookies.get('session');
	if (!sessionCookie) return json({ error: 'No autenticado (sin cookie)' }, { status: 401 });

	const {
		data: { user },
		error: authError
	} = await supabase.auth.getUser(sessionCookie);

	if (!user || authError) return json({ error: 'No autenticado (JWT inválido)' }, { status: 401 });

	// Buscar o crear rutina "Mi rutina"
	const { data: routine, error: routineError } = await supabase
		.from('routines')
		.select('id')
		.eq('user_id', user.id)
		.eq('name', 'Mi rutina')
		.single();

	let routine_id: string;

	if (routineError?.code === 'PGRST116') {
		// No existe, crearla
		const { data: newRoutine, error: createError } = await supabase
			.from('routines')
			.insert([
				{
					user_id: user.id,
					name: 'Mi rutina',
					description: 'Rutina personalizada',
					difficulty: 'beginner'
				}
			])
			.select('id')
			.single();

		if (createError) return json({ error: createError.message }, { status: 500 });

		routine_id = newRoutine.id;
		console.log('Rutina creada con ID:', routine_id);
	} else if (routineError) {
		return json({ error: routineError.message }, { status: 500 });
	} else {
		routine_id = routine.id;
		console.log('Rutina existente con ID:', routine_id);
	}

	// Verificar si el ejercicio ya está en la rutina
	const { data: existing, error: checkError } = await supabase
		.from('routines_exercises')
		.select('*')
		.eq('routine_id', routine_id)
		.eq('exercise_id', exercise_id)
		.single();

	if (checkError && checkError.code !== 'PGRST116') {
		return json({ error: checkError.message }, { status: 500 });
	}

	if (existing) {
		return json({ success: false, message: 'El ejercicio ya está en la rutina' }, { status: 409 });
	}

	// Insertar nuevo ejercicio a la rutina
	const { error: insertError } = await supabase.from('routines_exercises').insert([
		{
			routine_id,
			exercise_id,
			repetitions: 10,
			order: 1
		}
	]);

	if (insertError) return json({ error: insertError.message }, { status: 500 });

	return json({ success: true, routine_id });
};

export const PATCH: RequestHandler = async ({ request, params, cookies }) => {
	const { slug: routine_id } = params;
	const token = cookies.get('session');

	if (!token) {
		return json({ error: 'No autenticado' }, { status: 401 });
	}

	const {
		data: { user },
		error: authError
	} = await supabase.auth.getUser(token);

	if (authError || !user) {
		return json({ error: 'No autenticado' }, { status: 401 });
	}

	// Verificar que la rutina pertenece al usuario
	const { data: routine, error: routineError } = await supabase
		.from('routines')
		.select('user_id')
		.eq('id', routine_id)
		.single();

	if (routineError) {
		return json({ error: 'Error al verificar la rutina' }, { status: 500 });
	}

	if (!routine || routine.user_id !== user.id) {
		return json({ error: 'No autorizado' }, { status: 403 });
	}

	const { name, description } = await request.json();

	const { data, error } = await supabase
		.from('routines')
		.update({ name, description })
		.eq('id', routine_id)
		.select()
		.single();

	if (error) {
		console.error('Error updating routine:', error);
		return json({ error: error.message }, { status: 500 });
	}

	return json({ success: true, data });
};
