<script lang="ts">
	import { page } from '$app/stores';
	import SearchBar from '../../components/SearchBar.svelte';
	import type { PageData } from './$types';
	import ExerciseCard from '../../components/ExerciseCard.svelte';
	import FilterFavorites from '../../components/filter/FilterFavorites.svelte';
	import FilterEquipment from '../../components/filter/FilterEquipment.svelte';
	import FilterGroup from '../../components/filter/FilterGroup.svelte';
	import { goto } from '$app/navigation';
	import FilterDifficulty from '../../components/filter/FilterDifficulty.svelte';
	import { supabase } from '$lib/supabaseClient';

	export let data: PageData;

	let selectedDifficulty = $page.url.searchParams.get('difficulty') || 'all';
	let selectedEquipment = '';
	let showFavorites = $page.url.searchParams.get('favorites') === 'true';
	let searchTerm = '';
	let searchTermGroup = '';
	let userId: string = '9844e6c1-0812-4f01-aa1b-1258abc17d65';

	$: searchTerm = $page.url.searchParams.get('q') || '';
	$: searchTermGroup = $page.url.searchParams.get('group') || 'all';

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

	async function handleFavoritesChange(e: CustomEvent<boolean>) {
		const newValue = e.detail;
		showFavorites = newValue;
		const params = new URLSearchParams($page.url.searchParams);
		if (newValue) {
			params.set('favorites', 'true');
			params.set('user_id', userId);
		} else {
			params.delete('favorites');
			params.delete('user_id');
		}
		goto(`/exercise?${params.toString()}`);
	}

	async function handleFavoriteToggle(id: string, newState: boolean) {
		const res = await fetch('/api/exercises', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				user_id: userId,
				exercise_id: id,
				favorite: newState
			})
		});
		console.log('Respuesta fetch', res)
		if (res.ok) {
			const index = data.exercises.results.findIndex((e: { id: string; }) => e.id === id);
			if (index !== -1) {
				data.exercises.results[index].isFavorite = newState;
			}
		} else {
			console.error('Error al actualizar favorito');
		}
	}

	async function fetchNextPage() {
		const nextPage = data.exercises.info.next;
		const params = new URLSearchParams($page.url.searchParams);
		params.set('p', nextPage?.toString() ?? '0');
		const response = await fetch(`/api/exercises?${params.toString()}`);
		const jsonResponse = await response.json();
		data.exercises.info = jsonResponse.info;
		data.exercises.results = [...data.exercises.results, ...jsonResponse.results];
	}
</script>

<section class="exercise">
	<SearchBar initialQuery={searchTerm} />

	<aside class="exercise__filters">
		<h2 class="exercise__filters-title">Filters</h2>
		<FilterGroup options={data.bodyParts} onChange={handleGroupChange} selected={searchTermGroup} />
		<FilterDifficulty selected={selectedDifficulty} onChange={handleLevel} />
		<FilterEquipment on:change={(e) => (selectedEquipment = e.detail)} />
		<FilterFavorites bind:checked={showFavorites} on:change={handleFavoritesChange} />
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
					isFavorite={exercise.isFavorite ?? false}
					on:favoriteClick={(e) => handleFavoriteToggle(e.detail.id, e.detail.newState)}
				/>
			{:else}
				<p class="no-results">No se encontraron ejercicios para tu búsqueda.</p>
			{/each}
		</div>
		{#if data.exercises.info.next}
			<button on:click={fetchNextPage} class="load-more">Cargar más</button>
		{/if}
	</main>
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

	.load-more:hover {
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
	}

	@media (max-width: 600px) {
		.exercise {
			padding: 1rem;
		}

		.exercise__filters {
			padding: 1.5rem;
		}

		.exercise__filters-title {
			font-size: 1.6rem;
		}

		.load-more {
			width: 60%;
			font-size: 1.4rem;
		}
	}
</style>
