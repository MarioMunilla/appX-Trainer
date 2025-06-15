<script lang="ts">
    interface FavFilterProps { 
        checked: boolean, 
        onchange?: (isChecked: boolean) => void 
    }
    
    let { 
        checked = $bindable(),
        onchange
    }: FavFilterProps = $props();

    function handleOnChange(event: Event) {
        const cb = event.target as HTMLInputElement
        checked = cb.checked
        if (onchange) { onchange(checked) }
    }
</script>

<div class="filter">
    <label class="filter__label-checkbox">
        <input 
            type="checkbox" 
            class="filter__checkbox"
            onchange={handleOnChange}
        />
        <span class="filter__label-text">Favorites</span>
    </label>
</div>

<style>
    .filter {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
    }

    .filter__label-checkbox {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        cursor: pointer;
        padding: 0.75rem 1rem;
        border: 2px solid #e5e7eb;
        border-radius: 0.5rem;
        background-color: #ffffff;
        transition: all 0.2s ease-in-out;
        user-select: none;
    }


    .filter__checkbox {
        width: 1.25rem;
        height: 1.25rem;
        accent-color: #1976d2;
        cursor: pointer;
        border-radius: 0.25rem;
    }

    .filter__checkbox:focus {
        outline: 2px solid #1976d2;
        outline-offset: 2px;
    }

    .filter__label-text {
        font-size: 0.9rem;
        font-weight: 600;
        color: #374151;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    @media (max-width: 768px) {
        .filter__label-checkbox {
            padding: 0.65rem 0.85rem;
            gap: 0.65rem;
        }

        .filter__checkbox {
            width: 1.1rem;
            height: 1.1rem;
        }

        .filter__label-text {
            font-size: 0.85rem;
        }
    }
</style>
