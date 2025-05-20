<script>
  export let items = {};

  const entradas = Object.entries(items);
</script>

<nav class="nav">
  <img src="/favicon.png" alt="X-Trainner Logo" class="nav__logo" />
  {#each entradas as [url, texto]}
    <a class="nav__link" href={url}>{texto}</a>
  {/each}
</nav>

<style>
  .nav {
    background-color: #111827;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    padding: 1rem 2rem;
    box-shadow: 0 0.2rem 0.6rem rgba(0, 0, 0, 0.2);
    border-bottom: 0.2rem solid #1976d2;
  }

  .nav__logo {
    width: 4.5rem;
    height: 4.5rem;
    border-radius: 20%;
    font-size: 4em;
    object-fit: cover;
  }

  .nav__link {
    color: #ffffff;
    text-decoration: none;
    font-weight: 600;
    font-size: 1rem;
    padding: 0.6rem 1.2rem;
    border-radius: 0.5rem;
    transition: background-color 0.3s ease, transform 0.2s ease;
  }

  .nav__link:hover {
    background-color: #1976d2;
    transform: scale(1.05);
  }

  @media (max-width: 40rem) {
    .nav {
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .nav__link {
      font-size: 1rem;
      width: 100%;
      text-align: center;
    }
  }
</style>
