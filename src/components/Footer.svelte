<footer class="footer">
	<div class="footer__content">
		<p class="footer__copyright">© 2025 Mario · X-TRAINER</p>
		<div class="footer__divider"></div>
		<p class="footer__tagline">Entrena. Supera. Evoluciona.</p>
	</div>
</footer>

<style>
	.footer {
		background: #1e293b;
		padding: 1.5rem 2rem;
		font-size: 0.9rem;
		color: rgba(255, 255, 255, 0.7);
		text-align: center;
		border-top: 1px solid rgba(25, 118, 210, 0.2);
	}

	.footer__content {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.footer__divider {
		width: 50px;
		height: 1px;
		background: rgba(25, 118, 210, 0.4);
		margin: 0.3rem 0;
	}

	.footer__copyright,
	.footer__tagline {
		margin: 0;
		font-weight: 300;
	}

	.footer__tagline {
		font-size: 0.8rem;
		letter-spacing: 1px;
		text-transform: uppercase;
		color: #4fc3f7;
		opacity: 0.8;
	}

	@media (max-width: 600px) {
		.footer {
			padding: 1rem 1.5rem;
		}

		.footer__content {
			flex-direction: column;
			text-align: center;
			gap: 1rem;
		}
	}
</style>
