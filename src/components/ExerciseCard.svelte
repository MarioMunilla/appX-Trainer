<script lang="ts">
	type ExerciseCardProps = {
		name: string;
		bodyParts: string[];
		gif_url: string;
	};

	let { name, gif_url }: ExerciseCardProps = $props();

	const isGif = gif_url?.endsWith('.gif') ?? false;
</script>

<a class="exercise-card" href={`/entrenamiento/${name}`}>
	{#if isGif}
		<img class="exercise-card__image" src={`/exercises/${gif_url}`} alt={name} />
	{:else}
		<video class="exercise-card__image" autoplay loop muted playsinline>
			<source src={`/exercises/${gif_url}`} type="video/mp4" />
		</video>
	{/if}
	<div class="exercise-card__content">
		<h2 class="exercise-card__title">{name}</h2>
	</div>
</a>

<style>
.exercise-card {
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: #ffffff;
	border-radius: 1rem;
	box-shadow: 0 0.4rem 1rem rgba(0, 0, 0, 0.1);
	overflow: hidden;
	transition: transform 0.2s ease, box-shadow 0.2s ease;
	width: 100%;
	text-decoration: none; 
	color: inherit; 
}

.exercise-card:hover {
	transform: translateY(-0.5rem);
	box-shadow: 0 0.8rem 2rem rgba(0, 0, 0, 0.15);
	z-index: 1;
}

.exercise-card__image {
	width: 100%;
	height: 12.5rem;
	object-fit: cover;
}

.exercise-card__content {
	padding: 1rem;
	text-align: center;
	width: 100%;
}

.exercise-card__title {
	font-size: 1.6rem;
	font-weight: 600;
	color: #333333;
	margin: 0.5rem 0;
}

.exercise-card__body-parts {
	font-size: 1.2rem;
	color: #666666;
}

.exercise-card__body-parts-highlight {
	color: #f44336;
	font-weight: 500;
}
</style>
