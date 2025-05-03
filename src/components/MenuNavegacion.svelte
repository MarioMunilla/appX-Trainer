<script>
    export let items= {}
  
    const entradas=Object.entries(items)
    // [["/entrenamiento","Entrenamiento"],    
  </script>
  
  {#each entradas as [url,texto]}
  <nav>
    <a href={url}>{texto}</a>
  </nav>
  {/each}
  
    
    <style>
      nav {
        background-color: #333; 
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
        display: flex; 
        justify-content: space-around;
        flex-direction: row;
        padding: 5px 0;
      }
    
      nav a {
        color: #fff; 
        text-decoration: none; 
        transition: color 0.3s; 
        border-radius: 5px; 
        transition: background-color 0.3s; 
      }
    
      nav a:hover {
        color: #b7b7b7; 
      }
    </style>