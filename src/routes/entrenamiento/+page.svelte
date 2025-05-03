<script lang="ts">
	import ExerciseCard from '../../components/ExerciseCard.svelte';

  export let data;
  </script>
  
  <section>
    <h1>Partes del cuerpo</h1>
    <ul>
      {#each data.bodyParts as bodyPart}
        <li>{bodyPart.name}</li>
      {/each}
    </ul>
  </section>

  <h1>Lista de Ejercicios</h1>
  

  {#each data.exercises as exercise}
    <ExerciseCard 
      name={exercise.name} 
      bodyParts={[exercise.bodyPart]} 
      imgURL={exercise.gifUrl}
    />
  {/each}
  