<script lang="ts">
	import Filter from './Filter.svelte'

	type FilterProps = {
		onChange?: (newValue: string) => void
		selected?: string
	}

	let { onChange, selected = 'all' }: FilterProps = $props()
</script>

<Filter
	label="Difficulty"
	options={[
		{ value: 'all', text: 'All' },
		{ value: 'beginner', text: 'Beginner' },
		{ value: 'intermediate', text: 'Intermediate' },
		{ value: 'advanced', text: 'Advanced' }
	]}
	id="difficulty"
	{onChange}
	{selected}
/>
