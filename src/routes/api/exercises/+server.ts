import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabaseClient';

const RESULTS_PER_PAGE = 6;

export const GET: RequestHandler = async ({ url }) => {
	const page = Number(url.searchParams.get('p') ?? '0');
	const search = (url.searchParams.get('q') ?? '').trim();
	const group = url.searchParams.get('group');
	const difficulty = url.searchParams.get('difficulty');

	let builder = supabase.from('exercises').select('*', { count: 'exact' });

	if (search !== '') {
		builder.ilike('name', `%${search}%`);
	}

	if (group && group !== 'all') {
		builder = builder.eq('body_part_id', group);
	}

	if (difficulty && difficulty !== 'all') {
		builder = builder.ilike('difficulty', difficulty);
	}

	builder = builder.range(page * RESULTS_PER_PAGE, page * RESULTS_PER_PAGE + RESULTS_PER_PAGE - 1);

	const { data, error: queryError, count } = await builder;

	if (queryError) {
		throw error(500, queryError.message);
	}

	const totalPages = Math.ceil(count! / RESULTS_PER_PAGE);
	const previous = page === 0 ? null : page - 1;
	const next = page >= totalPages - 1 ? null : page + 1;

	return json({
		info: {
			count,
			pages: totalPages,
			prev: previous,
			next: next
		},
		results: data
	});
};
