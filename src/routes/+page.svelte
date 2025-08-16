<script lang="ts">
  import { invoke } from "@tauri-apps/api/core";

  let name = $state("");
  let greetMsg = $state("");

  async function greet(event: Event) {
    event.preventDefault();
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    greetMsg = await invoke("greet", { name });
  }
</script>

<main class="w-screen h-screen bg-black text-white">
  data!
  <button onclick={greet} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
    Click me
  </button>
  <p>{greetMsg}</p>
</main>

