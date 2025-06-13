<script lang="ts">
    let email = '';
    let password = '';
    let error = '';
    let isLoading = false;

    async function register() {
        error = '';
        isLoading = true;
        
        try {
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
                window.location.href = '/login';
            }
        } catch (err) {
            error = 'Error de conexión. Intenta nuevamente.';
        } finally {
            isLoading = false;
        }
    }
</script>

<div class="login-container">
    <h1>Create Account</h1>
    <form on:submit|preventDefault={register} class="login-form">
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
            autocomplete="new-password"
            disabled={isLoading}
        />
        <button type="submit" class="primary" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'To Register'}
        </button>
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

.login-form .error {
	color: #e11d48;
	margin: 0;
	text-align: center;
	font-size: 1.2em;
}

h1 {
	margin-bottom: 1.5rem;
	color: #22223b;
	font-size: 2rem;
	font-weight: 700;
	text-align: center;
}
</style>
