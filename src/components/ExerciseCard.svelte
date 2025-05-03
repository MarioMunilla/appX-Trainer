<script lang="ts">
    type ExerciseCardProps = {
        name: string,
        bodyParts: string[],
        imgURL: string 
    }

    let { name, bodyParts, imgURL }: ExerciseCardProps = $props()
</script>

<article class="exercise-card">
	<h1 class="exercise-card__name">{name}</h1>
	<div class="exercise-card__body-parts">Grupo muscular: {bodyParts.join(', ')}</div>
	<img class="exercise-card__img" src={imgURL} alt={name} width="200" />
</article>

<style>
    .exercise-card {
        border: 0.2rem solid #f44;
    }
</style>
