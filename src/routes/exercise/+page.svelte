<script lang="ts">
	import { page } from '$app/stores'
	import SearchBar from '../../components/SearchBar.svelte'
	import type { PageData } from './$types'
	import type { ExerciseRow, ExercisesResponse, BodyPartsResponse } from '$lib/types'
	import ExerciseCard from '../../components/ExerciseCard.svelte'
	import FilterFavorites from '../../components/filter/FilterFavorites.svelte'
	import FilterGroup from '../../components/filter/FilterGroup.svelte'
	import FilterDifficulty from '../../components/filter/FilterDifficulty.svelte'
	import { goto } from '$app/navigation'

	let { data }: { data: PageData } = $props()
	let exercises = $derived<ExercisesResponse['results']>(data.exercises.results)
	let pagination = $derived<ExercisesResponse['info']>(data.exercises.info)
	let bodyParts: BodyPartsResponse = data.bodyParts

	let selectedDifficulty = $state<ExerciseRow['difficulty'] | 'all'>($page.url.searchParams.get('difficulty') || 'all')
	let showFavorites = $state<boolean>($page.url.searchParams.get('favorites') === 'true')
	let searchTerm = $state<string>($page.url.searchParams.get('q') || '')
	let searchTermGroup = $state<string>($page.url.searchParams.get('group') || 'all')

	let loading = $state<boolean>(false)

	async function handleGroupChange(group: string) {
		const url = new URL($page.url)
		url.searchParams.delete('p')
		if (group !== 'all') {
			url.searchParams.set('group', group)
		} else {
			url.searchParams.delete('group')
		}
		await goto(url.pathname + '?' + url.searchParams.toString())
	}

	async function handleLevel(level: string) {
		selectedDifficulty = level
		const url = new URL($page.url)
		url.searchParams.delete('p')
		if (level !== 'all') {
			url.searchParams.set('difficulty', level)
		} else {
			url.searchParams.delete('difficulty')
		}
		await goto(url.pathname + '?' + url.searchParams.toString())
	}

	async function handleFavoritesChange(isChecked: boolean) {
		showFavorites = isChecked
		const url = new URL($page.url)
		if (isChecked) {
			url.searchParams.set('favorites', 'true')
		} else {
			url.searchParams.delete('favorites')
		}
		await goto(url.pathname + '?' + url.searchParams.toString())
	}

	async function handleFavoriteToggle(id: string, isFavorite: boolean) {
		const res = await fetch('/api/exercises', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ exercise_id: id, favorite: isFavorite })
		})
		if (res.ok) {
			const exercise = exercises.find((e: { id: ExerciseRow['id'] }) => e.id === id)
			if (exercise) {
				exercise.isFavorite = isFavorite
			}
		} else {
			console.error('Error al actualizar favorito')
			console.error(await res.json())
		}
	}

	async function fetchNextPage() {
		if (loading || !pagination.next) return
		loading = true

		const url = new URL($page.url)
		url.searchParams.set('p', pagination.next.toString())

		const response = await fetch(`/api/exercises?${url.searchParams.toString()}`, {
			credentials: 'include'
		})
		if (!response.ok) {
			loading = false
			console.error('Error al cargar más ejercicios')
			return
		}
		const { results, info } = await response.json()

		const existingIds = new Set(exercises.map(e => e.id))
		const uniqueNew = results.filter((ex: ExerciseRow) => !existingIds.has(ex.id))
		pagination = info
		exercises = [...exercises, ...uniqueNew]

		loading = false
	}
</script>

<section class="exercise-wrapper">
	<div class="exercise">
		<SearchBar initialQuery={searchTerm} />
	</div>

	<aside class="exercise__filters">
		<h2 class="exercise__filters-title">Filters</h2>
		<FilterGroup options={bodyParts} onChange={handleGroupChange} selected={searchTermGroup} />
		<FilterDifficulty selected={selectedDifficulty} onChange={handleLevel} />
		<FilterFavorites bind:checked={showFavorites} onchange={handleFavoritesChange} />
	</aside>

	<main class="exercise__content">
		<div class="exercise__grid">
			{#each exercises as exercise (exercise.id)}
				<ExerciseCard
					id={exercise.id}
					name={exercise.name}
					bodyParts={[exercise.bodyPart as string]}
					gif_url={exercise.gif_url}
					difficulty={exercise.difficulty as 'beginner' | 'intermediate' | 'advanced'}
					isFavorite={!!exercise.isFavorite}
					onFavoriteChange={isFavorite => handleFavoriteToggle(exercise.id, isFavorite)}
				/>
			{:else}
				<p class="no-results">No se encontraron ejercicios para tu búsqueda.</p>
			{/each}
		</div>

		{#if pagination.next}
			<button onclick={fetchNextPage} class="load-more" disabled={loading}>
				{#if loading}Cargando...{:else}Cargar más{/if}
			</button>
		{/if}
	</main>
</section>

<style>
	.exercise-wrapper {
		display: flex;
		flex-direction: column;
		max-width: 1366px;
		margin: 0 auto;
	}
    .exercise {
        min-width: 32rem;
        width: 100%;
        margin: 0 auto;
        padding: clamp(1rem, 2vw, 2rem);
        background-color: #cbd5e1;
        border-radius: 1rem;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        box-sizing: border-box;
    }

    .exercise__filters {
        display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 0 1rem;
		padding: 2rem;
        border-radius: 1.2rem;
        background-color: #f8f8f8;
        box-shadow: 0 0.4rem 1rem rgba(0, 0, 0, 0.1);
        border: 1px solid #dddddd;
    }

    .exercise__filters-title {
		grid-column: 1 / -1;
        font-size: 1.8rem;
        margin-bottom: 1rem;
    }

    .exercise__content {
        margin-top: 2rem;
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .exercise__grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
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
        .exercise__grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 600px) {
        .exercise {
            flex-direction: column;
        }
        .exercise__filters {
            max-width: 100%;
            margin-left: 0;
            margin-right: 0;
        }
        .exercise__grid {
            grid-template-columns: 1fr;
        }
    }
</style>
