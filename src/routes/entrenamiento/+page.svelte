<script lang="ts">
	import SearchBar from '../../components/SearchBar.svelte';
	import type { PageData } from './$types';
	import ExerciseCard from '../../components/ExerciseCard.svelte';
	import FilterFavorites from '../../components/filter/FilterFavorites.svelte';
	import FilterEquipment from '../../components/filter/FilterEquipment.svelte';
	import Filter from '../../components/filter/Filter.svelte';
	import FilterGroup from '../../components/filter/FilterGroup.svelte';
	import MenuNavegacion from '../../components/MenuNavegacion.svelte';

	export let data: PageData;

	let selectedGroup = '';
	let selectedDifficulty = '';
	let selectedEquipment = '';
	let showFavorites = false;

	function handleGroupChange(group: string) {
		selectedGroup = group;
	}
	function mapDifficulty(difficulty: string): 'beginner' | 'intermediate' | 'advanced' {
		switch (difficulty?.toLowerCase()) {
			case 'beginner':
			case 'beginner':
				return 'beginner';
			case 'intermediate':
			case 'intermediate':
				return 'intermediate';
			case 'advanced':
			case 'advanced':
				return 'advanced';
			default:
				return 'beginner';
		}
	}
</script>

<MenuNavegacion
	items={{
		'/desafio-diario': 'Desafío diario',
		'/entrenamiento': 'Entrenamiento',
		'/tienda': 'Tienda'
	}}
/>

<SearchBar />

<div class="entrenamiento__layout">
	<aside class="entrenamiento__filters">
		<h2 class="entrenamiento__filters-title">Filters</h2>

		<FilterGroup
			options={data.bodyParts.map((part: { name: any }) => part.name)}
			on:change={(event) => handleGroupChange(event.detail)}
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
			{#each data.exercises as exercise}
				<ExerciseCard
					name={exercise.name}
					bodyParts={[exercise.bodyPart]}
					gif_url={exercise.gif_url}
					difficulty={mapDifficulty(exercise.difficulty)}
				/>
			{/each}
		</div>

		<div class="entrenamiento__pagination">
			<button class="entrenamiento__page-button">1</button>
			<button class="entrenamiento__page-button">2</button>
			<button class="entrenamiento__page-button">3</button>
			<span class="entrenamiento__page-dots">...</span>
			<button class="entrenamiento__page-button">▶</button>
		</div>
	</main>
</div>

<style>
	.entrenamiento {
		max-width: 120rem;
		margin: 0 auto;
		padding: 2rem;
	}
	.entrenamiento__layout {
		display: grid;
		grid-template-columns: 20rem 1fr;
		gap: 2rem;
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
