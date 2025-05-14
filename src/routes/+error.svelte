<script lang="ts">
	import { page } from '$app/stores';

	const status = $state($page.status);
	const error = $state($page.error);

	const messages: Record<number, string> = {
		400: 'Solicitud incorrecta',
		401: 'No autorizado',
		403: 'Prohibido',
		404: 'Página no encontrada',
		500: 'Error del servidor',
		503: 'Servicio no disponible'
	};

	const getMessage = (status: number) => messages[status] ?? 'Error desconocido';
</script>

<div class="error-wrapper">
	<div class="error-content">
		<h1>{status} - {getMessage(status)}</h1>
		<img src="/assets/animations/error.gif" alt="Error animado" class="error-image" />

		{#if status === 404}
			<p>Lo sentimos, no pudimos encontrar esta página.</p>
		{:else}
			<p>{error?.message || 'Algo salió mal'}</p>
		{/if}

		<a href="/" class="back-button">Volver al inicio</a>
	</div>
</div>

<style>
	.error-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		background-color: #fafafa;
		padding: 2rem;
		text-align: center;
		font-family: system-ui, sans-serif;
	}

	.error-content {
		max-width: 40rem;
		width: 100%;
		background-color: #ffffff;
		border-radius: 1rem;
		box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.1);
		padding: 2rem;
	}

	h1 {
		font-size: 2rem;
		color: #d32f2f;
		margin-bottom: 1.5rem;
	}

	.error-image {
		width: 100%;
		max-width: 20rem;
		margin: 0 auto 1.5rem;
		display: block;
	}

	p {
		font-size: 1.125rem;
		color: #444;
		margin-bottom: 2rem;
	}

	.back-button {
		display: inline-block;
		font-size: 1rem;
		padding: 0.75rem 1.5rem;
		background-color: #1976d2;
		color: #fff;
		text-decoration: none;
		border-radius: 0.5rem;
		transition: background-color 0.3s ease;
	}

	.back-button:hover {
		background-color: #1565c0;
	}

	@media (max-width: 30rem) {
		.error-content {
			padding: 1.5rem;
		}

		h1 {
			font-size: 1.5rem;
		}

		p {
			font-size: 1rem;
		}
	}
</style>
