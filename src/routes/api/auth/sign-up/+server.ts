import { supabase } from '$lib/supabaseClient';
import type { RequestHandler } from './$types';

type RegisterRequest = {
	email: string;
	password: string;
};

export const POST: RequestHandler = async ({ request }) => {
	const { email, password } = (await request.json()) as RegisterRequest;

	const { data, error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			emailRedirectTo: 'http://localhost:5173/confirm'
		}
	});

	if (error) {
		const message =
			error.status === 400 && error.message.includes('already registered')
				? 'This account is already registered'
				: error.message;

		return new Response(JSON.stringify({ error: message }), { status: 400 });
	}

	if (data.user?.identities?.length === 0) {
		return new Response(JSON.stringify({ error: 'This account is already registered' }), {
			status: 400
		});
	}

	return new Response(JSON.stringify({ user: data.user }), { status: 200 });
};
