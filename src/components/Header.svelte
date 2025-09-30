<script lang="ts">
	import Login from '$lib/components/Login.svelte'
	import MenuNavegacion from './MenuNavegacion.svelte'
</script>

<header>
	<MenuNavegacion
		items={{
			'/exercise': 'Exercise',
			'/routine': 'Routine',
			'/login': Login
		}}
	/>
</header>

<style>
    header {
        background: #0f1a2b;
    }

    :global(header) {
        width: 100%;
    }
</style>
