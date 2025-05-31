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
    import FilterDifficulty from '../../components/filter/FilterDifficulty.svelte';
    import { supabase } from '$lib/supabaseClient';
    import { onMount } from 'svelte';

    export let data: PageData;
    
    let selectedDifficulty = $page.url.searchParams.get('difficulty') || 'all';
    let selectedEquipment = '';
    let showFavorites = $page.url.searchParams.get('favorites') === 'true';
    let searchTerm = '';
    let searchTermGroup = '';
    let userId: string | null = null;
    
    $: searchTerm = $page.url.searchParams.get('q') || '';
    $: searchTermGroup = $page.url.searchParams.get('group') || 'all';

    onMount(async () => {
        const { data, error } = await supabase.auth.getUser();
        if (data?.user) {
            userId = data.user.id;
        }
    });

    function handleGroupChange(group: string) {
        const params = new URLSearchParams($page.url.searchParams);
        params.delete('p'); 

        if (group && group !== 'all') {
            params.set('group', group);
        } else {
            params.delete('group');
        }
        goto(`/entrenamiento?${params.toString()}`);
    }

    function handleLevel(level: string) {
        selectedDifficulty = level;
        const params = new URLSearchParams($page.url.searchParams);
        params.delete('p'); 

        if (level && level !== 'all') {
            params.set('difficulty', level);
        } else {
            params.delete('difficulty');
        }

        goto(`/entrenamiento?${params.toString()}`);
    }

    function handleFavoritesChange(checked: boolean) {
        showFavorites = checked;
        const params = new URLSearchParams($page.url.searchParams);
        params.delete('p'); 

        if (checked && userId) {
            params.set('favorites', 'true');
            params.set('user_id', userId);
        } else {
            params.delete('favorites');
            params.delete('user_id');
        }

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

        <FilterGroup 
            options={data.bodyParts} 
            onChange={handleGroupChange} 
            selected={searchTermGroup} 
        />
        
        <FilterDifficulty 
            selected={selectedDifficulty} 
            onChange={handleLevel} 
        />

        <FilterEquipment on:change={(e) => (selectedEquipment = e.detail)} />
        
      <!--   <FilterFavorites 
            bind:checked={showFavorites}
            on:change={handleFavoritesChange} 
        />  -->
    </aside>

    <main class="entrenamiento__content">
        <div class="entrenamiento__grid">
            {#each data.exercises.results as exercise (exercise.id)}
                <ExerciseCard
                    name={exercise.name}
                    bodyParts={[exercise.bodyPart]}
                    gif_url={exercise.gif_url}
                    difficulty={exercise.difficulty}
                />
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
		"search search"
		"filters content";
	grid-template-columns: 1fr 3fr;
	gap: 2rem;
}

:global(.entrenamiento > :first-child) {
	grid-area: search;
}

.entrenamiento__filters {
	grid-area: filters;
	background-color:#7e7979;
	padding: 2rem;
	border-radius: 1.2rem;
	box-shadow: 0 0.4rem 1.2rem rgba(0, 0, 0, 0.05);
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
	grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
	gap: 2rem;
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
		grid-template-columns: 1fr;
		grid-template-areas:
			"search"
			"filters"
			"content";
	}
}

@media (max-width: 600px) {
	.entrenamiento {
		padding: 0.5rem;
	}

	.entrenamiento__filters {
		padding: 1.5rem;
	}

	.entrenamiento__filters-title {
		font-size: 1.6rem;
	}

	.load-more {
		width: 50%;
        padding: auto 0 0 1em;
		font-size: 1.4rem;
	}
}
</style>