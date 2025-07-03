<script lang="ts" context="module">
	export interface PageData {
		routine_id: string;
		exercises: any[];
		user_id: string;
		name: string | null;
		description: string | null;
	}
</script>

<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';

	export let data: PageData;

	let routine_id = data.routine_id;
	let title = data.name || 'Mi rutina';
	let description = data.description || 'Descripción de la rutina';
	let exercises = data.exercises.map((ex) => ({
		...ex,
		weight: 0
	}));
	let isSaving = false;
	let saveMessage = '';
	let saveError = false;
	let originalTitle = title; // Para comparar cambios

	// Funciones para los botones
	function incrementWeight(index: number) {
		exercises[index].weight = (exercises[index].weight || 0) + 1;
		exercises = [...exercises];
	}

	function decrementWeight(index: number) {
		exercises[index].weight = Math.max((exercises[index].weight || 0) - 1, 0);
		exercises = [...exercises];
	}

	function moveUp(index: number) {
		if (index === 0) return;
		[exercises[index - 1], exercises[index]] = [exercises[index], exercises[index - 1]];
		exercises = [...exercises];
	}

	function moveDown(index: number) {
		if (index === exercises.length - 1) return;
		[exercises[index + 1], exercises[index]] = [exercises[index], exercises[index + 1]];
		exercises = [...exercises];
	}


	async function saveRoutine() {
		const res = await fetch(`/api/routines/${routine_id}`, {
			method: 'PATCH',
			headers: {
			'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name: title, description })
		});

		const data = await res.json();

		if (!res.ok) throw new Error(data.error || 'Error al guardar');

		saveMessage = 'Rutina guardada correctamente';
		originalTitle = title; // Actualizar el título original
	}
	// Manejar el cambio de título
	let titleTimeout: NodeJS.Timeout;
	function handleTitleChange() {
		clearTimeout(titleTimeout);
		titleTimeout = setTimeout(saveRoutine, 1000); // Guardar después de 1 segundo sin cambios
	}
</script>

<div class="routine-container">
	<div class="header">
		<input
			type="text"
			bind:value={title}
			on:input={handleTitleChange}
			placeholder="Nombre de la rutina"
		/>
	</div>
	{#if saveMessage}
		<div class="alert {saveError ? 'error' : 'success'}">
			{saveMessage}
		</div>
	{/if}

	<input
		type="text"
		bind:value={description}
		on:input={handleTitleChange}
		placeholder="Descripción"
	/>

	{#if exercises.length > 0}
		<ol>
			{#each exercises as item, index}
				<li class="exercise-item">
					<div class="exercise-header">
						<span>{item.exercises.name}</span>
						<div class="exercise-controls">
							<button on:click={() => decrementWeight(index)}>-</button>
							<span>{item.weight || 0}</span>
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
	.alert {
		padding: 0.5rem;
		margin: 0.5rem 0;
		border-radius: 0.25rem;
		text-align: center;
	}
	.success {
		background-color: #d4edda;
		color: #155724;
		border: 1px solid #c3e6cb;
	}
	.error {
		background-color: #f8d7da;
		color: #721c24;
		border: 1px solid #f5c6cb;
	}
</style>
