import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabaseClient';

const RESULTS_PER_PAGE = 6;

export const GET: RequestHandler = async ({ url }) => {
	const builder = supabase.from('exercises').select('*');

	const page = url.searchParams.get('p') ?? 0;

	builder.range(
		Number(page) * RESULTS_PER_PAGE,
		Number(page) * RESULTS_PER_PAGE + RESULTS_PER_PAGE - 1
	);

	const { data } = await builder;
	return json(data);
};
