import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
	try {
		const token = cookies.get('session');
		if (!token) return json({ error: 'No autenticado' }, { status: 401 });

		const {
			data: { user },
			error
		} = await supabase.auth.getUser(token);
		if (error || !user) return json({ error: 'No autenticado' }, { status: 401 });

		const { data: routine, error: routineError } = await supabase
			.from('routines')
			.select('id,name,description')
			.eq('user_id', user.id)
			.order('created_at', { ascending: false })
			.limit(1)
			.single();

		if (routineError?.code === 'PGRST116' || !routine) {
			// No existe rutina, devolver objeto vacío
			return json({ routine_id: null, name: null, description: null, exercises: [] });
		} else if (routineError) {
			console.error('Error al buscar rutina:', routineError);
			return json(
				{
					error:
						typeof routineError === 'object' && 'message' in routineError
							? routineError.message
							: String(routineError)
				},
				{ status: 500 }
			);
		}

		const { data: exercises, error: exError } = await supabase
			.from('routines_exercises')
			.select('exercise_id, exercises(*), repetitions, order')
			.eq('routine_id', routine.id);

		if (exError) {
			console.error('Error al buscar ejercicios:', exError);
			return json({ error: exError.message }, { status: 500 });
		}

		return json({
			routine_id: routine.id,
			name: routine.name,
			description: routine.description,
			exercises
		});
	} catch (err) {
		console.error('Error inesperado en GET /api/routines:', err);
		return json({ error: 'Error inesperado en el servidor.' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, cookies }) => {
	const token = cookies.get('session');
	if (!token) return json({ error: 'No autenticado' }, { status: 401 });

	const {
		data: { user },
		error
	} = await supabase.auth.getUser(token);
	if (error || !user) return json({ error: 'No autenticado' }, { status: 401 });

	const { exercise_id } = await request.json();

	const { data: routine, error: routineError } = await supabase
		.from('routines')
		.select('id')
		.eq('user_id', user.id)
		.eq('name', 'Mi rutina')
		.single();
	/* console.log(routine); */
	let routine_id: string;

	if (routineError?.code === 'PGRST116') {
		const { data: newRoutine, error: createError } = await supabase
			.from('routines')
			.insert([{ user_id: user.id, name: 'Mi rutina', description: 'Rutina personalizada' }])
			.select('id')
			.single();
		if (createError) return json({ error: createError.message }, { status: 500 });
		routine_id = newRoutine.id;
	} else if (routineError) {
		return json({ error: routineError.message }, { status: 500 });
	} else {
		routine_id = routine.id;
	}
	const { error: insertError } = await supabase
		.from('routines_exercises')
		.insert([{ routine_id, exercise_id, repetitions: 10, order: 1 }]);
	if (insertError) return json({ error: insertError.message }, { status: 500 });

	return json({ success: true, routine_id });
};
