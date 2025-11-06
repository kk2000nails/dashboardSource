<script>

import { appState, getRandomItem, settings, viewAppt } from "../global.svelte";
import { Search, User, ListTodo, Clock, Calendar1, HeartCrack, PencilLine, Trash } from "@lucide/svelte";

const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
]

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

const getDateSuffix = (date) => {
    if(date % 10 == 1 && date != 11){
        return "st";
    } else if(date % 10 == 2 && date != 12){
        return "nd";
    } else if (date % 10 == 3 && date != 13){
        return 'rd';
    }
    return "th";
}

const buildDate = (a) => {
    return `${months[a.month]} ${a.date}${getDateSuffix(a.date)}, ${a.year}`
}

let searchTerm = $state("");

// search by client name, appointment time, appointment day, appointment date
const isValidSearch = (m) => {
    let client = m.clientName.toLowerCase();
    let type = m.type.toLowerCase();
    let day = days[m.day].toLowerCase();
    let month = months[m.month].toLowerCase();
    let notes = m.notes;
    for(let s of searchTerm.split(" ").filter(Boolean)){
        let l = s.toLowerCase();
        if(!(
            client.includes(l) ||
            type.includes(l) || 
            day.includes(l) || 
            month.includes(l) || 
            notes.includes(l)
        )){
            return false;
        }
    }
    if(searchTerm == ""){
        return true;
    }
    return true;
}

let searchAppts = $derived(appState.appointments.filter( m => isValidSearch(m) ).toSorted((a, b) => {
    const aTime = new Date(a.year, a.month, a.date, Math.floor(a.time / 60), a.time % 60);
    const bTime = new Date(b.year, b.month, b.date, Math.floor(b.time / 60), b.time % 60);
    const now = new Date();
    // ignore this error because it's stupid
    // @ts-ignore
    const aDiff = (aTime - now);
    // @ts-ignore
    const bDiff = (bTime - now);
    if(aDiff > bDiff){
        return 1;
    } else if (aDiff < bDiff){
        return -1;
    }
    return 0;
}));

const getTimeAndDuration = (a) => {
    let output = days[a.day] + " from "
    let hours = Math.floor(a.time / 60);
    let minutes = a.time % 60;
    let endHours = Math.floor((a.time + a.duration) / 60);
    let endMinutes = (a.time + a.duration) % 60;
    if(settings.clock24hr){
        output += `${hours}:${minutes < 10 ? `0${minutes}` :minutes} to `;
        output += `${endHours}:${endMinutes < 10 ? `0${endMinutes}` : endMinutes}`;
    } else {
        if(hours > 12){
            hours -= 12;
        }
        if(endHours > 12){
            endHours -= 12;
        }
        output += `${hours}:${minutes < 10 ? `0${minutes}` :minutes} to `;
        output += `${endHours}:${endMinutes < 10 ? `0${endMinutes}` : endMinutes}`;
    }

    return output;
}
    

</script>

<div class="main">

    <div class="mainContainer">


        {#if appState.appointments.length != 0}
            <div class="headerRow">
                <h1>Upcoming</h1>
            </div>
        {:else}
                <div class="error">
                    <h1>{getRandomItem(['Zoinks', 'Uh Oh', 'Yikes', 'Oops', 'Gee Whiz', 'Jinkies', 'Jeepers'])}... <HeartCrack size={30}/></h1>

                    <p>No appointments listed. Try refreshing, or scheduling a new appointment</p>
                </div>
        {/if}

        <div class="upcoming">
            {#if appState.appointments.length != 0}
                <div class="search">
                    <Search size={20} />
                    <input type='text' bind:value={searchTerm} placeholder="Search for appointment...">
                </div>
                {#if searchAppts.length > 0}
                    {#each searchAppts as a, i}

                        <label class="appointment" for="view{i}">
                            <div class="appointmentHeader">
                                <h1>
                                    <User size={24} />
                                    
                                    {a.clientName}</h1>
                                <h1 
                                style={
                                    a.timeUntil.includes("For") ? "color: var(--main-color);" : (a.timeUntil == "Done" ? "color: var(--fail-color);" : "")
                                }>
                                    {a.timeUntil}
                                </h1>
                            </div>

                            <div class="info">
                                <div class="item">
                                    <ListTodo size={18} />
                                    <p>{a.type}</p>
                                </div>
                                <div class="item">
                                    <Clock size={18} />
                                    <p>{getTimeAndDuration(a)}</p>
                                </div>
                                <div class="item">
                                    <Calendar1 size={18} />
                                    <p>{buildDate(a)}</p>
                                </div>
                                {#if a.notes.length >= 1}
                                    <div class="item">
                                        <p style='font-size: 16px;'>{a.notes}</p>
                                    </div>
                                {/if}
                            </div>

                        </label>

                        <button onclick={() => viewAppt(a)} class='invis' id="view{i}">View {i}</button>

                    {/each}
                {:else}
                    <h1>No appointment matches your search</h1>
                {/if}
            {/if}


        </div>


</div>


</div>

<style>

    .search {
        width: 100%;
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 10px;
        color: var(--text-color);
        gap: 10px;
    }

    .search input {
        font-size: 18px;
        border: none;
        background: none;
        outline: none !important;
        width: 100%;
        color: var(--text-color);
    }

    .info {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        color: var(--text-color);
        padding-left: 10px;
        padding-right: 10px;
        box-sizing: border-box;
        padding-bottom: 10px;
    }

    .item {
        font-size: 18px;
        display: flex;
        box-sizing: border-box;
        gap: 10px;
        align-items: center;
    }

    .item p {
        margin: 0px;
    }


    .appointmentHeader {
        width: 100%;
        justify-content: space-between;
        display: flex;
        color: var(--header-color);
        box-sizing: border-box;
        background-color: var(--lighter-bg-color);
        border-top-left-radius: 15px;
        border-top-right-radius: 15px;
        align-items: center;
        padding: 10px;
    }

    .appointmentHeader h1 {
        align-items: center;
        display: flex;
        gap: 10px;
    }

    .appointment {
        width: 100%;
        height: fit-content;
        background-color: var(--light-bg-color);
        border-radius: 15px;
        display: flex;
        box-sizing: border-box;
        flex-direction: column;
        gap: 10px;
        cursor: pointer;
    }

    .upcoming {
        width: 100%;
        height: fit-content;
        padding: 20px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .appointment h1 {
        margin: 0px;
        font-size: 24px;
    }

    .headerRow {
        width: 100%;
        display: flex;
        justify-content: center;

    }

    .mainContainer {
        width: 100%;
        max-width: 700px;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        padding: 10px;
        gap: 30px;
    }

    .main {
        place-items: center;
    }
</style>
