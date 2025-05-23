import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabaseClient';

const RESULTS_PER_PAGE = 6;

export const GET: RequestHandler = async ({ url }) => {
	const page = Number(url.searchParams.get('p') ?? '0');
	const search = url.searchParams.get('q') ?? '';
	const group = url.searchParams.get('group');
	const difficulty = url.searchParams.get('difficulty');

	let builder = supabase.from('exercises').select('*').ilike('name', `%${search}%`);

	if (group) {
		const { data: bodyPart, error: bodyPartError } = await supabase
			.from('body_parts')
			.select('id')
			.eq('name', group)
			.single();

		if (bodyPartError || !bodyPart) {
			throw error(400, 'Invalid group name');
		}

		builder = builder.eq('body_part_id', bodyPart.id);
	}

	if (difficulty) {
		builder = builder.ilike('difficulty', difficulty);
	}

	builder = builder.range(page * RESULTS_PER_PAGE, page * RESULTS_PER_PAGE + RESULTS_PER_PAGE - 1);

	const { data, error: queryError } = await builder;

	if (queryError) {
		throw error(500, queryError.message);
	}

	return json(data);
};
