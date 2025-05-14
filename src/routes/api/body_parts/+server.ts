import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { supabase } from '$lib/supabaseClient';

export const GET: RequestHandler = async () => {
	const { data } = await supabase.from('body_parts').select('*');
	return json(data);
};
