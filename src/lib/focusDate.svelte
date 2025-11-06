<script>
    import { onMount } from "svelte";
    import { Clock, HeartCrack} from "@lucide/svelte";
    import { appState, getRandomItem, settings, viewAppt } from "../global.svelte";

const collisionManager = (array) => {
    // if an item is within the threshold minutes of an item before, group it into a row
    const groupingThreshold = 0;

    // this should group appointments into rows pretty much
    let output = [];

    let maxTime = 0;
    let offset = 0;
    for(let appt of array){
        // for each item, check if there is a row with a matching time
        let newRow = true;
        for(let i of output){
            if(appt.time >= i.time && appt.time <= i.time + i.maxSize + groupingThreshold){
                i.data.push(appt);
                if(appt.duration > i.maxSize){
                    i.maxSize = appt.duration;
                }
                newRow = false;
                break;
            }
        }

        if(newRow) {
            if(appt.time > maxTime){
                offset = 0;
            } else {
                offset++;
            }

            output.push({
                time: appt.time,
                data: [appt],
                offset: offset,
                maxSize: appt.duration
            })

        }
        if(appt.time + appt.duration > maxTime){
            maxTime = appt.time + appt.duration;
        }

    }

    return output;
}

let appointments = $derived(collisionManager(appState.focusAppt.appt.toSorted(
    (a, b) => {
        return a.time < b.time ? -1 : a.time > b.time ? 1 : 0;
    }
))); 


const threshhold = (a, b) => {
    if(a - b> 0){
        return a - b;
    }
    return 0;
}

let segments = $derived(Math.ceil((1440 - threshhold((appState.focusAppt.appt.toSorted((a, b) => {
    if(a.time > b.time){
        return 1;
    } else if (a.time < b.time){
        return -1;
    }
    return 0;
})[0].time), 0)) / 60));

const getDateSuffix = (date) => {
    if(date % 10 == 1){
        return "st";
    } else if(date % 10 == 2){
        "nd";
    } else if (date % 10 == 3){
        return 'rd';
    }
    return "th";
}

const getTimeAndDuration = (a) => {
    let output = "";
    let hours = Math.floor(a.time / 60);
    let minutes = a.time % 60;
    let endHours = Math.floor((a.time + a.duration) / 60);
    let endMinutes = (a.time + a.duration) % 60;
    if(settings.clock24hr){
        output += `${hours}:${minutes < 10 ? `0${minutes}` :minutes} - `;
        output += `${endHours}:${endMinutes < 10 ? `0${endMinutes}` : endMinutes}`;
    } else {
        if(hours > 12){
            hours -= 12;
        }
        if(endHours > 12){
            endHours -= 12;
        }
        output += `${hours}:${minutes < 10 ? `0${minutes}` :minutes} - `;
        output += `${endHours}:${endMinutes < 10 ? `0${endMinutes}` : endMinutes}`;
    }

    return output;
}


const getTime = (time) => {
    let output = "";
    let hours = Math.floor(time / 60);
    let minutes = time % 60;
    if(settings.clock24hr){
        output += `${hours}:${minutes < 10 ? `0${minutes}` :minutes}`;
    } else {
        if(hours > 12){
            hours -= 12;
        }
        output += `${hours}:${minutes < 10 ? `0${minutes}` :minutes}`;
    }

    return output;
}

   

</script>


<div class="main">
    {#if appState.focusAppt}

        <div class="headerRow">
            <h1>{appState.focusAppt.month} {appState.focusAppt.date}{getDateSuffix(appState.focusAppt.date)}</h1>
        </div>

        <div class="timeDisplay">

            <div class="timeRow">
                {#each {length: 24} as _, i}
                    <h3>{getTime(i * 60)}</h3>
                    <h4>{getTime((i * 60) + 30)}</h4>
                {/each}
            </div>

            <div class="apptArea">
                {#each appointments as row, rowIndex}
                    {#each row.data as appt, apptIndex}
                        {@const start = (appt.time / 1440) * 100}
                        {@const duration = (appt.duration / 1440) * 100}
                        {@const width = (100 / row.data.length)}
                        <label for='r{rowIndex}a{apptIndex}' class="appt" style="z-index: {rowIndex}; top: {start}%; left: calc({width * apptIndex}% + {row.offset * 12}px - {((row.offset * 12) / row.data.length) * apptIndex}px + 10px); height: {duration}%; width: calc({width}%  - {(row.offset * 12) / row.data.length}px - 10px);">
                            <p class='apptHeader'>{appt.clientName}</p>

                            {#if appt.duration >= 45}
                                <div class="apptInfo">

                                    <div class='icon'>
                                        <Clock size={18} /> 
                                    </div> 
                                    <p class='apptTime'>{getTimeAndDuration(appt)}</p>

                                </div>
                            {/if}
    
                        </label>
                        <button id='r{rowIndex}a{apptIndex}' onclick={() => viewAppt(appt)} class='invis'>View appointment</button>
                    {/each}
                {/each}

                {#each {length: 48} as _, i}
                    <div class="row">
                    </div>
                {/each}
            </div>

        </div>
        
    {:else}

        <div class="error">
            <h1>{getRandomItem(['Zoinks', 'Uh Oh', 'Yikes', 'Oops', 'Gee Whiz', 'Jinkies', 'Jeepers'])}... <HeartCrack size={30}/></h1>
            <p>Something went wrong... <a href='/#/'>Go back</a> to the main page</p>
        </div>

    {/if}

</div>



<style>


    .timeDisplay {
        width: 100%;
        height: fit-content;
        display: flex;
        flex-direction: row;
    }

    .timeRow {
        height: 100%;
        display: flex;
        flex-direction: column;
        padding-left: 30px;
        padding-right: 20px;
        box-sizing: border-box;

    }

    
    .timeRow h3 {
        min-height: 50px;
        margin: 0px;
        color: var(--header-color);
    }

    .timeRow h4 {
        min-height: 50px;
        margin: 0px;
        color: var(--gray-color);
    }

    .appt {
        display: flex;
        position: absolute;
        box-sizing: border-box;
        border-left: 4px solid var(--main-color);
        padding-left: 20px;
        font-size: 18px;
        flex-direction: column;
        padding-top: 10px;
        background-color: var(--input-color);
        color: var(--header-color);
        backdrop-filter: blur(2px);
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        overflow: hidden;
        min-width: fit-content;
        padding-right: 10px;
    }

    .appt:hover {
        z-index: 999 !important;
        cursor: pointer;
    }

    .apptHeader {
        font-size: 20px; 
        font-weight: bold; 
        z-index: 15;
    }

    .appt p {
        margin: 0px;
    }

    .apptTime {
        align-items: center; 
        display: flex; 
        gap: 5px; 
    }

    .icon {
        justify-content: center;
        display: flex;
        align-items: center;
    }

    .apptInfo {
        width: 100%;
        display: flex;
        align-items: center;
        flex-direction: row;
        gap: 5px;
        box-sizing: border-box;
        z-index: 9999;
    }

    .apptArea {
        margin-top: 13px;
        height: fit-content;
        display: flex;
        flex-direction: column;
        position: relative;
        width: 100%;
        box-sizing: border-box;
        margin-right: 10px;
    }

    .row {
        min-height: 50px;
        width: 100%;
        border-top: 2px solid var(--lighter-bg-color);
        box-sizing: border-box;
    }

    @media (max-width: 750px){
        .apptHeader {
            font-size: 18px;
        }

        .apptTime {
            font-size: 16px;
        }

        .icon {
            zoom: 0.888888888889;
        }

        .appt {
            padding-left: 10px;
        }

    }
    
    @media (max-width: 600px){
        .apptHeader {
            font-size: 16px;
        }
        
        .apptTime {
            font-size: 14px;
        }

        .icon {
            zoom: 0.777777777778;
        }
    }

    @media (max-width:  450px){    
        .apptHeader {
            font-size: 14px;
        }

        .apptTime {
            font-size: 12px;
        }

        .icon {
            zoom: 0.666666666667;
        }
    }

</style>
