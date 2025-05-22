import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabaseClient';

const RESULTS_PER_PAGE = 6;

export const GET: RequestHandler = async ({ url }) => {
	const page = Number(url.searchParams.get('p') ?? '0');
	const search = url.searchParams.get('q') ?? '';
	const group = url.searchParams.get('group');
	
	// let count = obtener la cuenta con .count o investigar por alguna opción mejor

	let builder = supabase.from('exercises').select('*').ilike('name', `%${search}%`)
	builder.throwOnError()

	if (group) {
		builder = builder.eq('body_part', group);
		console.log(builder);
	}


	builder = builder.range(page * RESULTS_PER_PAGE, page * RESULTS_PER_PAGE + RESULTS_PER_PAGE - 1);

	const { data, error } = await builder;

	if (error) {
		return json({ error: error.message }, { status: 500 });
	}

	// const info = {
	// 	count,
	// 	page,

	// }
	// const results = data
	return json(data);
};
