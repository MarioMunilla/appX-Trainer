import { supabase } from '$lib/supabaseClient';
import { type Actions } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, cookies }) => {
		console.log('ENTRO??');
		const { jwt: accessToken } = await request.json();

		// accessToken is already a string JWT token, no JSON.parse needed
		const { data } = await supabase.auth.getUser(accessToken);
		if (!data.user) {
			// TODO: handle error properly
			return { success: false };
		}

		cookies.set('session', accessToken, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: true,
			maxAge: 60 * 60 * 24 * 7
		});

		return { success: true };
	}
} satisfies Actions;
