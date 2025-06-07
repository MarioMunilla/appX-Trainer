import { supabase } from '$lib/supabaseClient';
import type { RequestHandler } from './$types';

type RegisterRequest = {
	email: string;
	password: string;
};

export const POST: RequestHandler = async ({ request }) => {
	const { email, password } = (await request.json()) as RegisterRequest;
	console.log(
		await supabase.auth.signUp({
			email: email,
			password: password
		})
	);

	return new Response();
};
