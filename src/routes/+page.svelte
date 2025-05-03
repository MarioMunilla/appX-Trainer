<script>
	import MenuNavegacion from '../components/MenuNavegacion.svelte';
	import { supabase } from '$lib/supabaseClient';

	export let data;

	// Llamada para verificar la conexión
	let usuarios = [];
	/**
	 * @type {string | null}
	 */
	let error = null;

	const fetchUsuarios = async () => {
		const { data, error: err } = await supabase.from('usuarios').select('*');
		if (err) {
			error = err.message;
			console.error('❌ Error al conectar con Supabase:', error);
		} else {
			usuarios = data;
			console.log('✅ Usuarios cargados desde Supabase:', usuarios);
		}
	};

	fetchUsuarios();
</script>

<MenuNavegacion
	items={{
		'/desafio-diario':'Desafío diario',
		'/entrenamiento': 'Entrenamiento',
		'/tienda': 'Tienda'
	}}
/>

{#if error}
	<p style="color: red;">Error al conectar con Supabase: {error}</p>
{:else}
	<p>Conexión exitosa. Usuarios cargados: {usuarios.length}</p>
{/if}

<slot />
