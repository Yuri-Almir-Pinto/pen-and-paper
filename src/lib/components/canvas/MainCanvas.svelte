<script lang="ts">
  import { onMount } from "svelte";
  import * as PIXI from "pixi.js";
  import { Drawer } from "./canvasDrawer";
  
  let pixiCanvas: HTMLDivElement;

  onMount(mount)

  async function mount() {
    if (pixiCanvas! != null) {
      const app = new PIXI.Application()

      await app.init({ background: '#1099bb', resizeTo: pixiCanvas });

      pixiCanvas.appendChild(app.canvas);

      let drawer = new Drawer(app);
    }
  }

</script>

<div id="PixiCanvas" bind:this={pixiCanvas}>
</div>

<style>
  #PixiCanvas {
    margin: 0;
    padding: 0;
    width: 95vw;
    height: 95vh;

  }
</style>