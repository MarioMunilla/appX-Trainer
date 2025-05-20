<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	let checked = false;
	const dispatch = createEventDispatcher();

	function handleToggle(event: Event) {
        const target = event.target as  HTMLInputElement
		checked = target.checked;
		dispatch('change', checked);
	}
</script>

<div class="filter">
	<label>
		<input type="checkbox" on:change={handleToggle} bind:checked={checked} />
		Favorites
	</label>
</div>
