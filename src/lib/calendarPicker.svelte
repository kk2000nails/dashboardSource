<script>

  import { ChevronLeft, ChevronRight } from "@lucide/svelte";
  import { settings } from "../global.svelte";
  import { fly, slide } from "svelte/transition";

  export let month;
  export let year;
  export let date;

  const monthLength = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  } 

  const calendarData = (month, year) => {
    // determine the number of rows needed

    const length = monthLength(month, year);
    const offset = firstDayOfMonth(month, year); // 0 = sunday, 1 = monday, etc.
    const rows = Math.ceil((offset + length) / 7);
    let endPadding = (rows * 7) - (offset + length);
  
    let output = [];
    // pad the start
    for(let i = 0; i < offset; i++){
      output.push(-1);
    }

    for(let i = 0; i < length; i++){
      output.push(i + 1);
    }

    for(let i = 0; i < endPadding; i++){
      output.push(-1);
    }

    return {
      rows: rows,
      data: output
    }
  }

  const firstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  }

  let scrollMonth = (dir) => {
    date = 1;
    month = (12 + month + dir) % 12;
  }

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];


</script>


<div class="main"
  transition:slide={{ duration: settings.animations ? 500 : 0}}
>

    <div class="topRow">
      <div class="monthSelector">
        <label class='arrowPicker' for='leftMonth'>
          <ChevronLeft size={22} />
        </label>
        <button id='leftMonth' onclick={() => scrollMonth(-1)} class='invis'>Go Left</button>
        <p>{months[month]}</p>
        <label class='arrowPicker' for='rightMonth'>
          <ChevronRight size={22} />
        </label>
        <button id='rightMonth' onclick={() => scrollMonth(1)} class='invis'>Go Right</button>
      </div>
      <div class="yearSelector">
        <input type='text' bind:value={year}>
      </div>
    </div>

    <div class="calendar">
      {#if month != null && year != null}
        {@const data = calendarData(month, year)}

        {#each {length: data.rows} as _, r}
          <div class="calRow">
            {#each {length: 7} as _, index}
              {@const thing = data.data[(r * 7) + index]}
              <label class="date {thing != -1 ? "selectable" : ""}" style="{date == thing ? "background-color: var(--main-color);" : ""}" for='select{thing}'>
                <p style="{thing == -1 ? "opacity: 0.5;" : ""}">{thing == -1 ? '-' : thing}</p>
              </label>
              {#if thing != -1}
                <button id="select{thing}" onclick={() => {date = thing}} class='invis'>Select</button>
              {/if}
            {/each}
          </div>
        {/each}
      {/if}

    </div>

</div>


<style>

  .main * {
    color: var(--header-color);
  }

  .calendar {
    display: flex;
    border-radius: 10px;
    padding: 30px;
    box-sizing: border-box;
    height: fit-content;
    background-color: var(--light-bg-color);
    width: 100%;
    flex-direction: column;
    gap: 5px;
    color: var(--header-color);
  }

  .selectable {
    cursor: pointer;
    transition: background-color .25s;
  }

  .selectable:hover {
    background-color: var(--lighter-bg-color);
  }

  .calRow {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    box-sizing: border-box;
  }

  .invis {
    position: fixed;
    left: 0px;
    scale: 0;
  }

  .topRow {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: fit-content;
    justify-content: space-between;
  }

  .date {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
  }

  .date p {
    font-weight: bold;
    margin: 0px;
  }

  .monthSelector {
    width: 65%;
    max-width: 65%;
    background-color: var(--light-bg-color);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 100%;
    border-radius: 10px;
    box-sizing: border-box;
    padding: 15px;
    align-items: center;
  }

  .yearSelector {
    width: 30%;
    background-color: var(--light-bg-color);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: fit-content;
    border-radius: 10px;
    box-sizing: border-box;
    padding: 15px;
    align-items: center;
  }

  .yearSelector input {
    border: none;
    background: none;
    font-weight: 500;
    font-size: 18px;
    padding: 0px;
    height: 27px;
    width: 100%;
    outline: none;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .arrowPicker {
    height: fit-content;
    display: flex;
    cursor: pointer;
    color: var(--text-color);
  }

  .monthSelector p {
    font-weight: 500;
    margin: 0px;
    font-size: 18px;
  }

  .main {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    margin-top: 15px;
  }

  button {
    border: none;
    border-radius: 5px;
    width: fit-content;
    box-sizing: border-box;
    padding: 10px;
    cursor: pointer;
  }
  
  @media (max-width: 750px){
    p, input {
      font-size: 16px !important;
    }

    .date {
      width: 40px;
      height: 40px;
    }

  }

</style>