<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { LayoutData } from './$types';
	import MenuNavegacion from '../components/MenuNavegacion.svelte';
	import Footer from '../components/Footer.svelte';
    import "../app.css";
	import Header from '../components/Header.svelte';

    let { data, children }: { data: LayoutData, children: Snippet } = $props();
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
    }

    .main-content {
        flex: 1;
        display: flex;
        flex-direction: column;
    }
</style>