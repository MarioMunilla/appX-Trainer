<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    export let checked = false;

    function handleToggle(event: Event) {
        checked = (event.target as HTMLInputElement).checked;
        dispatch('change', checked);
    }
</script>

<div class="filter">
    <label>
        <input 
            type="checkbox" 
            bind:checked
            on:change={handleToggle}
        />
        Favorites
    </label>
</div>

<style>
    .filter label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        font-size: 0.9rem;
    }

    .filter input[type="checkbox"] {
        width: 1.2rem;
        height: 1.2rem;
        accent-color: #3b82f6;
    }
</style>
