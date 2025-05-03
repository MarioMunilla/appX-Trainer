import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    // supabase
    // const datos = fetch(...) 

    return json([
        { id: 1, name: 'Chest' },
        { id: 2, name: 'Back' },
        { id: 3, name: 'Legs' },
        { id: 4, name: 'Shoulders' },
        { id: 5, name: 'Arms' },
        { id: 6, name: 'Core' } 
    ]);
};