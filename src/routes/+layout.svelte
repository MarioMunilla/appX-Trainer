<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { LayoutData } from './$types';
	import MenuNavegacion from '../components/MenuNavegacion.svelte';
	import Footer from '../components/Footer.svelte';
    import "../app.css";
	import Header from '../components/Header.svelte';

    let { data, children }: { data: LayoutData, children: Snippet } = $props();
</script>

<Header />

<main>
    {@render children()}
</main>

<Footer />