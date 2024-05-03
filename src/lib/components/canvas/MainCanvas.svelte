<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import * as PIXI from "pixi.js";
  import { CanvasHandler } from "./CanvasHandler";
  
  let pixiCanvas: HTMLDivElement;
  const app = new PIXI.Application()

  onMount(mount)
  onDestroy(app.destroy);

  async function mount() {
    if (pixiCanvas! != null) {
      await app.init({ background: '#1099bb', resizeTo: pixiCanvas });

      pixiCanvas.appendChild(app.canvas);

      let drawer = new CanvasHandler(app)
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