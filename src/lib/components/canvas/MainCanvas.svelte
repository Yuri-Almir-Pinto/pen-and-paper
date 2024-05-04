<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import * as PIXI from "pixi.js";
  import Konva from "konva";
  import { CanvasHandler } from "./CanvasHandler";
    import { stages } from "konva/lib/Stage";

  let Canvas: HTMLDivElement;
  let app: Konva.Stage;

  onMount(mount)

  async function mount(): Promise<any> {
    if (Canvas == null) {
      return new Konva.Stage({ container: "canvas" }).destroy;
    }

    app = new Konva.Stage({ 
      container: "canvas", 
      width: Canvas.clientWidth,
      height: Canvas.clientHeight
    });

    let drawer = new CanvasHandler(app)

    return app.destroy;
  }

  function updateCanvasSize() {
    if (Canvas == null || app == null) return;

    app.width(Canvas.clientWidth);
    app.height(Canvas.clientHeight);
  }
  
  window.onresize = updateCanvasSize;
</script>

<div id="canvas" bind:this={Canvas}>
</div>

<style>
  #canvas {
    margin: 0;
    padding: 0;
    width: 95vw;
    height: 95vh;
    background-color: cyan;
  }
</style>