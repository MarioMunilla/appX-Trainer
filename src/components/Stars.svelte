<script lang="ts">
	import Face from '$lib/Face.svelte';

	export let stars: number = 5;
	export let current: number = -1;
	export let rate: ((rating: number) => Promise<any> | void) | undefined = undefined;

	$: active = current;

	let isAnimating: boolean = false;
	let interval: ReturnType<typeof setInterval> | undefined;

	function handleClick(newCurrent: number): void {
		if (isAnimating) return;
		isAnimating = true;

		const reset = active === newCurrent;

		if (active === undefined || active === -1) {
			active = -1;
		}

		const inc = active < newCurrent ? 1 : -1;

		interval = setInterval(async () => {
			if (active === newCurrent) {
				clearInterval(interval);
				isAnimating = false;
				current = active;

				await rate?.(current);

				if (reset) {
					current = -1;
					active = -1;
				}

				return;
			}
			active += inc;
		}, 200);
	}
</script>

<div class="rating">
	<ul>
		{#each Array(stars) as _, i}
			<li>
				<button
					type="button"
					class:active={i <= active}
					class:highlighted={i === active}
					class:active-3={i === active && i === 3}
					class:active-4={i === active && i === 4}
					on:click={() => handleClick(i)}
					on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick(i)}
					aria-label={`Calificar con ${i + 1} estrellas`}
				>
					<section class="star-wrapper">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="2.5rem"
							height="2.5rem"
							viewBox="0 0 24 24"
						>
							<path
								fill="currentColor"
								d="m22 9.24l-7.19-.62L12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21L12 17.27L18.18 21l-1.63-7.03zM12 15.4l-3.76 2.27l1-4.28l-3.32-2.88l4.38-.38L12 6.1l1.71 4.04l4.38.38l-3.32 2.88l1 4.28z"
							/>
						</svg>
						{#if i === active}
							<Face current={active} />
						{/if}
					</section>
				</button>
			</li>
		{/each}
	</ul>
</div>

<style>
	.rating {
		--active: #c6bd0f;
		--inactive: #999;
		--face: #121621;

		display: flex;
		position: relative;
		color: var(--inactive);
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
	}

	li {
		cursor: pointer;
		position: relative;
		margin-right: 10px;
	}

	button {
		background: none;
		border: none;
		cursor: pointer;
		position: relative;
		color: var(--inactive);
		padding: 0;
		line-height: 1;
	}

	.star-wrapper {
		position: relative;
		display: inline-block;
		width: 2.5rem;
		height: 2.5rem;
	}

	button.active {
		color: var(--active);
	}

	button.highlighted {
		animation: pop 0.3s ease-out;
	}

	button.active-3 {
		animation: active-3 0.4s ease;
	}

	button.active-4 {
		animation: active-4 0.72s ease;
	}

	@keyframes pop {
		from {
			transform: scale(0.8);
			opacity: 0.3;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	@keyframes active-3 {
		40% {
			transform: scale(1.25);
		}
	}

	@keyframes active-4 {
		15% {
			transform: rotate(180deg) scale(1.1);
		}
		30% {
			transform: rotate(360deg) scale(1.2);
		}
		70% {
			transform: rotate(360deg) translateY(14%) scaleY(0.72);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
