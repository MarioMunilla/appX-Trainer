import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabaseClient';

export const GET: RequestHandler = async ({ params }) => {
	const { slug } = params;

	const { data, error } = await supabase
		.from('user_routine_exercises')
		.select(
			`
			exercise_id,
			exercises (*)
		`
		)
		.eq('routine_id', slug);

	if (error) return json({ error: error.message }, { status: 500 });

	return json(data);
};
