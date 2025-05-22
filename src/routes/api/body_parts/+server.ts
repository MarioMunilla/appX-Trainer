import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabaseClient';

export const GET: RequestHandler = async ({ url }) => {
	const group = url.searchParams.get('group');

	let builder = supabase.from('body_parts').select('*');

	if (group) {
		builder = builder.eq('group', group);
	}

	const { data, error } = await builder;

	if (error) {
		return json({ error: error.message }, { status: 500 });
	}

	return json(data);
};
