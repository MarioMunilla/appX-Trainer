<script>
	import MenuNavegacion from '../components/MenuNavegacion.svelte';
	import { supabase } from '$lib/supabaseClient';

	export let data;



</script>

<MenuNavegacion
	items={{
		'/desafio-diario':'Desafío diario',
		'/entrenamiento': 'Entrenamiento',
		'/tienda': 'Tienda'
	}}
/>

<slot />