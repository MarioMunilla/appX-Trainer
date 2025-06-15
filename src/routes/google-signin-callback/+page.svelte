<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';
	import { onMount } from 'svelte';

onMount(async () => {
	const {
		data: { session },
		error
	} = await supabase.auth.getSession();

	if (error || !session?.access_token) {
		console.warn('⚠️ No hay sesión activa');
		return goto('/');
	}

	console.log('SESSION TOKEN:', session.access_token);

	await fetch('', {
		method: 'POST',
		body: JSON.stringify({ jwt: session.access_token }),
		credentials: 'include'
	});

	goto('/');
});

</script>
