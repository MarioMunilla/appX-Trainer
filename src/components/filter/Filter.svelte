<script lang="ts">
    type FilterOption = {value: string, text: string}

    type FilterProps = {
		id: string,
		label: string,
        options: FilterOption[],
        onChange?: (newValue: string) => void
	}

    let { label, options, id, onChange }: FilterProps = $props()

	let selected = $state('');
	
	function handleChange(event: Event) {
        if (!onChange) { return }

        const selectElement = event.target as HTMLSelectElement
        onChange( selectElement.value )
	}
</script>

<div class="filter">
	<label for={id}>{label}</label>
	<select id={id} onchange={handleChange} bind:value={selected}>
		{#each options as option (option.value)}
			<option value={option.value}>{option.text}</option>
		{/each}
	</select>
</div>
