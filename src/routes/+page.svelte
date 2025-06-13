<script>
	import MenuNavegacion from '../components/MenuNavegacion.svelte';
	import { supabase } from '$lib/supabaseClient';
	import { onMount } from 'svelte';

	let exerciseCount = 0;
	let animatedUsers = 0;

	onMount(() => {
		const interval = setInterval(() => {
			if (exerciseCount < 50) {
				exerciseCount += 5;
			} else {
				clearInterval(interval);
			}
		}, 100);

		const userInterval = setInterval(() => {
			if (animatedUsers < 10000) {
				animatedUsers += 500;
			} else {
				clearInterval(userInterval);
			}
		}, 100);
	});
</script>

<main class="hero">
	<header class="hero__content">
		<h1>Transforma tu cuerpo con <span>X-TRAINER</span></h1>
		<p class="highlight">
			Tu entrenador inteligente que crea rutinas personalizadas, te motiva con desafíos y celebra cada logro contigo.
		</p>
	</header>

	<section class="stats" aria-label="Estadísticas destacadas">
		<article class="stat">
			<p class="stat-number">{exerciseCount}+</p>
			<p class="stat-label">Ejercicios distintos</p>
		</article>

		<article class="stat">
			<p class="stat-number">{animatedUsers.toLocaleString()}+</p>
			<p class="stat-label">Usuarios activos</p>
		</article>
	</section>
</main>

<style>
.hero {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 6rem 2rem;
	background: linear-gradient(to right, #0f172a, #1e293b);
	color: white;
	text-align: center;
	position: relative;
	overflow: hidden;
	min-height: 100%;
	flex: 1;
}

.hero::after {
	content: '';
	position: absolute;
	top: -50%;
	right: -50%;
	height: 200%;
	background: radial-gradient(circle, rgba(25, 118, 210, 0.15) 0%, transparent 70%);
	z-index: 0;
}

.hero__content {
	max-width: 70rem;
	width: 100%;
	z-index: 1;
	position: relative;
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.hero__content h1 {
	font-size: 3.5rem;
	margin-bottom: 1.5rem;
	line-height: 1.2;
}

.hero__content h1 span {
	color: #1976d2;
	font-weight: 800;
}

.highlight {
	font-size: 1.4rem;
	line-height: 1.6;
	margin-bottom: 3rem;
	background: linear-gradient(90deg, #1976d2, #4fc3f7);
	-webkit-background-clip: text;
	background-clip: text;
	color: transparent;
	font-weight: 500;
}

.stats {
	display: flex;
	gap: 3rem;
	margin-top: 3rem;
	z-index: 1;
	position: relative;
	justify-content: center;
	flex-wrap: wrap;
}

.stat {
	background: rgba(255, 255, 255, 0.1);
	padding: 1.5rem 2rem;
	border-radius: 0.8rem;
	backdrop-filter: blur(5px);
	min-width: 150px;
}

.stat-number {
	font-size: 2.5rem;
	font-weight: 700;
	color: #4fc3f7;
	margin-bottom: 0.5rem;
}

.stat-label {
	font-size: 1rem;
	opacity: 0.9;
}

@media (max-width: 768px) {
	.hero {
		padding: 4rem 1rem;
	}

	.hero__content h1 {
		font-size: 2.5rem;
	}

	.highlight {
		font-size: 1.2rem;
	}

	.stats {
		flex-direction: column;
		gap: 1.5rem;
	}
}
</style>