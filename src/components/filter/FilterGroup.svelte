<script lang="ts">
	import Filter from "./Filter.svelte";

	export let options: {name: string, id: string}[] = [];
	export let onChange: (newValue: string) => void = () => {};
</script>

<Filter label='Group' options={
	options.map(option => ({text: option.name, value: option.id}))
} id="group" {onChange} />

<style>
	
</style>
