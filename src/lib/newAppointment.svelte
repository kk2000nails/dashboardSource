<script>
    import { ListTodo, User, Clock1, Clock10, Calendar, PlusCircle, Check, HeartCrack, Phone} from "@lucide/svelte";
    import { addNotification, appState, newData, settings } from "../global.svelte";
    let focused = $state(-1);
    import { replace } from 'svelte-spa-router';
    import CalendarPicker from "./calendarPicker.svelte";
    import TimePicker from "./timePicker.svelte";
    import { loadTechnicians, pb } from "../api.svelte";
    import { slide } from "svelte/transition";
    import { onMount } from "svelte";

    const debug = true;

    onMount(async () => {
        await loadTechnicians();
    })


    const id1 = "pihudfgs";
    const id2 = "poihadfgiunsdf";

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

    const focusElement = (id) => {
        document.getElementById(id).focus();
    }

    const focus = (index) => {
        if(focused == index){
            focused = -1;
        } else {
            focused = index;
        }
    }

    const buildTime = (hours, minutes) => {
        if(settings.clock24hr){
            return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
        } else {
            // pm
            if(hours >= 12){
                let thing = (hours % 12);
                if(thing == 0){
                    thing = 12;
                }
                return `${thing}:${minutes < 10 ? `0${minutes}` : minutes} PM`;
            } else {
                let thing = (hours % 12);
                if(thing == 0){
                    thing = 12;
                }
                return `${thing}:${minutes < 10 ? `0${minutes}` : minutes} AM`;
            }
        }
    }

    const getDuration = () => {
        let end = newData.endHours * 60 + newData.endMinutes;
        let start = newData.startHours * 60 + newData.startMinutes;
        return end - start;
    }


    const addAppointment = async () => {
        let duration = getDuration();
        if(duration < 0){
            addNotification('fail', 'You cannot set an appointment to end before it starts', 5000, HeartCrack)
            return;
        }

        let dateString = `${newData.year}-${(newData.month + 1) < 10 ? `0${(newData.month + 1)}` : (newData.month + 1)}-${newData.date < 10 ? `0${newData.date}` : newData.date} ${newData.startHours < 10 ? `0${newData.startHours}` : newData.startHours}:${newData.startMinutes < 10 ? `0${newData.startMinutes}` : newData.startMinutes}:00.123Z`;
        console.log(dateString);
        let data = {
            "startTime": dateString,
            "duration": duration,
            "type": newData.type,
            "clientName": newData.clientName,
            "notes": newData.notes,
            "phone": newData.phone,
            "tech": newData.technician,
        }

        try {
            const record = await pb.collection('appointments').create(data);
            const now = new Date();
            newData.clientName = "";
            newData.date = now.getDate();
            newData.month = now.getMonth();
            newData.notes = "";
            newData.type = "";
            newData.year = now.getFullYear();
            newData.startHours = 12;
            newData.startMinutes = 0;
            newData.endHours = 12;
            newData.endMinutes = 45;
            addNotification('success', 'Appointment created!', 5000, Check);
            replace('/')
        } catch {
            addNotification('fail', 'Something went wrong... Try again later', 5000, HeartCrack);
        }
    }

</script>

<div class="main">

    <div class="headerRow">
        <h1>New Appointment</h1>
    </div>


        <div class="appointmentGroup">

            <div class="inputGroup">

                <div class="inputRow">
                    <User size={20} />
                    <input placeholder='Client Name...' bind:value={newData.clientName} onkeydown={(e) => e.key === "Enter" && focusElement('phone')}>
                </div>

                <div class="spacer"></div>

                <div class="inputRow">
                    <Phone size={20}/>
                    <input id='phone' placeholder='Phone...' bind:value={newData.phone} onkeydown={(e) => e.key === "Enter" && focusElement('type')}>
                </div>

                <div class="spacer"></div>

                <div class="inputRow">
                    <ListTodo size={20}/>
                    <input id='type' placeholder='Appointment Type...' bind:value={newData.type} onkeydown={(e) => e.key === "Enter" && focus(1)}>
                </div>

            </div>
            <p class='invis'>These should be dropdown scroll wheel type things</p>
            <div class="inputGroup">

                <div class="inputRow space">
                    <Calendar size={20} />
                    <p class='idkText'>Date</p>
                    <label for='focus1' class='focusLabel'>
                        <p>{months[newData.month]} {newData.date}{getDateSuffix(newData.date)}. {newData.year}</p>
                    </label>
                    <button class='invis' id='focus1' onclick={() => focus(1)}>Focus Calendar</button>
                </div>

                {#if focused == 1}
                    <CalendarPicker bind:year={newData.year} bind:month={newData.month} bind:date={newData.date}/>
                {/if}
                
                <div class="spacer"></div>


                <div class="inputRow">
                    <Clock1 size={20} />
                    <p class='idkText'>Start Time</p>
                    <label for='focus2' class='focusLabel'>
                        <p>{buildTime(newData.startHours, newData.startMinutes)}</p>
                    </label>
                    <button class='invis' id='focus2' onclick={() => focus(2)}>Focus Start Time</button>
                </div>

                {#if focused == 2}
                    <TimePicker bind:minutes={newData.startMinutes} bind:hours={newData.startHours} id={id1}/>
                {/if}

                <div class="spacer"></div>

                <div class="inputRow">
                    <Clock10 size={20} />
                    <p class='idkText'>End Time</p>
                    <label for='focus3' class='focusLabel'>
                        <p>{buildTime(newData.endHours, newData.endMinutes)}</p>
                    </label>
                    <button class='invis' id='focus3' onclick={() => focus(3)}>Focus End Time</button>
                </div>


                {#if focused == 3}
                    <TimePicker bind:minutes={newData.endMinutes} bind:hours={newData.endHours} id={id2}/>
                {/if}

                <div class="spacer"></div>

                <div class="inputRow">
                    <User size={20} />
                    <p class='idkText'>Technician</p>
                    <label for='focus4' class='focusLabel'>
                        <p>{newData.technician == "" ? "Select..." : newData.technician}</p>
                    </label>
                    <button class='invis' id='focus4' onclick={() => focus(4)}>Focus Technicians</button>
                </div>

                {#if focused == 4}
                    <label class="dropDown {focused == 4 ? "focused" : ""}" for="focus2"
                      transition:slide={{ duration: settings.animations ? 250 : 0 }}
                    >
                        {#each appState.technicians as t, i}
                            <label for='s{i}' class='item'>
                                {t.name}
                            </label>
                            <button class='invis' id='s{i}' onclick={() => {newData.technician = t.name;}}>Select Pack</button>
                        {/each}
                    </label>
                {/if}


            </div>

            <div class="inputGroup">
                <textarea bind:value={newData.notes} placeholder='Additional Notes...'></textarea>
            </div>


            <button class='nextButton' onclick={addAppointment}><PlusCircle size={20} /> Add Appointment</button>
        </div>

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

    .dropDown {
        border-radius: 5px;
        width: 100%;
        display: flex;
        box-sizing: border-box;
        position: relative;
        padding-left: 10px;
        padding-right: 10px;
        background-color: var(--lighter-bg-color);
        font-size: var(--msg-font-size);
        cursor: pointer;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 5px;
    }

    .item {
        width: fit-content;
        display: flex;
        font-size: 18px;
        padding: 5px;
        box-sizing: border-box;
        cursor: pointer;
        transition: background-color 250ms ease;
        background-color: var(--light-bg-color);
        padding: 10px;
        border-radius: 10px;
        margin-left: auto;
    }

    .item:hover {
        background-color: var(--lightest-bg-color);
    }


.idkText {
    margin: 0px; 
    font-size: 20px;
    padding-left: 5px;
}

.inputRow {
    width: 100%;
    display: flex;
    box-sizing: border-box;
    gap: 5px;
    flex-direction: row;
    align-items: center;
}

.main * {
    color: var(--text-color);
}

.focusLabel {
    width: fit-content;
    background-color: var(--light-bg-color);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: fit-content;
    border-radius: 10px;
    box-sizing: border-box;
    align-items: center;
    padding: 15px;
    margin-left: auto;
    cursor: pointer;
}

.focusLabel p {
    margin: 0px;
    color: var(--text-color);
}

.inputGroup {
    width: 100%;
    height: fit-content;
    background-color: var(--lighter-bg-color);
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 10px;
    border-radius: 15px;
    gap: 5px;
    transform: none;
    position: relative;
    z-index: 1;

}

.spacer {
    width: 100%;
    display: flex;
    border: 1px solid var(--text-color);
    opacity: 0.1;
    margin-top: 5px;
    margin-bottom: 4px;
}


.inputGroup input, textarea {
    width: 100%;
    border: none;
    background: none;
    font-size: 20px;
    outline: none !important;
    color: var(--header-color);
    font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
    resize: none;
}

input::placeholder, textarea::placeholder {
    color: var(--text-color);
    opacity: 0.3;
}

textarea {
    min-height: 150px;
}

.main {
    place-items: center;
}

.appointmentGroup {
    width: 100%;
    max-width: 600px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 10px;
    gap: 30px;
    align-items: center;
}

</style>