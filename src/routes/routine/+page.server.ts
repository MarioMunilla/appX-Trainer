// src/routes/routine/+page.server.ts
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabaseClient';

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	const jwt = cookies.get('session');
	if (!jwt) throw error(401, 'No autenticado');

	const {
		data: { user },
		error: authError
	} = await supabase.auth.getUser(jwt);

	if (authError || !user) throw error(401, 'No autenticado');

	const response = await fetch('/api/routines');

	if (!response.ok) {
		const { error: message } = await response.json();
		throw error(response.status, message || 'Error al cargar rutina');
	}

	const { id: routine_id, name, description, exercises } = await response.json();

	return {
		routine_id,
		exercises,
		name,
		description,
		user_id: user.id
	};
};
