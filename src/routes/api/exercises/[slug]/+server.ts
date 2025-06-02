import { json, error as kitError } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabaseClient';

const id_user = '9844e6c1-0812-4f01-aa1b-1258abc17d65'; // Usuario fijo para testing

export const GET: RequestHandler = async ({ params }) => {
	const { slug } = params;

	const { data: exercise, error: exerciseError } = await supabase
		.from('exercises')
		.select('*')
		.ilike('name', slug)
		.single();

	if (exerciseError || !exercise) {
		throw kitError(404, 'Ejercicio no encontrado');
	}

	const { data: userRating, error: ratingError } = await supabase
		.from('ratings')
		.select('score')
		.eq('id_exercise', exercise.id)
		.eq('id_user', id_user)
		.single();

	if (ratingError && ratingError.code !== 'PGRST116') {
		throw kitError(500, 'Error al cargar puntuación del usuario');
	}

	return json({
		...exercise,
		userScore: userRating?.score ?? null
	});
};

export const POST: RequestHandler = async ({ params, request }) => {
	const { slug } = params;

	const body = await request.json();
	console.log(' Body recibido en el servidor:', body);

	const { score, id_user, id_exercise } = body;
	console.log(' Score extraído:', score);
	console.log('id_user:', id_user);
	console.log(' id_exercise:', id_exercise);

	if (typeof score !== 'number') {
		console.error('Score no válido:', score);
		throw kitError(400, 'Score inválido');
	}

	const { data: exercise, error: exerciseError } = await supabase
		.from('exercises')
		.select('id')
		.ilike('name', slug)
		.maybeSingle();

	if (exerciseError || !exercise) {
		throw kitError(404, 'Ejercicio no encontrado');
	}

	const { error } = await supabase.from('ratings').upsert(
		{
			id_user,
			id_exercise: exercise.id,
			score,
			created_at: new Date().toISOString()
		},
		{ onConflict: 'id_user,id_exercise' }
	);

	if (error) {
		throw kitError(500, 'No se pudo guardar el rating');
	}

	return json({
		exercise: {
			...exercise,
			userScore: score ?? null
		}
	});
};
