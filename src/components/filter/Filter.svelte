<script lang="ts">
	type FilterOption = { value: string, text: string }

	type FilterProps = {
		id: string
		label: string
		options: FilterOption[]
		selected?: string
		onChange?: (newValue: string) => void
	}

	let { label, options, id, selected = '', onChange }: FilterProps = $props()

	function handleChange(event: Event) {
		if (!onChange) return
		const selectElement = event.target as HTMLSelectElement
		onChange(selectElement.value)
	}
</script>

<div class="filter">
	<label for={id} class="filter__label">{label}</label>
	<select {id} class="filter__select" onchange={handleChange} bind:value={selected}>
		{#each options as option (option.value)}
			<option value={option.value}>{option.text}</option>
		{/each}
	</select>
</div>

<style>
	.filter {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
		position: relative;
		width: 100%;
		max-width: 100%;
	}

	.filter__label {
		font-size: 0.9rem;
		font-weight: 600;
		color: #374151;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		margin-bottom: 0.25rem;
	}

	.filter__select {
		padding: 0.75rem 1rem;
		border: 2px solid #e5e7eb;
		border-radius: 0.5rem;
		background-color: #ffffff;
		font-size: 0.95rem;
		color: #374151;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
		appearance: none;
		background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
		background-position: right 0.75rem center;
		background-repeat: no-repeat;
		background-size: 1.25rem;
		padding-right: 2.5rem;
		width: 100%;
		max-width: 100%;
		box-sizing: border-box;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.filter__select:hover {
		border-color: #1976d2;
		box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
	}

	.filter__select:focus {
		outline: none;
		border-color: #1976d2;
		box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.2);
	}

	.filter__select option {
		padding: 0.5rem;
		background-color: #ffffff;
		color: #374151;
		white-space: normal;
		word-wrap: break-word;
		max-width: 100%;
	}

	.filter__select option:hover {
		background-color: #f3f4f6;
	}

	@media (max-width: 768px) {
		.filter {
			position: relative;
			z-index: 1;
			width: 100%;
			max-width: 100%;
			overflow: hidden;
		}

		.filter__label {
			font-size: 0.85rem;
		}

		.filter__select {
			padding: 0.65rem 0.85rem;
			font-size: 0.9rem;
			padding-right: 2.25rem;
			min-width: 0;
			flex-shrink: 1;
			width: 100%;
			max-width: 100%;
		}

		.filter__select option {
			font-size: 0.9rem;
			padding: 0.75rem 0.5rem;
			white-space: normal;
			word-wrap: break-word;
			max-width: 100%;
		}
	}

	@media (max-width: 480px) {
		.filter {
			width: 100%;
			max-width: 100%;
			margin-left: 0;
			margin-right: 0;
			padding-left: 0;
			padding-right: 0;
		}

		.filter__select {
			font-size: 16px;
			padding: 0.75rem 0.75rem;
			padding-right: 2rem;
			background-size: 1rem;
			background-position: right 0.5rem center;
			width: 100%;
			max-width: 100%;
			min-width: 0;
			box-sizing: border-box;
		}

		.filter__select option {
			font-size: 16px;
			padding: 0.5rem;
			white-space: normal;
			word-wrap: break-word;
		}
	}
</style>
