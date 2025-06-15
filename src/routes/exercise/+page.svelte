<script lang="ts">
	import { page } from '$app/stores';
	import SearchBar from '../../components/SearchBar.svelte';
	import type { PageData } from './$types';
	import ExerciseCard from '../../components/ExerciseCard.svelte';
	import FilterFavorites from '../../components/filter/FilterFavorites.svelte';
	import FilterGroup from '../../components/filter/FilterGroup.svelte';
	import { goto } from '$app/navigation';
	import FilterDifficulty from '../../components/filter/FilterDifficulty.svelte';

	let { data }: { data: PageData } = $props();

	let selectedDifficulty = $page.url.searchParams.get('difficulty') || 'all';
	let showFavorites = $page.url.searchParams.get('favorites') === 'true';
	let searchTerm = $page.url.searchParams.get('q') || '';
	let searchTermGroup = $page.url.searchParams.get('group') || 'all';

	let loading = false;

	function handleGroupChange(group: string) {
		const params = new URLSearchParams($page.url.searchParams);
		params.delete('p');
		group !== 'all' ? params.set('group', group) : params.delete('group');
		goto(`/exercise?${params.toString()}`);
	}

	function handleLevel(level: string) {
		selectedDifficulty = level;
		const params = new URLSearchParams($page.url.searchParams);
		params.delete('p');
		level !== 'all' ? params.set('difficulty', level) : params.delete('difficulty');
		goto(`/exercise?${params.toString()}`);
	}

	async function handleFavoritesChange(isChecked: boolean) {
		showFavorites = isChecked;
		const params = new URLSearchParams($page.url.searchParams);
		console.log(isChecked)
		if (isChecked) {
			params.set('favorites', 'true');
			// NO pasar user_id en query params
		} else {
			params.delete('favorites');
			// NO borrar user_id porque no se usa
		}
		goto(`/exercise?${params.toString()}`);
	}

	async function handleFavoriteToggle(id: string, isFavorite: boolean) {
		const res = await fetch('/api/exercises', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials:'include',
			body: JSON.stringify({
				// NO enviar user_id aquí
				exercise_id: id,
				favorite: isFavorite
			})
		});
		if (res.ok) {
			const exercise = data.exercises.results.find((e: { id: string }) => e.id === id);
			if (exercise) {
				exercise.isFavorite = isFavorite;
			}
			data = {
				...data,
				exercises: {
					info: data.exercises.info,
					results: [...data.exercises.results]
				}
			};
		} else {
			console.error('Error al actualizar favorito');
			console.error(res);
		}
	}

	async function fetchNextPage() {
		if (loading || !data.exercises.info.next) return;
		loading = true;

		const nextPage = data.exercises.info.next;
		const params = new URLSearchParams($page.url.searchParams);
		params.set('p', nextPage.toString());

		const response = await fetch(`/api/exercises?${params.toString()}`,{
			credentials:'include'
		});
		if (!response.ok) {
			loading = false;
			console.error('Error al cargar más ejercicios');
			return;
		}

		const jsonResponse = await response.json();

		data = {
			...data,
			exercises: {
				info: jsonResponse.info,
				results: [...data.exercises.results, ...jsonResponse.results]
			}
		};

		loading = false;
	}
</script>

<section class="exercise-wrapper">
	<div class="exercise">
		<SearchBar initialQuery={searchTerm} />

		<aside class="exercise__filters">
			<h2 class="exercise__filters-title">Filters</h2>
			<FilterGroup options={data.bodyParts} onChange={handleGroupChange} selected={searchTermGroup} />
			<FilterDifficulty selected={selectedDifficulty} onChange={handleLevel} />
			<FilterFavorites bind:checked={showFavorites} onchange={handleFavoritesChange} />
		</aside>

		<main class="exercise__content">
			<div class="exercise__grid">
				{#each data.exercises.results as exercise (exercise.id)}
					<ExerciseCard
						id={exercise.id}
						name={exercise.name}
						bodyParts={[exercise.bodyPart]}
						gif_url={exercise.gif_url}
						difficulty={exercise.difficulty}
						isFavorite={exercise.isFavorite}
						onFavoriteChange={(isFavorite) => handleFavoriteToggle(exercise.id, isFavorite)}
					/>
				{:else}
					<p class="no-results">No se encontraron ejercicios para tu búsqueda.</p>
				{/each}
			</div>

			{#if data.exercises.info.next}
				<button onclick={fetchNextPage} class="load-more" disabled={loading}>
					{#if loading}Cargando...
					{:else}
						Cargar más
					{/if}
				</button>
			{/if}
		</main>
	</div>
</section>

<style>

	.exercise {
		max-width: 128rem;
		margin: 0 auto;
		padding: 2rem;
		display: grid;
		grid-template-areas:
			'search search'
			'filters content';
		grid-template-columns: 1fr 3fr;
		gap: 2rem;
		box-sizing: border-box;
		background-color: #cbd5e1;

	}

	:global(.exercise > :first-child) {
		grid-area: search;
	}

	.exercise__filters {
		grid-area: filters;
		background-color: #f8f8f8;
		padding: 2rem;
		border-radius: 1.2rem;
		box-shadow: 0 0.4rem 1rem rgba(0, 0, 0, 0.1);
		border: 1px solid #dddddd;
		width: 100%;
		max-width: 100%;
		box-sizing: border-box;
		overflow: hidden;
	}

	.exercise__filters-title {
		font-size: 1.8rem;
		margin-bottom: 1.2rem;
	}

	.exercise__content {
		grid-area: content;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.exercise__grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 2rem;
		width: 100%;
	}

	.no-results {
		grid-column: 1 / -1;
		text-align: center;
		font-size: 1.6rem;
		color: #e41654;
		padding: 2rem;
	}

	.load-more {
		align-self: center;
		padding: 1rem 2rem;
		font-size: 1.6rem;
		background-color: #3b82f6;
		color: #fff;
		border: none;
		border-radius: 0.6rem;
		cursor: pointer;
		transition: background-color 0.2s ease-in-out;
	}

	.load-more:disabled {
		background-color: #94a3b8;
		cursor: not-allowed;
	}

	.load-more:hover:enabled {
		background-color: #2563eb;
	}

	@media (max-width: 1024px) {
		.exercise {
			display: flex;
			flex-direction: column;
		}

		.exercise__filters,
		.exercise__content {
			width: 100%;
		}

		.exercise__filters {
			order: -1; 
		}
	}

	@media (max-width: 600px) {
		.exercise {
			padding: 1rem;
		}

		.exercise__filters {
			padding: 1.5rem;
			margin-bottom: 1rem;
			overflow-x: hidden;
			max-width: 100%;
		}

		.exercise__filters-title {
			font-size: 1.6rem;
		}

		.load-more {
			width: 60%;
			font-size: 1.4rem;
		}
	}

	@media (max-width: 480px) {
		.exercise {
			padding: 0.75rem;
		}

		.exercise__filters {
			padding: 1rem;
			border-radius: 0.8rem;
		}

		.exercise__filters-title {
			font-size: 1.4rem;
			margin-bottom: 1rem;
		}
	}
</style>
