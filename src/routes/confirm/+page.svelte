<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';

	onMount(async () => {
		// Esto es para flujo de confirmación por email
		const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);

		if (error) {
			console.error('Error al confirmar la cuenta:', error.message);
			alert('Error al confirmar tu cuenta. Intenta nuevamente.');
		} else {
			goto('/'); // Redirige si todo sale bien
		}
	});
</script>

<p>Procesando autenticación...</p>
