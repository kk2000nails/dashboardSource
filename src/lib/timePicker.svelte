<script>

    import { ChevronLeft, ChevronRight } from "@lucide/svelte";
    import { fly, slide } from "svelte/transition";
    import { settings } from "../global.svelte";

    export let minutes;
    export let hours;
    export let id; // this is such a hack but i dont even care atp

    const changeHours = (dir) => {
      hours = (24 + hours + dir) % 24;
    }

    const changeMinutes = (dir) => {
      minutes = (60 + minutes + dir) % 60;
    }

</script>



<div class="timePicker"
  transition:slide={{ duration: settings.animations ? 250 : 0 }}
>

    <label class='arrowPicker' for='leftStartHour{id}'>
    <ChevronLeft size={22} />
    </label>
    <p>{hours < 10 ? `0${hours}` : hours}</p>
    <label class='arrowPicker' for='rightStartHour{id}'>
    <ChevronRight size={22} />
    </label>

    <button id='leftStartHour{id}' class='invis' onclick={() => changeHours(-1)}>Left Hour</button>
    <button id='rightStartHour{id}'class='invis' onclick={() => changeHours(1)}>Right Hour</button>

    <p>:</p>
    
    <label class='arrowPicker' for='leftStartMin{id}'>
    <ChevronLeft size={22} />
    </label>
    <p>{minutes < 10 ? `0${minutes }` : minutes }</p>

    <label class='arrowPicker' for='rightStartMin{id}'>
    <ChevronRight size={22} />
    </label>

    <button id='leftStartMin{id}' class='invis' onclick={() => changeMinutes(-5)}>Left Min</button>
    <button id='rightStartMin{id}'class='invis' onclick={() => changeMinutes(5)}>Right Min</button>

</div>


<style>

  .timePicker {
    display: flex;
    border-radius: 10px;
    padding: 10px;
    box-sizing: border-box;
    height: fit-content;
    background-color: var(--light-bg-color);
    width: 100%;
    margin-top: 5%;
    justify-content: space-between;
    flex-direction: row;
    padding-left: 40px;
    padding-right: 40px;
    gap: 5px;
    color: var(--header-color);
    font-weight: bold;
    align-items: center;
  }
  
  .timePicker p {
    margin: 0px;
  }

  .arrowPicker {
    height: fit-content;
    display: flex;
    cursor: pointer;
    color: var(--text-color);
  }


</style>