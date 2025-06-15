import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies }) => {
	const accessToken = cookies.get('access_token');

	if (!accessToken) {
		return new Response('Unauthorized', { status: 401 });
	}

	// Aquí puedes verificar o usar el token, por ejemplo con JWT, o supabase.auth.api.getUser(accessToken), etc.

	return new Response(JSON.stringify({ message: 'Access granted!' }), {
		headers: { 'Content-Type': 'application/json' }
	});
};
