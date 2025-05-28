import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabaseClient';

const RESULTS_PER_PAGE = 6;

export const GET: RequestHandler = async ({ url }) => {
	const page = Number(url.searchParams.get('p') ?? '0');
	const search = (url.searchParams.get('q') ?? '').trim();
	const group = url.searchParams.get('group');
	const difficulty = url.searchParams.get('difficulty');
	const favorites = url.searchParams.get('favorites') === 'true';
	const userId = url.searchParams.get('user_id');

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

	if (favorites && userId) {
		// Obtener los favoritos del usuario
		const { data: favs } = await supabase
			.from('user_favorites')
			.select('exercise_id')
			.eq('user_id', userId);
		const favIds = favs?.map(f => f.exercise_id) ?? [];
		builder = builder.in('id', favIds);
	}

	builder = builder.range(page * RESULTS_PER_PAGE, page * RESULTS_PER_PAGE + RESULTS_PER_PAGE - 1);

	const { data, error: queryError, count } = await builder;

	if (queryError) {
		throw error(500, queryError.message);
	}

	let results = data ?? [];

	if (userId) {
		// Obtener los favoritos del usuario
		const { data: favs } = await supabase
			.from('user_favorites')
			.select('exercise_id')
			.eq('user_id', userId);
		const favSet = new Set(favs?.map(f => f.exercise_id));
		results = results.map(ex => ({ ...ex, isFavorite: favSet.has(ex.id) }));
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
