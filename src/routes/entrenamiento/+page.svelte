<script lang="ts">
	import ExerciseCard from '../../components/ExerciseCard.svelte';
	import FilterDifficulty from '../../components/filter/FilterDifficulty.svelte';
	import Filter from '../../components/filter/Filter.svelte';
	import type { PageData } from './$types';
	import MenuNavegacion from '../../components/MenuNavegacion.svelte';
	import FilterEquipment from '../../components/filter/FilterEquipment.svelte';
	import FilterFavorites from '../../components/filter/FilterFavorites.svelte';
	import FilterGroup from '../../components/filter/FilterGroup.svelte';

	export let data: PageData;
	let searchQuery = '';
	let selectedGroup = '';
	let selectedDifficulty = '';
	let selectedEquipment = '';
	let showFavorites = false;

	function handleGroupChange(group: string) {
		selectedGroup = group;
	}

	function filteredExercises() {
		return data.exercises.filter((exercise: { bodyPart: string }) => {
			if (!selectedGroup) return true;
			return exercise.bodyPart === selectedGroup;
		});
	}
</script>

<MenuNavegacion
	items={{
		'/desafio-diario': 'Desafío diario',
		'/entrenamiento': 'Entrenamiento',
		'/tienda': 'Tienda'
	}}
/>
<section class="entrenamiento">
	<div class="entrenamiento__search-bar">
		<input
			class="entrenamiento__search-input"
			type="text"
			bind:value={searchQuery}
			placeholder="🔍 Search Exercise..."
		/>
	</div>

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
					{ value: 'facil', text: 'Beginner' },
					{ value: 'intermedio', text: 'Intermediate' },
					{ value: 'dificil', text: 'Advanced' }
				]}
				onChange={(nuevoValor) => console.log(nuevoValor)}
			/>

			<FilterEquipment on:change={(e) => (selectedEquipment = e.detail)} />

			<FilterFavorites on:change={(e) => (showFavorites = e.detail)} />
		</aside>

		<main class="entrenamiento__content">
			<div class="entrenamiento__grid">
				{#each filteredExercises() as exercise}
					<ExerciseCard
						name={exercise.name}
						bodyParts={[exercise.bodyPart]}
						gif_url={exercise.gif_url}
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
</section>

<style>
	.entrenamiento {
		max-width: 120rem;
		margin: 0 auto;
		padding: 2rem;
	}
	.entrenamiento__search-bar {
		margin-bottom: 2rem;
	}
	.entrenamiento__search-input {
		width: 100%;
		padding: 1rem;
		font-size: 1.2rem;
		border: 0.1rem solid #ccc;
		border-radius: 0.6rem;
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
		grid-template-columns: repeat(5, 1fr);
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
