<script lang="ts">
  import { onMount } from "svelte";
  import CanvasController from "./Controllers/CanvasController";

  let SVG: SVGElement;
  let drawer: CanvasController;
  let app: HTMLDivElement;

  onMount(mount)

  async function mount(): Promise<any> {
    drawer = new CanvasController(SVG);
  }

</script>

<div id="app" bind:this={app}>
  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" bind:this={SVG} name="canvasOriginSvg">
    <style>
      .selected {
        padding: 3px;
        outline: 2px solid cyan;
      }
    </style>
    <rect width="100" height="100" x="50" y="50"/>
  </svg>
</div>

<style>
  #app {
    width: 100%;
    height: 100%;
    position: relative;
  }
</style>