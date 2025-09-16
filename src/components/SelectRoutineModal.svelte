<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()

	const props: {
		visible?: boolean
		onClose?: () => void
		onChoose?: (payload: {
			routine_id?: string
			routine_name?: string
		}) => void
	} = $props()

	let routines = $state<
		{
			id: string
			name: string
			description: string | null
			difficulty: string
		}[]
	>([])
	let loading = $state(false)
	let selected = $state<string | null>(null)
	let newRoutineName = $state('')

	async function loadRoutines() {
		loading = true
		const res = await fetch('/api/routine')
		if (res.ok) {
			const json = await res.json()
			routines = json.routines || []
		}
		loading = false
	}

	$effect(() => {
		if (props.visible) loadRoutines()
	})

	function close() {
		dispatch('close')
	}

	function confirm() {
		if (newRoutineName.trim().length > 0) {
			dispatch('choose', { routine_name: newRoutineName.trim() })
		} else if (selected) {
			dispatch('choose', { routine_id: selected })
		} else {
			return
		}
		close()
	}
</script>

{#if props.visible}
	<div class="modal-backdrop" on:click={close}></div>
	<div class="modal" on:click|stopPropagation>
		<h2>Selecciona rutina</h2>

		{#if loading}
			<p>Cargando rutinas…</p>
		{:else if routines.length > 0}
			<label>
				Rutinas existentes
				<select bind:value={selected}>
					<option value="" disabled selected>Elige rutina</option>
					{#each routines as r (r.id)}
						<option value={r.id}>{r.name} ({r.difficulty})</option>
					{/each}
				</select>
			</label>
		{:else}
			<p>No tienes rutinas aún.</p>
		{/if}

		<hr />
		<label>
			O crea nueva rutina
			<input
				type="text"
				placeholder="Nombre de la rutina"
				bind:value={newRoutineName}
			/>
		</label>

		<div class="actions">
			<button on:click={confirm}>Aceptar</button>
			<button on:click={close}>Cancelar</button>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.4);
		z-index: 1000;
	}
	.modal {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: white;
		padding: 1.5rem;
		border-radius: 0.5rem;
		z-index: 1001;
		width: 90%;
		max-width: 400px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
	}
	h2 {
		margin-top: 0;
	}
	.actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
		margin-top: 1rem;
	}
	select,
	input[type="text"] {
		width: 100%;
		padding: 0.5rem;
		margin-top: 0.25rem;
		margin-bottom: 0.75rem;
		border: 1px solid #ccc;
		border-radius: 0.25rem;
	}
	button {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 0.25rem;
		background: #3b82f6;
		color: white;
		cursor: pointer;
	}
	button:hover {
		background: #2563eb;
	}
</style>
