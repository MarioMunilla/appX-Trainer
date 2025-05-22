import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabaseClient';

export const GET: RequestHandler = async ({ params }) => {
    const { slug } = params;
    
    const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        return new Response(JSON.stringify({ error: 'Ejercicio no encontrado' }), {
            status: 404
        });
    }

    return json(data);
}; 