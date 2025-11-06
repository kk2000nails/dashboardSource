<script>
  import { onDestroy, onMount } from "svelte";
  import { Menu } from "@lucide/svelte";
  import { routes } from "./routes.svelte";
  import Router, {location } from "svelte-spa-router";
  import Sidebar from "./lib/sidebar.svelte";
  import { addNotification, appState, color, getTimeUntil, loadSettings, notifications, settings } from "./global.svelte"; 
  import { fade, fly, slide } from "svelte/transition";

  import { convertPocketToJson, loadAppointments, pb } from './api.svelte'

  $effect(() => {
      const colorVars = {
          '--header-color': color.headerColor,
          '--text-color': color.textColor,
          '--main-color': color.mainColor,
          '--light-main-color': color.lightMainColor,
          '--dim-main-color': color.dimMainColor,
          '--gray-color': color.grayColor,
          '--input-color': color.inputColor,
          '--bg-color': color.bgColor,
          '--light-bg-color': color.lightBgColor,
          '--lighter-bg-color': color.lighterBgColor,
          '--lightest-bg-color': color.lightestBgColor,
          '--fail-color': color.fail,
      };

      for (const [varName, value] of Object.entries(colorVars)) {
          document.documentElement.style.setProperty(varName, `${value}`);
      }

  })





  // this just runs on load
  onMount(async () => {

    loadSettings();

    appState.appointments = [];
    await loadAppointments();

    pb.collection('appointments').subscribe('*', async (e) => {
      if(e.action == "create"){
        console.log("This is doing stuff!");
        let a = convertPocketToJson(e.record);
        appState.appointments.push(a);
        a.timeUntil = getTimeUntil(a);
      } else if (e.action == 'delete' || e.action == "update"){
        // do this for delete and update because I'm lazy. Change later
        appState.appointments = [];
        await loadAppointments();
        for(let a of appState.appointments){
          a.timeUntil = getTimeUntil(a);
        }
      }
    });


    for(let a of appState.appointments){
      a.timeUntil = getTimeUntil(a);
    }
  })

  onDestroy(async () => {
    pb.collection('appointments').unsubscribe("*");
  });

  setInterval(() => {
    // run this every minute to update time
    for(let a of appState.appointments){
      a.timeUntil = getTimeUntil(a);
    }
  }, 60000);

</script>

<!--
Globally Positioned Elements
-->


<button id='toggleButton' style="{appState.sidebarToggle ? "color: var(--light-main-color);" : "var(--text-color);"}" class='toggleButton {settings.animations ? "anims" : ""}' onclick={() => {appState.sidebarToggle = !appState.sidebarToggle;}}>
  <Menu style='z-index: ' size={40}/>
</button>

<!-- Red dot notification -->

{#if appState.homeNotification}
  <div class="dotNotification"
    transition:fade={{ duration: settings.animations ? 250 : 0 }}
  >

  </div>
{/if}

<!-- Popup notifications -->

<div class="popupArea">

  {#each notifications as n}
    <div class="notification {n.type}"
      transition:fly={{ duration: settings.animations ? 250 : 0, y: -20 }}
    >

    <div class="iconContainer">
      <n.icon />
    </div>
      <p>{n.content}</p>
    </div>

  {/each}
</div>


{#if appState.sidebarToggle}
<label class="blocker" for='toggleButton'
  transition:fade={{ duration: settings.animations ? 250 : 0 }}
>

</label>
{/if}

<!--
Main Container
-->

<div class="globalContainer">

  <!-- 
  Desktop shows for 750px wide screens and above
  -->

  <div class="sidebarContainer desktop">
    <Sidebar />
  </div>
  <div class="sidebarContainer mobile  {settings.animations ? "anims" : ""}" style="{appState.sidebarToggle ? "" : "transform: translateX(calc(-1 * max(50%, 400px)));"}">
    <Sidebar />
  </div>

  <div class="contentContainer">
    <Router {routes} />
  </div>

</div>

<style>

  .popupArea {
    position: fixed;
    width: 100vw;
    display: flex;
    flex-direction: column;
    gap: 10px;
    pointer-events: none;
    align-items: center;
    box-sizing: border-box;
    padding: 25px;
    z-index: 1000000;
  }

  .iconContainer {
    min-width: 24px;
    min-height: 24px;
    display: flex;
    align-items: center;
    place-content: center;
  }

  .notification {
    width: 100%;
    max-width: 600px;
    height: fit-content;
    display: flex;
    box-sizing: border-box;
    padding: 10px;
    border-radius: 5px;
    font-size: 18px;
    gap: 10px;
    align-items: center;
    flex-direction: row;
    padding-right: 30px;
  }

  .notification p {
    margin: 0px;
  }

  .fail {
    background-color: var(--fail-color);
  }

  .success {
    background-color: var(--main-color);
  }

  .globalContainer {
    width: 100vw;
    height: 100svh;
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
  }

  .desktop {
    min-width: 150px;
    max-width: 150px;
  }

  .contentContainer {
    width: 100%;
  }

  .mobile {
    display: none;
    min-width: 150px;
    width: min(50%, 400px);
    position: fixed;
    height: 100%;
    z-index: 9999999999999;
  }

  .mobile.anims {
    transition: transform .5s ease;
  }

  .toggleButton {
    width: fit-content;
    height: fit-content;
    background: none;
    border: none;
    position: fixed;
    right: 20px;
    top: 20px;
    cursor: pointer;
    transition: color 250ms ease;
    display: none;
    z-index: 9999999999999;
    color: var(--header-color);
  }

  .toggleButton.anims {
    transition: color 250ms ease;
  }

  .dotNotification {
    width: 12px;
    height: 12px;
    position: fixed;
    right: 10px;
    top: 10px;
    display: flex;
    background-color: var(--fail-color);
    border-radius: 50%;
    z-index: 9999999999999;
    display: none;
  }

  .blocker {
    position: fixed;
    width: 100vw;
    height: 100vh;
    backdrop-filter: blur(5px);
    background-color: #00000080;
    z-index: 999999999;
  }

  @media (min-width: 750px) {
    .notification {
      transform: translateX(75px)
    }
  }

    @media (max-width: 750px){
      .toggleButton {
        display: block;
      }



      .dotNotification {
        display: block;
      }

      .desktop {
        display: none;
      }

      .mobile {
        display: flex;
      }

      .icon {
        display: none;
      }

    }
</style>
