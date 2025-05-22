<script lang="ts">
	export let data;
	const { challenge, exercises } = data;
	const progress = 75; 
</script>

<section class="challenge">
	<h1>🔥 DESAFÍO DEL DÍA <span>({new Date(challenge.date).toLocaleDateString()})</span></h1>

	<div class="progress">
		<div class="bar" style={`width: ${progress}%`}></div>
		<span>{progress}%</span>
	</div>

	<div class="exercise-list">
		{#each exercises as ex(ex.id)}
			<div class="exercise-card">
				<img src={ex.gif_url} alt={ex.name} />
				<h2>{ex.name}</h2>
				<p>({ex.body_part})</p>
				<p>{'★'.repeat(ex.difficulty || 3).padEnd(5, '☆')}</p>
				<button>Comenzar</button>
			</div>
		{/each}
	</div>

	{#if progress >= 100}
		<div class="completed">
			<strong>✅ ¡Desafío completado!</strong>
			<p>Has ganado {challenge.xp_reward} puntos de experiencia.</p>
		</div>
	{/if}
</section>

<style>
	.challenge {
		max-width: 960px;
		margin: auto;
		padding: 2rem;
		text-align: center;
	}
	.progress {
		background: #ddd;
		border-radius: 10px;
		overflow: hidden;
		position: relative;
		margin: 1rem 0;
	}
	.bar {
		height: 20px;
		background: linear-gradient(90deg, #4caf50, #8bc34a);
	}
	.progress span {
		position: absolute;
		right: 10px;
		top: 0;
		color: #000;
		font-weight: bold;
	}
	.exercise-list {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		justify-content: center;
	}
	.exercise-card {
		background: #fff;
		border-radius: 1rem;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		padding: 1rem;
		width: 200px;
	}
	.exercise-card img {
		width: 100%;
		border-radius: 1rem;
	}
	.exercise-card h2 {
		margin: 0.5rem 0 0.2rem;
	}
	.completed {
		margin-top: 2rem;
		background: #e6ffe6;
		padding: 1rem;
		border-radius: 10px;
	}
</style>
