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
	import { invalidate, invalidateAll } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';
	export let data: PageData;

	let title: string = data.name || 'Mi rutina';
	let description: string = data.description || 'Descripción de la rutina';

	let routine_id = data.routine_id;
	let exercises = data.exercises.map((ex) => ({
		...ex,
		weight: 0
	}));
	let isSaving = false;
	let saveMessage = '';
	let saveError = false;
	let originalTitle = title; // Para comparar cambios
	let editingTitle = false;
	let editingDescription = false;
	let titleInput: HTMLInputElement | null = null;
	let descriptionInput: HTMLInputElement | null = null;
	let originalDescription = description;

	function startEditingTitle() {
		editingTitle = true;
		setTimeout(() => {
			titleInput && titleInput.focus();
		}, 0);
	}
	function startEditingDescription() {
		editingDescription = true;
		setTimeout(() => {
			descriptionInput && descriptionInput.focus();
		}, 0);
	}
	function stopEditingTitle(save = false) {
		if (save && title !== originalTitle) {
			saveRoutine();
		}
		editingTitle = false;
	}
	function stopEditingDescription(save = false) {
		if (save && description !== originalDescription) {
			saveRoutine();
		}
		editingDescription = false;
	}

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
		console.log('Guardando rutina:', { title, description, exercises });
		const res = await fetch(`/api/routines/${routine_id}`, {
			method: 'PATCH',
			headers: {
			'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name: title, description })
		});

		const data = await res.json();
		console.log('PATCH response:', res, data);

		if (!res.ok) throw new Error(data.error || 'Error al guardar');

		saveMessage = 'Rutina guardada correctamente';
		originalTitle = title;
		originalDescription = description;
		console.log('Nombre de la rutina:', title);
		await invalidate('/routine');
	}
	
</script>

<div class="routine-container">
	<div class="header">
		{#if editingTitle}
			<input
				type="text"
				bind:value={title}
				bind:this={titleInput}
				placeholder="Nombre de la rutina"
				style="margin-right:0.5rem;"
			/>
			<button aria-label="Guardar nombre" on:click={() => stopEditingTitle(true)} style="background:none;border:none;cursor:pointer;padding:0 0.5rem;">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19c-2.5-1.5-6-2-9-2V6c3 0 6.5.5 9 2 2.5-1.5 6-2 9-2v11c-3 0-6.5.5-9 2z"/></svg>
			</button>
		{:else}
			<span>{title}</span>
			<button aria-label="Editar nombre" on:click={startEditingTitle} style="background:none;border:none;cursor:pointer;padding:0 0.5rem;">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm0 0L4 19l5-1 1-5z"/></svg>
			</button>
		{/if}
	</div>
	<div class="description-edit">
		{#if editingDescription}
			<input
				type="text"
				bind:value={description}
				bind:this={descriptionInput}
				placeholder="Descripción"
				style="margin-right:0.5rem;"
			/>
			<button aria-label="Guardar descripción" on:click={() => stopEditingDescription(true)} style="background:none;border:none;cursor:pointer;padding:0 0.5rem;">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19c-2.5-1.5-6-2-9-2V6c3 0 6.5.5 9 2 2.5-1.5 6-2 9-2v11c-3 0-6.5.5-9 2z"/></svg>
			</button>
		{:else}
			<span>{description}</span>
			<button aria-label="Editar descripción" on:click={startEditingDescription} style="background:none;border:none;cursor:pointer;padding:0 0.5rem;">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm0 0L4 19l5-1 1-5z"/></svg>
			</button>
		{/if}
	</div>
	{#if saveMessage}
		<div class="alert {saveError ? 'error' : 'success'}">
			{saveMessage}
		</div>
	{/if}

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
