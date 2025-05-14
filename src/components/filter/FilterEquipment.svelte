<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	let selected = '';
	const dispatch = createEventDispatcher();

	function handleChange(event: Event) {
        const target = event.target as HTMLSelectElement
		selected = target.value;
		dispatch('change', selected);
	}
</script>

<div class="filter">
	<label for="equipo">Equipment</label>
	<select id="equipo" on:change={handleChange} bind:value={selected}>
		<option value="">All</option>
		<option value="peso corporal">Body Weight</option>
		<option value="mancuernas">Dumbbells</option>
		<option value="barra">Bar</option>
	</select>
</div>
