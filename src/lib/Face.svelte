<script lang="ts">
	export let current: number
</script>

<span class={current !== 4 ? 'left-eye' : 'left-eye-4'}></span>
<span class={current !== 4 ? 'right-eye' : 'right-eye-4'}></span>
<span class={`mouth-${current}`}></span>

<style>
	.left-eye,
	.right-eye,
	.left-eye-4,
	.right-eye-4,
	[class^='mouth-'] {
		position: absolute;
	}

	/* Ojos */
	.left-eye,
	.right-eye {
		background: var(--face);
		width: 0.25rem;
		height: 0.25rem;
		border-radius: 50%;
		top: 35%;
	}

	.left-eye {
		left: 42%;
		transform: translate(-50%, -50%);
	}
	.right-eye {
		left: 58%;
		transform: translate(-50%, -50%);
	}

	.left-eye-4,
	.right-eye-4 {
		width: 0.25rem;
		height: 0.25rem;
		border: 1px solid transparent;
		border-top-color: var(--face);
		border-left-color: var(--face);
		top: 35%;
		transform: translate(-50%, -50%) rotate(45deg);
	}
	.left-eye-4 {
		left: 42%;
	}
	.right-eye-4 {
		left: 58%;
	}

	/* Bocas */
	.mouth-0 {
		width: 0.6rem;
		height: 0.6rem;
		top: 68%;
		left: 50%;
		border-radius: 50%;
		border: 2px solid transparent;
		border-top-color: var(--face);
		transform: translate(-50%, -50%) rotate(0deg);
	}

	.mouth-1 {
		width: 0.5rem;
		height: 0.5rem;
		top: 68%;
		left: 50%;
		border-radius: 50%;
		border: 1.5px solid transparent;
		border-top-color: var(--face);
		transform: translate(-50%, -50%) rotate(170deg);
	}

	.mouth-2 {
		width: 0.5rem;
		height: 1.5px;
		background: var(--face);
		top: 68%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.mouth-3 {
		width: 0.5rem;
		height: 0.5rem;
		top: 68%;
		left: 50%;
		border-radius: 50%;
		border: 1.5px solid transparent;
		border-bottom-color: var(--face);
		transform: translate(-50%, -50%);
	}

	.mouth-4 {
		width: 0.6rem;
		height: 0.25rem;
		background: var(--face);
		border-radius: 0 0 0.5rem 0.5rem;
		top: 68%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
