<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	export let options: string[] = [];
	let selected = '';
	const dispatch = createEventDispatcher();

	function handleChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		selected = target.value;
		dispatch('change', selected);
		console.log(selected)
	}
</script>

<div class="filter">
	<label for="grupo">Group</label>
	<select id="grupo" on:change={handleChange} bind:value={selected}>
		<option value="">All</option>
		{#each options as option}
			<option value={option}>{option}</option>
		{/each}
	</select>
</div>
