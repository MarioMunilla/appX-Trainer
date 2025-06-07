import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabaseClient';

const RESULTS_PER_PAGE = 6;

export const GET: RequestHandler = async ({ url }) => {
	const page = Number(url.searchParams.get('p') ?? '0');
	const search = (url.searchParams.get('q') ?? '').trim();
	const group = url.searchParams.get('group');
	const difficulty = url.searchParams.get('difficulty')?.toLocaleLowerCase();
	const favorites = url.searchParams.get('favorites') === 'true';
	const id_user = url.searchParams.get('user_id') ?? null;

	console.log('Parámetros recibidos:', { page, search, group, difficulty, favorites, id_user });

	let builder = supabase.from('exercises').select('*', { count: 'exact' });

	if (search !== '') {
		builder = builder.ilike('name', `%${search}%`);
	}

	if (group && group !== 'all') {
		builder = builder.eq('body_part_id', group);
	}

	if (difficulty && difficulty !== 'all') {
		builder = builder.ilike('difficulty', difficulty);
	}

	if (favorites && id_user) {
		// Obtener favoritos del usuario
		const { data: favs } = await supabase
			.from('user_favorites')
			.select('exercise_id')
			.eq('user_id', id_user);

		const favIds = favs?.map((f) => f.exercise_id) ?? [];

		if (favIds.length === 0) {
			// No tiene favoritos, devolvemos lista vacía
			console.log('Hola?');
			return json({
				info: {
					count: 0,
					pages: 0,
					prev: null,
					next: null
				},
				results: []
			});
		}

		builder = builder.in('id', favIds);
	}

	builder = builder.range(page * RESULTS_PER_PAGE, page * RESULTS_PER_PAGE + RESULTS_PER_PAGE - 1);

	const { data, error: queryError, count } = await builder;

	if (queryError) {
		console.error('Error en consulta:', queryError);
		throw error(500, queryError.message);
	}

	let results = data ?? [];

	// Marcar favoritos en resultados si hay user
	if (id_user) {
		const { data: favs } = await supabase
			.from('user_favorites')
			.select('exercise_id')
			.eq('user_id', id_user);

		const favSet = new Set(favs?.map((f) => f.exercise_id));
		results = results.map((ex) => ({ ...ex, isFavorite: favSet.has(ex.id) }));
	}

	const totalPages = Math.ceil((count ?? 0) / RESULTS_PER_PAGE);
	const previous = page === 0 ? null : page - 1;
	const next = page >= totalPages - 1 ? null : page + 1;

	return json({
		info: {
			count,
			pages: totalPages,
			prev: previous,
			next: next
		},
		results: results
	});
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { exercise_id, user_id } = await request.json();

		if (!exercise_id || !user_id) {
			throw error(400, 'exercise_id y user_id son obligatorios');
		}

		const { data, error: insertError } = await supabase
			.from('user_favorites')
			.upsert({ exercise_id, user_id }, { onConflict: 'exercise_id, user_id' });

		if (insertError) {
			throw error(500, insertError.message);
		}

		return json({ success: true, data });
	} catch (err) {
		return json({ success: false, message: (err as Error).message }, { status: 400 });
	}
};
