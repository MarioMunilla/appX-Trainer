<script lang="ts">
	export let options: string[] = [];
	export let onChange: (newValue: string) => void = () => {};

	let selected = '';

	function handleChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		selected = target.value;
		onChange(selected); 
	}
</script>

<div class="filter">
	<label for="grupo">Group</label>
	<select id="grupo" on:change={handleChange} bind:value={selected}>
		<option value="">All</option>
		{#each options as option (option)}
			<option value={option}>{option}</option>
		{/each}
	</select>
</div>

<style>

	.filter {
		display: flex;
		align-items: center;
		gap: 1rem;
		width: 100%;
		max-width: 30rem;
		margin-bottom: 1rem;
	}

	select {
		flex: 1;
		padding: 0.8rem 1rem;
		font-size: 1rem;
		border: 1px solid #ccc;
		border-radius: 0.6rem;
		background-color: #fff;
		transition: border-color 0.2s ease;
	}
</style>
