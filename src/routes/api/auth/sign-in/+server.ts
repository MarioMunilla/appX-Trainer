import { supabase } from '$lib/supabaseClient'
import type { RequestHandler } from '@sveltejs/kit'

type LoginRequest = {
    email: string
    password: string
}

export const POST: RequestHandler = async ({ request, cookies }) => {
    const { email, password } = (await request.json()) as LoginRequest

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error || !data.session) {
        return new Response(JSON.stringify({ error: error?.message || 'Login failed' }), {
            status: 401
        })
    }

    const accessToken = data.session.access_token

    // const isDev = process.env.NODE_ENV !== 'production'

    // Set cookie para el access_token
    // const cookie = `access_token=${accessToken}; Path=/; HttpOnly; ${
    // 	isDev ? '' : 'Secure;'
    // } SameSite=Lax; Max-Age=3600`

    cookies.set('session', accessToken, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        maxAge: 60 * 60 * 24 * 7
    })
    /*
	console.log('Cookie set:', cookie);
	console.log('Acces token: ', accessToken); */
    return new Response(JSON.stringify({ user: data.user }), {
        status: 200
    })
}
