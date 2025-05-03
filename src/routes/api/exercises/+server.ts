import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    return json([
        {
            name: '3/4 sit-up', 
            bodyPart: 'Waist',
            gifUrl: 'https://v2.exercisedb.io/image/20i0TUoxwWmJ0Y'
        },
        {
            name: 'Air Bike', 
            bodyPart: 'Waist',
            gifUrl: 'https://v2.exercisedb.io/image/P4TTPY5AR8kFNs'
        }
    ]);
};