import { supabase } from '$lib/supabaseClient';
import type { RequestHandler } from '@sveltejs/kit';

type LoginRequest = {
	email: string;
	password: string;
};

export const POST: RequestHandler = async ({ request }) => {
	const { email, password } = (await request.json()) as LoginRequest;

	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password
	});

	if (error) {
		return new Response(JSON.stringify({ error: error.message }), { status: 401 });
	}

	return new Response(JSON.stringify({ session: data.session, user: data.user }), {
		status: 200
	});
};
