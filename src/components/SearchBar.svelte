<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	export let initialQuery = '';
	let searchQuery = initialQuery;

async function handleSubmit(event: Event) {
	event.preventDefault();
	const url = new URL(page.url);
	url.searchParams.set('q', searchQuery);
	url.searchParams.delete('p');
	await goto(url.toString());
}

</script>

<form class="search-bar" on:submit={handleSubmit}>
	<input
		class="search-input"
		type="text"
		bind:value={searchQuery}
		placeholder="Buscar ejercicio..."
	/>
	<button class="search-button" type="submit">Buscar</button>
</form>

<style>
	.search-bar {
		display: flex;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.search-input {
		flex: 1;
		padding: 1rem;
		font-size: 1.2rem;
		border: 0.1rem solid #ccc;
		border-radius: 0.6rem;
	}

	.search-button {
		padding: 1rem 1.5rem;
		font-size: 1rem;
		background-color: #1976d2;
		color: #fff;
		border: none;
		border-radius: 0.6rem;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.search-button:hover {
		background-color: #1565c0;
	}
</style>
