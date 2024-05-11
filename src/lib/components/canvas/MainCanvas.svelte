<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import * as PIXI from "pixi.js";
  import Konva from "konva";
  import { CanvasHandler } from "./CanvasHandler";
    import { stages } from "konva/lib/Stage";

  let SVG: SVGElement;

  onMount(mount)

  async function mount(): Promise<any> {
    let drawer = new CanvasHandler(SVG);
  }

</script>

<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" bind:this={SVG}>
  <rect width="100" height="100" x="50" y="50"/>
</svg>