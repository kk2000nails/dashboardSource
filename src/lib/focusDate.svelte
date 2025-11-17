<script>
    import { onMount, tick } from "svelte";
    import { Clock, HeartCrack, Printer} from "@lucide/svelte";
    import { appState, getRandomItem, newData, settings, viewAppt } from "../global.svelte";
    import { loadTechnicians } from "../api.svelte";
    import { replace } from 'svelte-spa-router';
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

const to_bottom = () => {
    let thing = document.getElementById('')
    thing.scrollTop = thing.scrollHeight;
}

onMount(async () => {

    await loadTechnicians();

    let first = 10000;
    for(let i of appointments){
        let time = (i.time / 1440) * 100;
        if(time < first){
            first = time;
        }
    }

})

const generateData = (data) => {
    let output = [];
    for(let t of appState.technicians){
        let temp = [];
        for(let i = 0; i < 41; i++){
            temp.push({size: 1, appt: null, start: i * 15});
        }
        output.push({name: t.name, data: temp});
    }
    for(let a of data.appt){
        for(let i of output){
            if(a.tech == i.name){
                // get index
                const index = (a.time - 570) / 15;
                let duration = a.duration / 15;
                i.data[index].appt = a;
                i.data[index].size = duration;
                i.data.splice(index + 1, duration - 1);
                break;
            }
        }
    }

    return output;
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

let data = $derived(generateData(appState.focusAppt));

   //66


    const focusThing = (a, t, start) => {
        newData.technician = t;
        newData.date = appState.focusAppt.date;
        newData.month = appState.focusAppt.month;
        newData.startHours = Math.floor((start + 570) / 60);
        newData.startMinutes = (start + 570) % 60;
        if(a == null){
            // if there is not an appointment, go to the new one
            newData.endHours = Math.floor((start + 570 + 45) / 60);
            newData.endMinutes = (start + 570 + 45) % 60;
            replace('/new');
        } else {
            viewAppt(a);          
        }

    }

    const printSheet = () => {
        if(settings.notifications){
            alert("Printing may not work properly on mobile devices and certain browsers. Make sure you're on a computer and using chrome for best results.")
        }
        window.print();
    }

    const printBlank = async () => {
        isBlank = true;
        await tick();
        if(settings.notifications){
            alert("Printing may not work properly on mobile devices and certain browsers. Make sure you're on a computer and using chrome for best results.")
        }
        window.print();
        isBlank = false;
    }

    let isBlank = $state(false);

</script>


<div class="main" id='print'>
    {#if appState.focusAppt}

        <div class="headerRow noPrint">
            <h1>{months[appState.focusAppt.month]} {appState.focusAppt.date}{getDateSuffix(appState.focusAppt.date)}</h1>
        </div>

        <div class="control noPrint">
            <button onclick={printSheet} class='noPrint nextButton'>
                <Printer size={20} />
                Print
            </button>
            <button onclick={printBlank} class='noPrint nextButton'>
                <Printer size={20} />
                Print Blank Sheet
            </button>
        </div>



        <div class="timeDisplay">

            <div class="timeRow">
                <div class="timeBox"></div>
                {#each {length: 41} as _, i}
                    <div class="timeBox">
                        <h3>{getTime(i * 15  + 570)}</h3>
                    </div>

                {/each}
            </div>

            <div class="apptArea">

                {#each data as d}

                    <div class="col">

                        <div class="colHeader">
                            <p>{d.name}</p>
                        </div>

                        {#if !isBlank}

                            <!-- svelte-ignore a11y_no_static_element_interactions -->
                            {#each d.data as i, index}
                                <!-- svelte-ignore a11y_click_events_have_key_events -->
                                <div class="row" style="min-height: {i.size * 25}px" onclick={() => focusThing(i.appt, d.name, i.start)}>
                                    <p style='margin: 0px'>{i.appt != null ? i.appt.clientName : ""}</p>
                                </div>
                            {/each}

                        {:else}
                            {#each {length: 41} as i, index}
                                <div class="row" style="min-height: 25px">
                                </div>
                            {/each}
                        {/if}

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

    
    .nextButton {
        width: fit-content;
        background-color: var(--lighter-bg-color);
        border: none;
        font-size: 20px;
        color: var(--header-color);
        box-sizing: border-box;
        padding: 10px;
        border-radius: 10px;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        display: flex;
        gap: 10px;
    }

    .control {
        margin-left: auto;
        margin-right: auto;
        gap: 10px;
        box-sizing: border-box;
        display: flex;
    }

    .col {
        border-right: 1px solid var(--gray-color);
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .col p {
        margin: 0px;
    }

    .colHeader {
        align-items: center;
        justify-content: center;
        display: flex;
        color: var(--header-color);
    }

    .timeDisplay {
        width: 100%;
        height: fit-content;
        display: flex;
        flex-direction: row;
        box-sizing: border-box;
        border-top: 1px solid var(--gray-color);
    }

    .timeRow {
        height: 100%;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        border-right: 1px solid var(--gray-color);
        border-left: 1px solid var(--gray-color);
    }

    .timeBox {
        border-bottom: 1px solid var(--gray-color); 
        box-sizing: border-box;
        height: fit-content;
        min-height: 25px;
        justify-content: center;
        align-items: center;
        display: flex;
        padding: 5px;
    }

    .timeBox * {
        color: var(--header-color);
    }

    .row * {
        color: var(--header-color);
    }


        
    .timeBox h3 {
        margin: 0px;
        font-size: 14px;
        line-height: 0px;
        color: var(--header-color);
        width: 100%;
        max-height: 25px;
        display: flex;
    }

    .apptArea {
        height: fit-content;
        display: flex;
        flex-direction: row;
        position: relative;
        width: 100%;
        box-sizing: border-box;
    }

    .row {
        width: 100%;
        border-top: 1px solid var(--gray-color);
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color .25s ease;
        cursor: pointer;
    }

    .row:hover {
        background-color: var(--lighter-bg-color);
    }

    @media (max-width: 750px){
        .timeDisplay {
            zoom: 0.75;
        }
    }


</style>
