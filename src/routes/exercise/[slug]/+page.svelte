<script lang="ts">
	import { goto } from '$app/navigation'
	import { supabase } from '$lib/supabaseClient'
	import Stars from '../../../components/Stars.svelte'
	import type { PageData } from './$types'

	export let data: PageData
	const exercise = data.exercise

	let userScore = exercise.userScore ?? -1

	async function rate(score: number) {
		const res = await fetch(`/api/exercises/${exercise.name}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				score,
				id_user: '9844e6c1-0812-4f01-aa1b-1258abc17d65',
				id_exercise: exercise.id
			})
		})
		if (res.ok) {
			userScore = score
		}
	}

	function goBack() {
		goto('/exercise')
	}

	async function addToRoutine() {
		const {
			data: { user },
			error
		} = await supabase.auth.getUser()

		if (!user || error) {
			alert('Debes iniciar sesión para añadir ejercicios a tu rutina')
			return
		}
		console.log(exercise.id)
		const res = await fetch(`/api/routines/${exercise.id}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		})

		if (res.ok) {
			alert('Ejercicio añadido a tu rutina')
			goto('/routine')
		} else {
			const err = await res.json()
			alert('Error al añadir: ' + err.error)
		}
	}
</script>

<main class="exercise-detail">
	<nav class="exercise-detail__nav">
		<button class="exercise-detail__button" on:click={goBack}>◄ Volver</button>
	</nav>

	{#if exercise}
		<article class="exercise-detail__content">
			<figure class="exercise-detail__media">
				{#if exercise.gif_url.endsWith('.mp4')}
					<video autoplay loop muted playsinline class="exercise-detail__video">
						<source src={`/exercises/${exercise.gif_url}`} type="video/mp4" />
					</video>
				{:else}
					<img
						src={`/exercises/${exercise.gif_url}`}
						alt={exercise.name}
						class="exercise-detail__image"
					/>
				{/if}
				<figcaption class="exercise-detail__caption">{exercise.name}</figcaption>
			</figure>

			<section class="exercise-detail__info">
				<header class="exercise-detail__header">
					<h1 class="exercise-detail__title">{exercise.name}</h1>
				</header>

				<p class="exercise-detail__text"><strong>Descripción:</strong> {exercise.description}</p>
				<Stars rating={userScore} {rate} />

				<footer class="exercise-detail__footer">
					<button class="exercise-detail__action" on:click={addToRoutine}>➕ Añadir a rutina</button
					>
				</footer>
			</section>
		</article>
	{:else}
		<p class="exercise-detail__error">No se pudo cargar el ejercicio.</p>
	{/if}
</main>

<style>
	.exercise-detail {
		padding: 2rem;
		max-width: max-content;
		margin: 0 auto;
	}

	.exercise-detail__nav {
		margin-bottom: 2rem;
	}

	.exercise-detail__button {
		background: none;
		border: none;
		color: #007bff;
		cursor: pointer;
		font-size: 1rem;
	}

	.exercise-detail__content {
		display: grid;
		grid-template-columns: 1fr 1.5fr;
		gap: 2rem;
		align-items: flex-start;
	}

	.exercise-detail__media {
		margin: 0;
	}

	.exercise-detail__image,
	.exercise-detail__video {
		width: 100%;
		border-radius: 1rem;
		box-shadow: 0 0.4rem 1rem rgba(0, 0, 0, 0.1);
		object-fit: cover;
	}

	.exercise-detail__caption {
		margin-top: 0.5rem;
		font-size: 1rem;
		color: #666;
		text-align: center;
	}
	.exercise-detail__info {
		display: flex;
		flex-direction: column;
	}

	.exercise-detail__header {
		margin-bottom: 1rem;
	}

	.exercise-detail__title {
		font-size: 2rem;
		margin: 0;
	}

	.exercise-detail__text {
		margin: 0.5rem 0;
		line-height: 1.6;
	}

	.exercise-detail__footer {
		margin-top: 2rem;
	}

	.exercise-detail__action {
		margin-right: 1rem;
		padding: 0.6rem 1.2rem;
		border: none;
		border-radius: 0.4rem;
		background-color: #f0f0f0;
		cursor: pointer;
	}

	.exercise-detail__action:hover {
		background-color: #e0e0e0;
	}
	.exercise-detail__error {
		color: #dc3545;
		background-color: #f8d7da;
		padding: 1rem;
		border-radius: 0.4rem;
		text-align: center;
	}

	@media (max-width: 1024px) {
		.exercise-detail__content {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 600px) {
		.exercise-detail {
			padding: 1rem;
		}

		.exercise-detail__title {
			font-size: 1.6rem;
		}

		.exercise-detail__action {
			display: block;
			width: 100%;
			margin: 0.5rem 0;
		}
	}
</style>
