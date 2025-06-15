import { supabase } from '$lib/supabaseClient';
import type { RequestHandler } from '@sveltejs/kit';

type LoginRequest = {
	email: string;
	password: string;
};

export const POST: RequestHandler = async ({ request }) => {
	const { email, password } = (await request.json()) as LoginRequest;

	const { data, error } = await supabase.auth.signInWithPassword({ email, password });

	if (error || !data.session) {
		return new Response(JSON.stringify({ error: error?.message || 'Login failed' }), {
			status: 401
		});
	}

	const accessToken = data.session.access_token;

	const isDev = process.env.NODE_ENV !== 'production';

	// Set cookie para el access_token
	const cookie = `access_token=${accessToken}; Path=/; HttpOnly; ${
		isDev ? '' : 'Secure;'
	} SameSite=Lax; Max-Age=3600`;
	/* 
	console.log('Cookie set:', cookie);
	console.log('Acces token: ', accessToken); */
	return new Response(JSON.stringify({ user: data.user }), {
		status: 200,
		headers: {
			'Set-Cookie': cookie,
			'Content-Type': 'application/json'
		}
	});
};
