<script lang="ts">
	import Filter from "./Filter.svelte";

	type FilterProps = {
        onChange?: (newValue: string) => void
	}
	
    let { onChange }: FilterProps = $props()
</script>

<Filter label='Difficulty' options={[
	{value: 'facil', text: 'Beginner'},
	{value: 'intermedio', text: 'Intermediate'},
	{value: 'dificil', text: 'Advanced'}
]} {onChange} />