<script lang="ts">
	import Login from "$lib/components/Login.svelte";
	import MenuNavegacion from "./MenuNavegacion.svelte";
</script>

<header>
    <MenuNavegacion
        items={{
            '/exercise': 'Exercise',
            '/routine':'Routine',
            '/login':Login 
        }}
    />
</header>