<script lang="ts">
	import { supabase } from "$lib/supabaseClient";
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';
	let error = '';
	let isLoading = false;

	async function login() {
		error = '';
		isLoading = true;
		
		try {
			const res = await fetch('/api/auth/sign-in', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			});

			const result = await res.json();
			if (!res.ok) {
				error = result.error;
			} else {
				await goto('/');
			}
		} catch (err) {
			error = 'Error de conexión. Intenta nuevamente.';
		} finally {
			isLoading = false;
		}
	}

	async function loginWithGoogle() {
		error = '';
		isLoading = true;
		try {
			const { error: authError } = await supabase.auth.signInWithOAuth({
				provider: 'google'
			});
			if (authError) throw authError;
		} catch (err) {
			error = 'Error al iniciar sesión con Google';
		} finally {
			isLoading = false;
		}
	}

	function goToRegister() {
		goto('/register');
	}
</script>

<div class="login-container">
	<h1>Login</h1>
	<form on:submit|preventDefault={login} class="login-form">
		<input
			bind:value={email}
			placeholder="Email"
			type="email"
			required
			autocomplete="username"
			disabled={isLoading}
		/>
		<input
			bind:value={password}
			type="password"
			placeholder="Password"
			required
			autocomplete="current-password"
			disabled={isLoading}
		/>
		<button type="submit" class="primary" disabled={isLoading}>
			{isLoading ? 'Loading...' : 'Enter'}
		</button>
		<button 
			type="button" 
			class="google" 
			on:click={loginWithGoogle}
			disabled={isLoading}
		>
			{#if isLoading}
				Loading...
			{:else}
				Enter with Google
			{/if}
		</button>
		
		<div class="register-link">
			Don’t have an account? <a href="/register" on:click|preventDefault={goToRegister}>Register here</a>
		</div>

		{#if error}
			<p class="error">{error}</p>
		{/if}
	</form>
</div>

<style>
.login-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 80vh;
	background: #f7f7fa;
}

.login-form {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	background: #fff;
	padding: 2.5rem 2rem;
	border-radius: 12px;
	box-shadow: 0 4px 24px rgba(0,0,0,0.08);
	min-width: 320px;
	max-width: 90vw;
}

.login-form input {
	padding: 0.75rem 1rem;
	border: 1px solid #d1d5db;
	border-radius: 6px;
	font-size: 1rem;
	transition: border 0.2s;
}

.login-form input:focus {
	border-color: #6366f1;
	outline: none;
}

.login-form button {
	padding: 0.75rem 1rem;
	border: none;
	border-radius: 6px;
	font-size: 1rem;
	cursor: pointer;
	transition: background 0.2s, color 0.2s;
}

.login-form .primary {
	background: #6366f1;
	color: #fff;
	font-weight: 600;
}

.login-form .primary:hover {
	background: #4f46e5;
}

.login-form .google {
	background: #fff;
	color: #444;
	border: 1px solid #d1d5db;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
}

.login-form .google:hover {
	background: #f1f1f1;
}

.login-form .error {
	color: #e11d48;
	margin: 0;
	text-align: center;
	font-size: 0.95rem;
}

.register-link {
	text-align: center;
	margin-top: 1rem;
	font-size: 0.9rem;
	color: #666;
}

.register-link a {
	color: #6366f1;
	text-decoration: none;
	font-weight: 500;
}

.register-link a:hover {
	text-decoration: underline;
}

h1 {
	margin-bottom: 1.5rem;
	color: #22223b;
	font-size: 2rem;
	font-weight: 700;
	text-align: center;
}
</style>