<script>
	export let items = {};
	let isMenuOpen = false;
	const entradas = Object.entries(items);

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
</script>

<nav class="nav">
	<a href="/" class="nav__logo-link" aria-label="Inicio">
		<img src="/favicon.png" alt="X-Trainner Logo" class="nav__logo" />
	</a>

	<button class="nav__toggle" on:click={toggleMenu} aria-label="Menú">
		☰
	</button>

	<div class="nav__links" class:nav__links--open={isMenuOpen}>
		{#each entradas as [url, texto]}
			<a class="nav__link" href={url}>{texto}</a>
		{/each}
	</div>
</nav>

<style>
	.nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #111827;
		padding: 1.2rem 2rem;
		box-shadow: 0 0.4rem 1rem rgba(0, 0, 0, 0.2);
		border-bottom: 0.2rem solid #1976d2;
		flex-wrap: wrap;
		position: relative;
	}

	.nav__logo {
		width: 4.5rem;
		height: 4.5rem;
		border-radius: 0.8rem;
		cursor: pointer;
	}

	.nav__toggle {
		display: none;
		background: none;
		border: none;
		color: #fff;
		font-size: 2.4rem;
		cursor: pointer;
	}

	.nav__links {
		display: flex;
		gap: 1.5rem;
		justify-content: center;
		align-items: center;
		flex-grow: 1;
	}

	.nav__link {
		color: #fff;
		text-decoration: none;
		font-size: 1.6rem;
		font-weight: 600;
		padding: 0.8rem 1.2rem;
		border-radius: 0.5rem;
		transition: background-color 0.3s ease, transform 0.2s ease;
		text-align: center;
	}

	.nav__link:hover {
		background-color: #1976d2;
		transform: scale(1.05);
	}

	@media (max-width: 768px) {
		.nav__toggle {
			display: block;
		}

		.nav__links {
			display: none;
			flex-direction: column;
			width: 100%;
			background-color: #111827;
			position: absolute;
			top: 100%;
			left: 0;
			padding: 1.5rem 2rem;
			box-shadow: 0 0.4rem 1.2rem rgba(0, 0, 0, 0.2);
			z-index: 10;
		}

		.nav__links--open {
			display: flex;
		}

		.nav__link {
			width: 100%;
			font-size: 1.4rem;
			padding: 1rem 0;
		}
	}
</style>
