<script lang="ts" context="module">
	import type { RoutineDetailResponse, RoutineExercise, ExerciseRow } from '$lib/types'

	export interface PageData {
		routine_id: string | null
		exercises: (RoutineExercise & { exercises?: ExerciseRow })[]
		user_id: string
		name: string | null
		description: string | null
		routines: {
			id: string
			name: string
			description: string | null
			difficulty: string
			created_at: string
		}[]
	}
</script>

<script lang="ts">
	import { page } from '$app/stores'
	import { invalidate } from '$app/navigation'
	import { Motion } from 'svelte-motion'
	import { spring } from 'svelte/motion'
  import PlusIcon from '../../components/PlusIcon.svelte'
  import SubtractionIcon from '../../components/SubtractionIcon.svelte'
  import PencilIcon from '../../components/PencilIcon.svelte'

	let data: PageData = $props()

	type ExerciseWithWeight = RoutineExercise & {
		exercises?: ExerciseRow
		weight: number
	}
	let routinesSuggestions = [
		{
			level: 'PRINCIPIANTE',
			color: '#22c55e',
			icon: '✔️',
			title: 'Rutina de iniciación de 15 minutos',
			details: '3 días/semana • Dificultad baja • Full-body',
			open: true
		},
		{
			level: 'INTERMEDIO',
			color: '#2563eb',
			icon: '🔵',
			title: 'Rutina de 30 minutos con progresión',
			details: '4 días/semana • División superior/inferior',
			open: false
		},
		{
			level: 'AVANZADO',
			color: '#ef4444',
			icon: '🔴',
			title: 'Rutina intensiva de 45 – 60 minutos',
			details: '5–6 días/semana • División por grupos musculares',
			open: false
		}
	]
	let activeSuggestionIndex = $state<number>(0)

	let routine_id = $state<string | null>(data.routine_id)
	let exercises = $state<ExerciseWithWeight[]>(
		(data.exercises || []).map(ex => ({
			...ex,
			weight: ex.weight || 0
		}))
	)
	let title = $state<string>(data.name || 'Mi rutina')
	let description = $state<string>(data.description || 'Descripción de la rutina')
	let routines = $state<PageData['routines']>(data.routines || [])

	let saveMessage = $state<string>('')
	let saveError = $state<boolean>(false)
	let editingTitle = $state<boolean>(false)
	let editingDescription = $state<boolean>(false)
	let originalTitle = $state<string>(title)
	let originalDescription = $state<string>(description)
	let titleInput = $state<HTMLInputElement | null>(null)
	let descriptionInput = $state<HTMLInputElement | null>(null)

	async function changeRoutine(id: string): Promise<void> {
		window.history.pushState({}, '', `/routine?id=${id}`)
		const res = await fetch(`/api/routines/${id}`)
		if (!res.ok) return

		const routineData: RoutineDetailResponse = await res.json()
		routine_id = routineData.id
		exercises = (routineData.exercises || []).map(ex => ({ ...ex, weight: ex.weight || 0 }))
		title = routineData.name || 'Mi rutina'
		description = routineData.description || 'Descripción de la rutina'
		originalTitle = title
		originalDescription = description
	}

	$effect(() => {
		const idFromUrl = $page.url.searchParams.get('id')
		if (idFromUrl && idFromUrl !== routine_id) {
			changeRoutine(idFromUrl)
		}
	})

	function startEditingTitle(): void {
		editingTitle = true
		setTimeout(() => titleInput?.focus(), 0)
	}

	function startEditingDescription(): void {
		editingDescription = true
		setTimeout(() => descriptionInput?.focus(), 0)
	}

	function stopEditingTitle(save: boolean = false): void {
		if (save && title !== originalTitle) saveRoutine()
		editingTitle = false
	}

	function stopEditingDescription(save: boolean = false): void {
		if (save && description !== originalDescription) saveRoutine()
		editingDescription = false
	}

	async function incrementWeight(index: number): Promise<void> {
		const newWeight = (exercises[index].weight || 0) + 1
		const exerciseId = exercises[index]?.exercises?.id || exercises[index]?.exercise_id
		const response = await fetch(`/api/routines/${routine_id}/${exerciseId}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ weight: newWeight })
		})
		if (response.ok) {
			exercises[index].weight = newWeight
			exercises = [...exercises]
		} else {
			console.error('Error al incrementar peso:', await response.json())
		}
	}

	async function decrementWeight(index: number): Promise<void> {
		const newWeight = Math.max((exercises[index].weight || 0) - 1, 0)
		const exerciseId = exercises[index]?.exercises?.id || exercises[index]?.exercise_id
		const response = await fetch(`/api/routines/${routine_id}/${exerciseId}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ weight: newWeight })
		})
		if (response.ok) {
			exercises[index].weight = newWeight
			exercises = [...exercises]
		} else {
			console.error('Error al decrementar peso:', await response.json())
		}
	}

	async function incrementRepetitions(index: number): Promise<void> {
		const newRepetitions = (exercises[index].repetitions || 0) + 1
		const exerciseId = exercises[index]?.exercises?.id || exercises[index]?.exercise_id
		const response = await fetch(`/api/routines/${routine_id}/${exerciseId}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ repetitions: newRepetitions })
		})
		if (response.ok) {
			exercises[index].repetitions = newRepetitions
			exercises = [...exercises]
		} else {
			console.error('Error al incrementar repeticiones:', await response.json())
		}
	}

	async function decrementRepetitions(index: number): Promise<void> {
		const newRepetitions = Math.max((exercises[index].repetitions || 0) - 1, 1)
		const exerciseId = exercises[index]?.exercises?.id || exercises[index]?.exercise_id
		const response = await fetch(`/api/routines/${routine_id}/${exerciseId}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ repetitions: newRepetitions })
		})
		if (response.ok) {
			exercises[index].repetitions = newRepetitions
			exercises = [...exercises]
		} else {
			console.error('Error al decrementar repeticiones:', await response.json())
		}
	}

	function moveUp(index: number): void {
		if (index === 0) return
		;[exercises[index - 1], exercises[index]] = [exercises[index], exercises[index - 1]]
		exercises = [...exercises]
	}

	function moveDown(index: number): void {
		if (index === exercises.length - 1) return
		;[exercises[index + 1], exercises[index]] = [exercises[index], exercises[index + 1]]
		exercises = [...exercises]
	}

	async function saveRoutine(): Promise<void> {
		if (!routine_id) return
		const res = await fetch(`/api/routines/${routine_id}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name: title, description })
		})

		if (!res.ok) {
			saveError = true
			saveMessage = (await res.json()).error || 'Error al guardar rutina'
			return
		}

		saveError = false
		saveMessage = 'Rutina guardada correctamente'
		originalTitle = title
		originalDescription = description
		invalidate('/routine')
	}
</script>

<main class="routine-container">
	{#if routines && routines.length > 1}
		<nav class="routine-selector" aria-label="Selección de rutinas">
			<select on:change={e => changeRoutine((e.target as HTMLSelectElement).value)}>
				{#each routines as routine (routine.id)}
					<option value={routine.id} selected={routine.id === routine_id}>
						{routine.name} ({routine.difficulty})
					</option>
				{/each}
			</select>
		</nav>
	{/if}

	{#if routine_id}
		<header class="header">
			{#if editingTitle}
				<form on:submit|preventDefault={() => stopEditingTitle(true)}>
					<label for="routine-title" class="sr-only">Nombre de la rutina</label>
					<input
						id="routine-title"
						type="text"
						bind:value={title}
						bind:this={titleInput}
						placeholder="Nombre de la rutina"
						on:blur={() => stopEditingTitle(true)}
					/>
					<button type="submit" aria-label="Guardar nombre">💾</button>
				</form>
			{:else}
				<h1>{title}</h1>
				<button on:click={startEditingTitle} aria-label="Editar nombre" class="btn-pencil"><PencilIcon/></button>
			{/if}
		</header>

		<section class="description-edit">
			{#if editingDescription}
				<form on:submit|preventDefault={() => stopEditingDescription(true)}>
					<label for="routine-description" class="sr-only">Descripción</label>
					<input
						id="routine-description"
						type="text"
						bind:value={description}
						bind:this={descriptionInput}
						placeholder="Descripción"
						on:blur={() => stopEditingDescription(true)}
					/>
					<button type="submit" aria-label="Guardar descripción">💾</button>
				</form>
			{:else}
				<div class="description-row" role="group" aria-label="Descripción de la rutina">
					<p class="description-text">{description}</p>
					<menu class="description-actions">
						<li>
							<button on:click={startEditingDescription} aria-label="Editar descripción" class="btn-pencil"><PencilIcon /></button>
						</li>
					</menu>
				</div>
			{/if}
		</section>

		{#if saveMessage}
			<aside class="alert {saveError ? 'error' : 'success'}" role="alert">
				{saveMessage}
			</aside>
		{/if}

		{#if exercises.length > 0}
			<ol class="exercises-list">
				{#each exercises as item, index (index)}
					<li class="exercise-item">
						<article class="exercise-header">
							<h3 class="exercise-name">{item.exercises?.name}</h3>
							<menu class="exercise-controls">
								<li><button on:click={() => decrementRepetitions(index)} aria-label="Reducir repeticiones" class="btn-subtraction"><SubtractionIcon/></button></li>
								<li><span class="repetitions">{item.repetitions} reps</span></li>
								<li><button on:click={() => incrementRepetitions(index)} aria-label="Aumentar repeticiones" class="btn-addition"><PlusIcon/></button></li>
								<li><button on:click={() => decrementWeight(index)} aria-label="Reducir peso" class="btn-subtraction"><SubtractionIcon/></button></li>
								<li><span class="weight">{item.weight || 0} kg</span></li>
								<li><button on:click={() => incrementWeight(index)} aria-label="Aumentar peso" class="btn-addition"><PlusIcon/></button></li>
								<li><button on:click={() => moveUp(index)} aria-label="Mover arriba">▲</button></li>
								<li><button on:click={() => moveDown(index)} aria-label="Mover abajo">▼</button></li>
							</menu>
						</article>

						{#if item.exercises?.gif_url?.endsWith('.gif')}
							<figure>
								<img src={`/exercises/${item.exercises.gif_url}`} alt={item.exercises.name} loading="lazy" />
							</figure>
						{:else if item.exercises?.gif_url}
							<figure>
								<video autoplay loop muted playsinline>
									<source src={`/exercises/${item.exercises.gif_url}`} type="video/mp4" />
								</video>
							</figure>
						{/if}
					</li>
				{/each}
			</ol>
		{:else}
			<p class="no-exercises">No tienes ejercicios en tu rutina aún.</p>
		{/if}
	{:else}
		<article class="no-routine">
			<h2>No tienes ninguna rutina</h2>
			<p>Ve a la sección de ejercicios y empieza a crear la tuya.</p>
			<a href="/exercise" class="btn-primary">Ver ejercicios →</a>
		</article>

		<section class="routine-suggestions" aria-labelledby="suggestions-heading">
			<h2 id="suggestions-heading">SUGERENCIAS DE RUTINAS</h2>

			<section class="routine-tabs" role="tablist">
				{#each routinesSuggestions as suggestion, index (suggestion.level)}
					<li role="presentation">
						<button
							role="tab"
							aria-selected={index === activeSuggestionIndex}
							class:active={index === activeSuggestionIndex}
							on:click={() => (activeSuggestionIndex = index)}
						>
							<span class="routine-dot" style="background:{suggestion.color}">
								{suggestion.icon}
							</span>
							{suggestion.level}
						</button>
					</li>
				{/each}
			</section>

			{#each routinesSuggestions as suggestion, index (suggestion.level)}
				{#if index === activeSuggestionIndex}
					<Motion
						transition={spring}
						animate={{ opacity: 50, y: -50 }}
						initial={{ opacity: 50, y: -50 }}
					>
						<span class="routine-card transition-card">
							<h3>{suggestion.title}</h3>
							<p>{suggestion.details}</p>
							<button class="btn-outline">Ver detalles</button>
						</span>
					</Motion>
				{/if}
			{/each}
		</section>
	{/if}
</main>
<style lang="scss">
	.routine-container {
		max-width: 1100px;
		margin: 0 auto;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;

		.routine-selector {
			margin-bottom: 1.5rem;

			select {
				width: 100%;
				padding: 0.75rem;
				border-radius: 0.5rem;
				border: 2px solid #e2e8f0;
				background-color: #f8fafc;
				font-size: 1rem;
			}
		}

		.header {
			display: grid;
			grid-template-columns: 1fr auto;
			align-items: center;
			gap: 1rem;

			h1 {
				margin: 0;
				font-size: clamp(1.25rem, 2vw, 2rem);
				line-height: 1.2;
			}

			form {
				display: flex;
				gap: 0.5rem;
				width: 100%;

				input[type='text'] {
					flex-grow: 1;
					padding: 0.75rem;
					border: 2px solid #e2e8f0;
					border-radius: 0.5rem;
					font-size: 1rem;
					transition: border-color 0.2s;

					&:focus {
						border-color: #3b82f6;
						outline: none;
					}
				}
			}
		}

		.description-edit {
			form {
				display: flex;
				gap: 0.5rem;
				width: 100%;

				input[type='text'] {
					flex-grow: 1;
					padding: 0.75rem;
					border: 2px solid #e2e8f0;
					border-radius: 0.5rem;
					font-size: 1rem;
					transition: border-color 0.2s;

					&:focus {
						border-color: #3b82f6;
						outline: none;
					}
				}
			}

			.description-row {
				display: flex;
				align-items: flex-end;
				justify-content: space-between;
				gap: 0.75rem;
				padding: 0.1rem;

				.description-text {
					margin: 0;
					font-size: clamp(1rem, 2.2vw, 1.125rem);
					color: #0f172a;
				}

				.description-actions {
					list-style: none;
					margin: 0;
					padding: 0;
					display: flex;
					gap: 0.5rem;
				}
			}
		}

		.exercises-list {
			list-style: none;
			padding: 0;
			margin: 0;
			display: grid;
			gap: 1.5rem;

			.exercise-item {
				background-color: white;
				border-radius: 0.75rem;
				padding: 1.5rem;
				box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

				img,
				video {
					max-width: 100%;
					height: auto;
					border-radius: 0.5rem;
				}

				.exercise-header {
					display: grid;
					grid-template-columns: 1fr auto;
					gap: 1rem;
					margin-bottom: 1rem;

					.exercise-name {
						font-size: clamp(1rem, 1.5vw, 1.25rem);
					}

					.exercise-controls {
						display: flex;
						gap: 0.5rem;
						list-style: none;
						padding: 0;
						margin: 0;
						align-items: center;

						.btn-subtraction,
						.btn-addition {
							display: flex;
							align-items: center;
							justify-content: center;
							width: 2.5rem;
							height: 2.5rem;
							border: none;
							border-radius: 50%;
							font-size: 1.2rem;
							font-weight: 600;
							cursor: pointer;
							transition: all 0.2s ease-in-out;
							box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
							position: relative;
							overflow: hidden;

							&::before {
								content: '';
								position: absolute;
								top: 50%;
								left: 50%;
								width: 0;
								height: 0;
								background: rgba(255, 255, 255, 0.3);
								border-radius: 50%;
								transform: translate(-50%, -50%);
								transition: width 0.3s ease, height 0.3s ease;
							}

							&:active::before {
								width: 100%;
								height: 100%;
							}

							&:focus {
								outline: none;
								box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1);
							}
						}

						.btn-subtraction {
							background: linear-gradient(135deg, #ef4444, #dc2626);
							color: white;

							&:focus {
								box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.5), 0 2px 4px rgba(0, 0, 0, 0.1);
							}

							&:hover {
								background: linear-gradient(135deg, #dc2626, #b91c1c);
								transform: translateY(-2px) scale(1.05);
								box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
							}

							&:active {
								transform: translateY(0) scale(0.95);
								box-shadow: 0 2px 4px rgba(239, 68, 68, 0.4);
							}
						}

						.btn-addition {
							background: linear-gradient(135deg, #10b981, #059669);
							color: white;

							&:focus {
								box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.5), 0 2px 4px rgba(0, 0, 0, 0.1);
							}

							&:hover {
								background: linear-gradient(135deg, #059669, #047857);
								transform: translateY(-2px) scale(1.05);
								box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
							}

							&:active {
								transform: translateY(0) scale(0.95);
								box-shadow: 0 2px 4px rgba(16, 185, 129, 0.4);
							}
						}

						.repetitions,
						.weight {
							font-weight: 600;
							font-size: 0.9rem;
							color: #374151;
							background: #f3f4f6;
							padding: 0.5rem 0.75rem;
							border-radius: 0.5rem;
							min-width: 4rem;
							text-align: center;
							border: 1px solid #e5e7eb;
						}
					}
				}
			}
		}

		.routine-suggestions {
			background: #f8fafc;
			border-radius: 1rem;
			padding: 2rem;
			margin-top: 2rem;

			.routine-tabs {
				display: flex;
				gap: 0.5rem;
				margin: 2rem 0;
				padding: 0;
				list-style: none;
				justify-content: center;
				flex-wrap: wrap;

				button {
					padding: 0.75rem 1.25rem;
					border: none;
					background: #e2e8f0;
					border-radius: 999px;
					font-weight: 600;

					&[aria-selected="true"] {
						background: #2563eb;
						color: white;
					}
				}
			}

			.routine-card {
				background: white;
				border-radius: 1rem;
				padding: 1rem;
				box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
				text-align: center;
				margin: 0 auto;
				max-width: 52rem;
			}
		}

		.btn-pencil {
			cursor: pointer;
			transition: all 0.2s;
			border-radius: 0.25rem;
			padding: 0.5rem;
			background: transparent;
			border: 2px solid #3b82f6;
			color: #3b82f6;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 2.5rem;
			height: 2.5rem;

			&:hover {
				background: #3b82f6;
				color: white;
				transform: translateY(-1px);
				box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
			}

			&:focus {
				outline: none;
				box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
			}

			&:active {
				transform: translateY(0);
			}
		}

		.no-routine {
			text-align: center;
			padding: 3rem 1rem;

			.btn-primary {
				background: #3b82f6;
				color: white;
				padding: 0.75rem 1.5rem;
				border-radius: 0.5rem;
				text-decoration: none;
				display: inline-block;
				margin-top: 1rem;
				border: none;
				cursor: pointer;
				transition: all 0.2s;

				&:hover {
					background-color: #2563eb;
					transform: translateY(-1px);
				}
			}
		}

		.btn-outline {
			background: transparent;
			border: 2px solid #3b82f6;
			color: #3b82f6;
			padding: 0.5rem 1rem;
			margin-top: 1rem;
			cursor: pointer;
			transition: all 0.2s;
			border-radius: 0.25rem;

			&:hover {
				background: #3b82f6;
				color: white;
			}
		}
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}

	.alert {
		padding: 0.75rem;
		margin: 1rem 0;
		border-radius: 0.5rem;
		text-align: center;

		&.success {
			background-color: #f0fdf4;
			color: #166534;
			border: 1px solid #bbf7d0;
		}

		&.error {
			background-color: #fef2f2;
			color: #991b1b;
			border: 1px solid #fecaca;
		}
	}

	.no-exercises {
		text-align: center;
		padding: 2rem;
		color: #64748b;
	}

	button {
		cursor: pointer;
		transition: all 0.2s;
		border-radius: 0.25rem;
		padding: 0.5rem;
	}

	@media (max-width: 640px) {
		.routine-container {
			.exercises-list {
				.exercise-item {
					.exercise-header {
						grid-template-columns: 1fr;

						.exercise-controls {
							flex-wrap: wrap;
							justify-content: center;

							li {
								flex: 1 1 45%;
								display: flex;
								justify-content: center;
							}

							button {
								width: 100%;
								padding: 0.75rem;
								font-size: 1.2rem;
							}

							.btn-subtraction,
							.btn-addition {
								width: 3rem;
								height: 3rem;
								font-size: 1.4rem;
							}

							.repetitions,
							.weight {
								font-size: 1rem;
								padding: 0.75rem;
								min-width: 5rem;
							}
						}
					}
				}
			}

			.routine-suggestions {
				.routine-tabs {
					flex-direction: column;
					align-items: stretch;
				}
			}
		}
	}

	@media (min-width: 768px) and (max-width: 1024px) {
		.routine-container {
			padding: 2rem;

			.exercises-list {
				.exercise-item {
					padding: 2rem;
				}
			}
		}
	}
</style>
