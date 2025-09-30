<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { LayoutData } from './$types'
	import Footer from '../components/Footer.svelte'
	import '../app.css'
	import Header from '../components/Header.svelte'

	let { children }: { data: LayoutData, children: Snippet } = $props()
</script>

<div class="app-layout">
	<Header />

	<main class="main-content">
		{@render children()}
	</main>

	<Footer />
</div>

<style>
	.app-layout {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.main-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	:global(header),
	:global(footer) {
		width: 100%;
		max-width: 100%;
		display: block;
	}
</style>
