<script lang="ts">
	import Filter from "./Filter.svelte";

	type FilterProps = {
        onChange?: (newValue: string) => void
	}
	
    let { onChange }: FilterProps = $props()
</script>

<Filter label='Difficulty' options={[
	{value: 'beginner', text: 'Beginner'},
	{value: 'intermediate', text: 'Intermediate'},
	{value: 'advanced', text: 'Advanced'}
]} {onChange} />