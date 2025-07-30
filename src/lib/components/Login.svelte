<script lang="ts">
	import { supabase } from '$lib/supabaseClient'
	import type { UserResponse } from '@supabase/supabase-js'
	import { writable } from 'svelte/store'

	const reloadUser = writable(0)

	function getUserPromise() {
		return supabase.auth.getUser()
	}

	let isLogged: Promise<UserResponse>

	reloadUser.subscribe(() => {
		isLogged = getUserPromise()
	})

	supabase.auth.onAuthStateChange(() => {
		reloadUser.update(n => n + 1)
	})

	async function logout() {
		await supabase.auth.signOut()
		reloadUser.update(n => n + 1) // refresca el usuario
	}
</script>

{#await isLogged}
	<p>...</p>
{:then value}
	{#if value.data.user}
		<span>{value.data.user.user_metadata?.full_name ?? value.data.user.email}</span>
		<button aria-label="Cerrar sesión" on:click={logout} class="logout-btn" title="Cerrar sesión">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="2em"
				height="2em"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
				<polyline points="16 17 21 12 16 7" />
				<line x1="21" y1="12" x2="9" y2="12" />
			</svg>
		</button>
	{:else}
		<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
			<path
				fill="currentColor"
				d="M9 2h9c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H9c-1.1 0-2-.9-2-2v-2h2v2h9V4H9v2H7V4c0-1.1.9-2 2-2"
			/>
			<path fill="currentColor" d="M10.09 15.59L11.5 17l5-5l-5-5l-1.41 1.41L12.67 11H3v2h9.67z" />
		</svg>
	{/if}
{:catch error}
	<p>{error}</p>
{/await}

<style>
	.logout-btn {
		background: none;
		border: none;
		cursor: pointer;
		padding-left: 0.5rem;
		color: #1976d2;
		vertical-align: middle;
	}

	.logout-btn:hover {
		color: #e11d48;
	}
</style>
