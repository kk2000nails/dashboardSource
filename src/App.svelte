<script>
  import { onDestroy, onMount } from "svelte";
  import { Menu } from "@lucide/svelte";
  import { routes } from "./routes.svelte";
  import Router, {location } from "svelte-spa-router";
  import Sidebar from "./lib/sidebar.svelte";
  import { appState, getRandomItem, getTimeUntil, random } from "./global.svelte"; 
  import { fade } from "svelte/transition";

  import { convertPocketToJson, loadAppointments, pb } from './api.svelte'




  // this just runs on load
  onMount(async () => {
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


<button id='toggleButton' style="{appState.sidebarToggle ? "color: var(--light-main-color);" : "var(--text-color);"}" class='toggleButton' onclick={() => {appState.sidebarToggle = !appState.sidebarToggle;}}>
  <Menu style='z-index: ' size={40}/>
</button>

{#if appState.homeNotification}
  <div class="notification"
    transition:fade={{ duration: 250 }}
  >

  </div>
{/if}

{#if appState.sidebarToggle}
<label class="blocker" for='toggleButton'
  transition:fade={{ duration: 250 }}
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
  <div class="sidebarContainer mobile" style="{appState.sidebarToggle ? "" : "transform: translateX(calc(-1 * max(50%, 400px)));"}">
    <Sidebar />
  </div>

  <div class="contentContainer">
    <Router {routes} />
  </div>

</div>

<style>
  .globalContainer {
    width: 100vw;
    height: 100lvh;
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
    transition: transform .5s ease;
    min-width: 150px;
    width: min(50%, 400px);
    position: fixed;
    height: 100%;
    z-index: 9999999999999;
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

  .notification {
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

    @media (max-width: 750px){
      .toggleButton {
        display: block;
      }

      .notification {
        display: block;
      }

      .desktop {
        display: none;
      }

      .mobile {
        display: flex;
      }

    }
</style>
