<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';

	function parseHash(hash: string): Record<string, string> {
		console.log('Hash raw:', hash);
		if (!hash || hash.length < 2) return {};
		const parsed = Object.fromEntries(
			hash
				.substring(1)
				.split("&")
				.map((param) => param.split("="))
		);
		console.log('Hash parsed:', parsed);
		return parsed;
	}

	onMount(async () => {
		const hash = window.location.hash;
		console.log('Window location hash:', hash);

		const params = parseHash(hash);

		if (!params.access_token || !params.refresh_token) {
			console.warn("Token no encontrado en la URL:", params);
			alert("Token no encontrado en la URL.");
			return;
		}

		const { error } = await supabase.auth.setSession({
			access_token: params.access_token,
			refresh_token: params.refresh_token
		});

		if (error) {
			console.error("Error al confirmar la cuenta:", error.message);
			alert("Error al confirmar tu cuenta. Intenta nuevamente.");
		} else {
			console.log('Sesión establecida correctamente, redirigiendo...');
			goto("/");
		}
	});
</script>

<p>Procesando autenticación...</p>
