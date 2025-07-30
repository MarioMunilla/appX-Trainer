<script lang="ts">
	type HeartIconProps = {
		isFavorite: boolean
	}

	let { isFavorite }: HeartIconProps = $props()

		/* $effect(()=> {
		console.log(isFavorite)
	}) */
</script>

<svg
	class:heart__filled={isFavorite}
	width="24"
	height="24"
	viewBox="0 0 100 100"
	xmlns="http://www.w3.org/2000/svg"
>
	<path
		stroke-width="10"
		d="M 10,30
       A 20,20 0,0,1 50,30
       A 20,20 0,0,1 90,30
       Q 90,60 50,90
       Q 10,60 10,30 z
       "
	/>
</svg>

<style>
	svg {
		stroke: black;
		fill: transparent;
	}
	svg:hover {
		transform: scale(1.25);
		transition: 0.1s;
	}

	.heart__filled {
		stroke: red;
		fill: red;
	}

	.heart__filled:hover {
		stroke-dasharray: 8 8;
		fill: #f445;
	}
</style>
