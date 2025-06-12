<script lang="ts">
	let email = '';
	let password = '';
	let error = '';

	async function register() {
		const res = await fetch('/api/auth/sign-up', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		});

		const result = await res.json();
		if (!res.ok) {
			error = result.error;
		} else {
			alert('Revisa tu correo para confirmar tu cuenta.');
		}
	}
</script>

<h1>Registro</h1>
<input bind:value={email} placeholder="Email" />
<input bind:value={password} type="password" placeholder="Contraseña" />
<button on:click={register}>Registrar</button>
<p style="color: red">{error}</p>
