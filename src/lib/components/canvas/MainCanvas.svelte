<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import * as Handler from "./CanvasHandler";

  let SVG: SVGElement;
  let drawer: Handler.CanvasHandler;
  let app: HTMLDivElement;

  onMount(mount)

  async function mount(): Promise<any> {
    drawer = new Handler.CanvasHandler(SVG);
    drawer.paramsChangedEvent.addEvent(interactionChanged);
  }

  function interactionChanged(params: Handler.DrawingParams): void {
    if (app == null || params.currentMode == null)
      return;

    const toSelect = app.querySelector(`button[data-interaction=${params.currentMode}]`)
    const selected = app.querySelector(`button.selected`);

    if (toSelect == null || selected == null)
      return; 

    selected.classList.remove("selected");
    toSelect.classList.add("selected");
  }

  function interactionButtonClicked(event: MouseEvent) {
    const data = (event.target as HTMLButtonElement).dataset["interaction"];

    if (data !== "Move" && data !== "DrawLine" && data !== "DrawSquare" && data !== "DrawCircle")
      return;

    drawer.setParams({ currentMode: data })
  }

</script>

<div id="app" bind:this={app}>
  <!-- <div id="toolbox">
    <ul>
      <li><button data-interaction="Move" class="selected" tabindex="-1" on:click={interactionButtonClicked}>Move</button></li>
      <li><button data-interaction="DrawLine" tabindex="-1" on:click={interactionButtonClicked}>Line</button></li>
      <li><button data-interaction="DrawSquare" tabindex="-1" on:click={interactionButtonClicked}>Square</button></li>
      <li><button data-interaction="DrawCircle" tabindex="-1" on:click={interactionButtonClicked}>Circle</button></li>
    </ul>
  </div>
  <div id="options">
    <input type="range" min="1" max="100" value="50">
  </div> -->
  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" bind:this={SVG}>
    <rect width="100" height="100" x="50" y="50"/>
  </svg>
</div>

<style>
  #app {
    width: 100%;
    height: 100%;
    position: relative;
  }

  #toolbox, #options {
    border: 1px solid gray;
    position: absolute;
    border-radius: 10px;
    background-color: white;
    padding: 15px;
  }

  #toolbox {
    left: 50%;
    top: 10px;
    transform: translateX(-50%);
  }

    #toolbox ul {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      gap: 12px;
      padding: 0;
      margin: 0;
    }

    #toolbox ul {
      list-style: none;
    }

    #toolbox ul button {
      display: inline;
      cursor: pointer;
      border: 1px solid gray;
      padding: 2px 6px;
      border-radius: 5px;
    }

  #options {
    left: 10px;
    bottom: 10px;
  }

  .selected {
    background-color: rgba(200, 255, 255, 0.6);
  }
</style>