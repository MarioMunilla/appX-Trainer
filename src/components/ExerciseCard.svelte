<script lang="ts">
	import HeartIcon from '$lib/components/HeartIcon.svelte';
	import { createEventDispatcher } from 'svelte';

	type ExerciseCardProps = {
		id: string;
		name: string;
		bodyParts: string[];
		gif_url: string;
		difficulty: 'beginner' | 'intermediate' | 'advanced';
		isFavorite: boolean;
	};

	let {id, name, gif_url, difficulty, isFavorite }: ExerciseCardProps = $props();

	const isGif = gif_url?.endsWith('.gif') ?? false;
	let isFavoriteLocal = $state(isFavorite);

	let userId = '9844e6c1-0812-4f01-aa1b-1258abc17d65';

	let element: HTMLElement;
	const dispatch = createEventDispatcher();
	async function handleHeartClick(event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();

		const newFavoriteState = !isFavoriteLocal;
		console.log(newFavoriteState);
		const res = await fetch('/api/exercises', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				user_id: userId,
				exercise_id: id,
				favorite: newFavoriteState
			})
		});

		if (res.ok) {
			isFavoriteLocal = newFavoriteState;
			console.log(isFavoriteLocal)
			dispatch('update');
		}
	}
</script>

<a
	bind:this={element}
	class="exercise-card exercise-card--{difficulty}"
	href={`/entrenamiento/${name}`}
>
	<button
		type="button"
		class="heart-button"
		onclick={handleHeartClick}
		aria-label={isFavoriteLocal ? 'Quitar de favoritos' : 'Marcar como favorito'}
	>
		<HeartIcon filled={isFavoriteLocal} />
	</button>

	{#if isGif}
		<img class="exercise-card__image" src={`/exercises/${gif_url}`} alt={name} />
	{:else}
		<video class="exercise-card__image" autoplay loop muted playsinline>
			<source src={`/exercises/${gif_url}`} type="video/mp4" />
		</video>
	{/if}

	<div class="exercise-card__content">
		<h2 class="exercise-card__title">{name}</h2>
	</div>
</a>

<style>
	.exercise-card {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #ffffff;
		border-radius: 1rem;
		box-shadow: 0 0.4rem 1rem rgba(7, 7, 7, 0.818);
		overflow: hidden;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
		width: 100%;
		text-decoration: none;
		color: inherit;
	}
	.heart-button {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		z-index: 10;
		cursor: pointer;
		background: none;
		border: none;
		padding: 0;
	}
	.exercise-card__image {
		width: 100%;
		height: 12.5rem;
		object-fit: cover;
	}

	.exercise-card__content {
		padding: 1rem;
		text-align: center;
		width: 100%;
	}

	.exercise-card__title {
		font-size: 1.6rem;
		font-weight: 600;
		color: #333;
		margin: 0.5rem 0;
	}

	.exercise-card--advanced:hover {
		box-shadow: 0 0.8rem 2rem rgba(211, 47, 47, 0.7);
	}

	.exercise-card--intermediate:hover {
		box-shadow: 0 0.8rem 2rem rgba(255, 152, 0, 0.7);
	}

	.exercise-card--beginner:hover {
		box-shadow: 0 0.8rem 2rem rgba(119, 210, 122, 0.7);
	}

	@media (min-width: 48rem) {
		.exercise-card__image {
			height: 15rem;
		}
	}

	@media (min-width: 64rem) {
		.exercise-card__image {
			height: 18rem;
		}
	}

	@media (max-width: 32rem) {
		.exercise-card__image {
			height: 10rem;
		}
	}

	.exercise-card-container {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
		gap: 1.5rem;
		margin-top: 2rem;
	}

	@media (min-width: 48rem) {
		.exercise-card-container {
			grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
		}
	}

	@media (min-width: 64rem) {
		.exercise-card-container {
			grid-template-columns: repeat(auto-fit, minmax(25rem, 1fr));
		}
	}
</style>
