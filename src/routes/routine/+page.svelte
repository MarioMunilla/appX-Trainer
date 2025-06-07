<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<h1>Mi Rutina</h1>

{#if data.exercises.length > 0}
	<ul>
		{#each data.exercises as item}
			<li>{item.exercises.name}</li>
		{/each}
	</ul>
{:else}
	<p>No tienes ejercicios en tu rutina aún.</p>
{/if}
