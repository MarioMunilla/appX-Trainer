<script lang="ts">
	import Filter from './Filter.svelte'

	export let options: { name: string, id: string }[] = []
	export let onChange: (newValue: string) => void = () => {}
	export let selected: string = 'all'
</script>

<Filter
	label="Group"
	options={[
		{ text: 'All', value: 'all' },
		...options.map(option => ({ text: option.name, value: option.id }))
	]}
	id="group"
	{onChange}
	{selected}
/>

<style>
</style>
