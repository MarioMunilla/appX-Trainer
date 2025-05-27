<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { Fetch } from '@supabase/supabase-js/dist/module/lib/types';

	let slug = '';

	type ExerciseProps = {
		name: string;
		bodyParts: string[];
		imgURL: string;
		slug: string;
	};

	let exercise: ExerciseProps | null = null;
	let error: string | null = null;

	$: slug = $page.params.slug;

	async function loadExercise() {
		try {
			const response = await fetch(`/api/exercises/${slug}`);
			if (!response.ok) {
				throw new Error('No se pudo cargar el ejercicio');
			}
			exercise = await response.json();
		} catch (e) {
			if (e instanceof Error) {
				error = e.message;
			} else {
				error = 'Ocurrió un error desconocido';
			}
			exercise = null;
		}
	}

	onMount(loadExercise);

	function goBack() {
		goto('/entrenamiento');
	}

	function addToFavorites() {
		// Implementar lógica de favoritos
	}

	function addToRoutine() {
		// Implementar lógica de rutina
	}
</script>

<section class="exercise-detail">
	<button class="back-button" on:click={goBack}>◄ Volver</button>

	{#if error}
		<p class="error">{error}</p>
	{:else if exercise}
		<div class="exercise-detail__layout">
			<div class="exercise-detail__image">
				<img src={exercise.imgURL} alt={exercise.name} />
			</div>

			<div class="exercise-detail__info">
				<h1>{exercise.name}</h1>
				<p><strong>Grupo muscular:</strong> {exercise.bodyParts.join(', ')}</p>

				<div class="exercise-detail__actions">
					<button on:click={addToFavorites}>⭐ Añadir a favoritos</button>
					<button on:click={addToRoutine}>➕ Añadir a rutina</button>
				</div>
			</div>
		</div>
	{:else}
		<p>Cargando ejercicio...</p>
	{/if}
</section>

<style>
	.exercise-detail {
		max-width: 120rem;
		margin: 0 auto;
		padding: 2rem;
	}

	.back-button {
		margin-bottom: 1rem;
		background: none;
		border: none;
		color: #007bff;
		cursor: pointer;
		font-size: 1rem;
	}

	.exercise-detail__layout {
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: 2rem;
	}

	.exercise-detail__image img {
		width: 100%;
		border-radius: 1rem;
		box-shadow: 0 0.4rem 1rem rgba(0, 0, 0, 0.1);
	}

	.exercise-detail__info h1 {
		font-size: 2rem;
		margin-bottom: 1rem;
	}

	.exercise-detail__info p {
		margin: 0.5rem 0;
	}

	.exercise-detail__actions button {
		margin-right: 1rem;
		padding: 0.6rem 1rem;
		border: none;
		border-radius: 0.4rem;
		background-color: #f0f0f0;
		cursor: pointer;
		transition: background 0.2s ease;
	}

	.exercise-detail__actions button:hover {
		background-color: #e0e0e0;
	}

	@media (max-width: 60rem) {
		.exercise-detail__layout {
			grid-template-columns: 1fr;
		}
	}

	.error {
		color: #dc3545;
		padding: 1rem;
		border-radius: 0.4rem;
		background-color: #f8d7da;
	}
</style>
