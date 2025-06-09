<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	export let data: PageData;

	let user_id = $page.url.searchParams.get('user_id');
	let title = 'Mi rutina pro!';
	let description = 'Descripción de la rutina';

	// Estado local para cada ejercicio
	let exercises = data.exercises.map((item: any, index: number) => ({
		...item,
		weight: 10 * (index + 1) // Valor inicial ficticio
	}));

	// Funciones para cambiar peso y reordenar
	function incrementWeight(index: number) {
		exercises[index].weight += 5;
	}

	function decrementWeight(index: number) {
		exercises[index].weight = Math.max(0, exercises[index].weight - 5);
	}

	function moveUp(index: number) {
		if (index > 0) {
			[exercises[index - 1], exercises[index]] = [exercises[index], exercises[index - 1]];
		}
	}

	function moveDown(index: number) {
		if (index < exercises.length - 1) {
			[exercises[index], exercises[index + 1]] = [exercises[index + 1], exercises[index]];
		}
	}
</script>


<div class="routine-container">
	<div class="header">
		<input type="text" bind:value={title} />
		<button>💾 Guardar</button>
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
		<button>💾 Guardar</button>
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

	.header, .footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	input[type="text"] {
		width: 100%;
		padding: 0.5rem;
		margin-bottom: 1rem;
		border-radius: 0.5rem;
		border: 1px solid #ccc;
	}

	.exercise-item {
		border-top: 1px solid #ccc;
		padding: 1rem 0;
		display: flex;
		flex-direction: column;
	}

	.exercise-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.exercise-controls {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	button {
		border: 1px solid #333;
		background: white;
		border-radius: 0.3rem;
		cursor: pointer;
		padding: 0.25rem 0.5rem;
	}

	video, img {
		margin-top: 0.5rem;
		width: 100%;
		max-height: 180px;
		object-fit: cover;
	}
</style>

