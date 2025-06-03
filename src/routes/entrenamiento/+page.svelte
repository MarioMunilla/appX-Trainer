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
		goto(`/entrenamiento?${params.toString()}`);
	}

	function handleLevel(level: string) {
		selectedDifficulty = level;
		const params = new URLSearchParams($page.url.searchParams);
		params.delete('p');
		level !== 'all' ? params.set('difficulty', level) : params.delete('difficulty');
		goto(`/entrenamiento?${params.toString()}`);
	}

	async function handleFavoritesChange(e: CustomEvent<boolean>) {
		const newValue = e.detail;
		if (newValue && !userId) {
			const { data: userData } = await supabase.auth.getUser();
			if (userData?.user) {
				userId = userData.user.id;
			} else {
				console.warn('No se pudo obtener el userId para favoritos');
				return;
			}
		}
		showFavorites = newValue;
		const params = new URLSearchParams($page.url.searchParams);
		showFavorites && userId
			? (params.set('favorites', 'true'), params.set('user_id', userId))
			: (params.delete('favorites'), params.delete('user_id'));
		goto(`/entrenamiento?${params.toString()}`);
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

<section class="entrenamiento">
	<SearchBar initialQuery={searchTerm} />

	<aside class="entrenamiento__filters">
		<h2 class="entrenamiento__filters-title">Filters</h2>
		<FilterGroup options={data.bodyParts} onChange={handleGroupChange} selected={searchTermGroup} />
		<FilterDifficulty selected={selectedDifficulty} onChange={handleLevel} />
		<FilterEquipment on:change={(e) => (selectedEquipment = e.detail)} />
		<FilterFavorites bind:checked={showFavorites} on:change={handleFavoritesChange} />
	</aside>

	<main class="entrenamiento__content">
		<div class="entrenamiento__grid">
			{#each data.exercises.results as exercise (exercise.id)}
				<ExerciseCard
					id={exercise.id}
					name={exercise.name}
					bodyParts={[exercise.bodyPart]}
					gif_url={exercise.gif_url}
					difficulty={exercise.difficulty}
					isFavorite={exercise.isFavorite ?? false}
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
	.entrenamiento {
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

	:global(.entrenamiento > :first-child) {
		grid-area: search;
	}

	.entrenamiento__filters {
		grid-area: filters;
		background-color: #f8f8f8;
		padding: 2rem;
		border-radius: 1.2rem;
		box-shadow: 0 0.4rem 1rem rgba(0, 0, 0, 0.1);
		border: 1px solid #dddddd;
	}

	.entrenamiento__filters-title {
		font-size: 1.8rem;
		margin-bottom: 1.2rem;
	}

	.entrenamiento__content {
		grid-area: content;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.entrenamiento__grid {
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
		.entrenamiento {
			display: flex;
			flex-direction: column;
		}

		.entrenamiento__filters,
		.entrenamiento__content {
			width: 100%;
		}
	}

	@media (max-width: 600px) {
		.entrenamiento {
			padding: 1rem;
		}

		.entrenamiento__filters {
			padding: 1.5rem;
		}

		.entrenamiento__filters-title {
			font-size: 1.6rem;
		}

		.load-more {
			width: 60%;
			font-size: 1.4rem;
		}
	}
</style>
