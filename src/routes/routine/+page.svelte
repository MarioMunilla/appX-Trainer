<script lang="ts" context="module">
	export interface PageData {
		routine_id: string;
		exercises: any[];
		user_id: string;
	}
</script>

<script lang="ts">
	import { invalidateAll } from '$app/navigation';

	import { supabase } from '$lib/supabaseClient';

	export let data: PageData;

	let routine_id = data.routine_id;
	let title = 'Mi rutina pro!';
	let description = 'Descripción de la rutina';
	const user_id = data.user_id;
	const exercises = data.exercises;

	// Funciones para los botones (las puedes añadir aquí)
	function incrementWeight(index: number) {
		exercises[index].weight = (exercises[index].weight ?? 0) + 1;
	}

	function decrementWeight(index: number) {
		exercises[index].weight = Math.max((exercises[index].weight ?? 0) - 1, 0);
	}

	function moveUp(index: number) {
		if (index === 0) return;
		[exercises[index - 1], exercises[index]] = [exercises[index], exercises[index - 1]];
	}

	function moveDown(index: number) {
		if (index === exercises.length - 1) return;
		[exercises[index + 1], exercises[index]] = [exercises[index], exercises[index + 1]];
	}

	async function getJWT() {
		const {
			data: { session }
		} = await supabase.auth.getSession();
		return session?.access_token;
	}

	async function saveRoutine() {
		try {
			const jwt = await getJWT();
			if (!jwt) throw new Error('No autenticado');

			const res = await fetch(`/api/routines/${routine_id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${jwt}`
				},
				body: JSON.stringify({ name: title, description })
			});

			if (!res.ok) throw new Error(await res.text());
			alert('Rutina guardada');
		} catch (err) {
			console.error('Error:', err);
			alert('Error al guardar');
		}
	}
	 invalidateAll();
</script>

<!-- resto del código sin cambios -->

<div class="routine-container">
	<div class="header">
		<input type="text" bind:value={title} />
		<button on:click={saveRoutine}>💾 Guardar</button>
	</div>

	<input type="text" bind:value={description} placeholder="Descripción" />

	{#if exercises.length > 0}
		<ol>
			{#each exercises as item, index}
				<li class="exercise-item">
					<div class="exercise-header">
						<span>{item.exercises.name}</span>
						<div class="exercise-controls">
							<button on:click={() => decrementWeight(index)}>-</button>
							<span>{item.weight}</span>
							<button on:click={() => incrementWeight(index)}>+</button>
							<button on:click={() => moveUp(index)}>▲</button>
							<button on:click={() => moveDown(index)}>▼</button>
						</div>
					</div>

					{#if item.exercises.gif_url.endsWith('.gif')}
						<img src={`/exercises/${item.exercises.gif_url}`} alt={item.exercises.name} />
					{:else}
						<video autoplay loop muted playsinline>
							<source src={`/exercises/${item.exercises.gif_url}`} type="video/mp4" />
						</video>
					{/if}
				</li>
			{/each}
		</ol>
	{:else}
		<p>No tienes ejercicios en tu rutina aún.</p>
	{/if}

	<div class="footer">
		<button on:click={saveRoutine}>💾 Guardar</button>
	</div>
</div>

<style>
	.routine-container {
		max-width: 600px;
		margin: 0 auto;
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 1rem;
	}
	.header,
	.footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}
	input[type='text'] {
		width: 100%;
		padding: 0.5rem;
		margin-bottom: 1;
	}
</style>
