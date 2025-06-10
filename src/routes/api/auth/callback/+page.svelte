<script lang="ts">
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabaseClient';
    import { page } from '$app/stores';

    onMount(async () => {
        const { error } = await supabase.auth.getSession();
        if (error) {
            console.error('Error al obtener la sesión:', error);
            // Manejar el error
        } else {
            window.location.href = '/'; // Redirigir al inicio
        }
    });
</script>

<p>Procesando autenticación...</p>