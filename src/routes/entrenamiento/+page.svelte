<script lang="ts">
	import { page } from '$app/stores';
	import SearchBar from '../../components/SearchBar.svelte';
	import type { PageData } from './$types';
	import ExerciseCard from '../../components/ExerciseCard.svelte';
	import FilterFavorites from '../../components/filter/FilterFavorites.svelte';
	import FilterEquipment from '../../components/filter/FilterEquipment.svelte';
	import Filter from '../../components/filter/Filter.svelte';
	import FilterGroup from '../../components/filter/FilterGroup.svelte';
	import { goto } from '$app/navigation';

	export let data: PageData;

	let selectedDifficulty = '';
	let selectedEquipment = '';
	let showFavorites = false;
	let searchTerm = '';
	let searchTermGroup=''
	$: searchTerm = $page.url.searchParams.get('q') || '';
	$: searchTermGroup = $page.url.searchParams.get('group') || '';

	function handleGroupChange(group: string) {
		console.log('holñaaa')
		const params = new URLSearchParams($page.url.searchParams);
		
		if (group) {
			params.set('group', group);
		} else {
			params.delete('group');
		}
		goto(`/entrenamiento?${params.toString()}`);
	}

	function mapDifficulty(difficulty: string): 'beginner' | 'intermediate' | 'advanced' {
		switch (difficulty?.toLowerCase()) {
			case 'beginner':
				return 'beginner';
			case 'intermediate':
				return 'intermediate';
			case 'advanced':
				return 'advanced';
			default:
				return 'beginner';
		}
	}
</script>

<section class="entrenamiento">
	<SearchBar initialQuery={searchTerm} />

	<aside class="entrenamiento__filters">
		<h2 class="entrenamiento__filters-title">Filters</h2>

		<FilterGroup
			options={data.bodyParts.map((part: { name: any }) => part.name)}
			onChange={handleGroupChange}
		/>

		<Filter
			label="Difficulty"
			options={[
				{ value: 'beginner', text: 'Beginner' },
				{ value: 'intermediate', text: 'Intermediate' },
				{ value: 'advanced', text: 'Advanced' }
			]}
			onChange={(valor) => (selectedDifficulty = valor)}
		/>

		<FilterEquipment on:change={(e) => (selectedEquipment = e.detail)} />

		<FilterFavorites on:change={(e) => (showFavorites = e.detail)} />
	</aside>

	<main class="entrenamiento__content">
		<div class="entrenamiento__grid">
			{#each data.exercises as exercise(exercise.id)}
				<ExerciseCard
					name={exercise.name}
					bodyParts={[exercise.bodyPart]}
					gif_url={exercise.gif_url}
					difficulty={mapDifficulty(exercise.difficulty)}
				/>
			{/each}
		</div>


		<!-- <div class="entrenamiento__pagination">
			<button class="entrenamiento__page-button">1</button>
			<button class="entrenamiento__page-button">2</button>
			<button class="entrenamiento__page-button">3</button>
			<span class="entrenamiento__page-dots">...</span>
			<button class="entrenamiento__page-button">▶</button>
		</div> -->
	</main>
</section>

<style>
	.entrenamiento {
		max-width: 1280px;
		margin: 0 auto;
		padding: 2rem;
		display: grid;
		grid-template-rows: auto 1fr;
		grid-template-columns: 20rem 1fr;
		gap: 2rem;
	}

	:global(.entrenamiento > *:nth-child(1)) {
		grid-column: 1 / 3;
	}

	.entrenamiento__filters {
		background: #f9f9f9;
		padding: 1.5rem;
		border-radius: 1rem;
		box-shadow: 0 0.2rem 0.6rem rgba(0, 0, 0, 0.1);
	}
	.entrenamiento__filters-title {
		font-size: 1.6rem;
		margin-bottom: 1rem;
	}
	.entrenamiento__content {
		display: flex;
		flex-direction: column;
	}
	.entrenamiento__grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
		gap: 2rem;
	}
	.entrenamiento__pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 2rem;
		gap: 0.5rem;
	}
	.entrenamiento__page-button {
		padding: 0.6rem 1rem;
		border: none;
		border-radius: 0.4rem;
		background-color: #eee;
		font-size: 1rem;
		cursor: pointer;
		transition: background 0.2s ease;
	}
	.entrenamiento__page-button:hover {
		background-color: #ddd;
	}
	.entrenamiento__page-dots {
		font-size: 1.2rem;
	}
</style>
