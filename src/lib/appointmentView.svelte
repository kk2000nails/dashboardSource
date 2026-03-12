<script>
    import { ListTodo, User, Clock1, Clock10, Calendar, PlusCircle, Check, HeartCrack, Trash, Phone, Loader2} from "@lucide/svelte";
    import { addNotification, appointmentView, appState, settings } from "../global.svelte";
    import { replace } from 'svelte-spa-router';
    import CalendarPicker from "./calendarPicker.svelte";
    import TimePicker from "./timePicker.svelte";
    import { loadTechnicians, refreshData, sb } from "../api.svelte";
    import { slide } from "svelte/transition";
    import { onMount } from "svelte";

    let showLoader = $state(false);


    onMount(async () => {
        await loadTechnicians();
    })

    const id1 = "pihudfgs";
    const id2 = "poihadfgiunsdf";

    let checking =$state(false);

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
        let end = appointmentView.endHours * 60 + appointmentView.endMinutes;
        let start = appointmentView.startHours * 60 + appointmentView.startMinutes;
        return end - start;
    }


    const saveAppointment = async () => {
        showLoader = true;
        let duration = getDuration();
        if(duration < 0){
            addNotification('fail', 'You cannot set an appointment to end before it starts', 5000, HeartCrack)
            return;
        }

        let dateString = `${appointmentView.year}-${(appointmentView.month + 1) < 10 ? `0${(appointmentView.month + 1)}` : (appointmentView.month + 1)}-${appointmentView.date < 10 ? `0${appointmentView.date}` : appointmentView.date} ${appointmentView.startHours < 10 ? `0${appointmentView.startHours}` : appointmentView.startHours}:${appointmentView.startMinutes < 10 ? `0${appointmentView.startMinutes}` : appointmentView.startMinutes}:00.123Z`;
        let data = {
            "startTime": dateString,
            "duration": duration,
            "type": appointmentView.type,
            "clientName": appointmentView.clientName,
            "notes": appointmentView.notes,
            "tech": appointmentView.tech,
            "phone": appointmentView.phone
        }

        try {
            const error = await sb.from('appointments').update(data).eq('id', appointmentView.id);
            await refreshData();
            const now = new Date();
            appointmentView.clientName = "";
            appointmentView.date = now.getDate();
            appointmentView.month = now.getMonth();
            appointmentView.notes = "";
            appointmentView.type = "";
            appointmentView.year = now.getFullYear();
            addNotification('success', 'Appointment Updated!', 5000, Check);
            showLoader = false;
            replace('/')
        } catch {
            showLoader = false;
            addNotification('fail', 'Something went wrong... Try again later', 5000, HeartCrack);
        }
    }

    let deleting = $state(false);
    const deleteAppointment = async () => {
        deleting = true;
        try {

            console.log(appointmentView);
            const { error } = await sb.from('appointments').delete().eq('id', appointmentView.id);
            const now = new Date();
            appointmentView.clientName = "";
            appointmentView.date = now.getDate();
            appointmentView.month = now.getMonth();
            appointmentView.notes = "";
            appointmentView.type = "";
            appointmentView.year = now.getFullYear();
            addNotification('success', 'Appointment Deleted!', 5000, Check);
            await refreshData();
            deleting = false;
            replace('/')
        } catch {
            deleting = false;
            addNotification('fail', 'Something went wrong... Try again later', 5000, HeartCrack);
        }
    }

    let toggle = $state(false);

</script>

<div class="main">



    <div class="headerRow">
        <h1>{appointmentView.clientName}</h1>
    </div>


        <div class="appointmentGroup">

            <div class="inputGroup">

                <div class="inputRow">
                    <User size={20} />
                    <input placeholder='Client Name...' bind:value={appointmentView.clientName}>
                </div>

                <div class="spacer"></div>

                <div class="inputRow">
                    <Phone size={20}/>
                    <input id='phone' placeholder='Phone...' bind:value={appointmentView.phone}>
                </div>
        
                <div class="spacer"></div> 

                <div class="inputRow">
                    <ListTodo size={20}/>
                    <input id='type' placeholder='Appointment Type...' bind:value={appointmentView.type}>
                </div>

            </div>
            <p class='invis'>These should be dropdown scroll wheel type things</p>
            <div class="inputGroup">

                <div class="inputRow space">
                    <Calendar size={20} />
                    <p class='idkText'>Date</p>
                    <label for='focus1' class='focusLabel'>
                        <p>{months[appointmentView.month]} {appointmentView.date}{getDateSuffix(appointmentView.date)}. {appointmentView.year}</p>
                    </label>
                </div>

                <CalendarPicker bind:year={appointmentView.year} bind:month={appointmentView.month} bind:date={appointmentView.date} />
                
                <div class="spacer"></div>


                <div class="inputRow">
                    <Clock1 size={20} />
                    <p class='idkText'>Start Time</p>
                    <label for='focus2' class='focusLabel'>
                        <p>{buildTime(appointmentView.startHours, appointmentView.startMinutes)}</p>
                    </label>
                </div>

                <TimePicker bind:minutes={appointmentView.startMinutes} bind:hours={appointmentView.startHours} id={id1}/>

                <div class="spacer"></div>

                <div class="inputRow">
                    <Clock10 size={20} />
                    <p class='idkText'>End Time</p>
                    <label for='focus3' class='focusLabel'>
                        <p>{buildTime(appointmentView.endHours, appointmentView.endMinutes)}</p>
                    </label>
                </div>

                <TimePicker bind:minutes={appointmentView.endMinutes} bind:hours={appointmentView.endHours} id={id2}/>

                <div class="spacer"></div>

                <div class="inputRow">
                    <User size={20} />
                    <p class='idkText'>Technician</p>
                    <label for='focus4' class='focusLabel'>
                        <p>{appointmentView.tech}</p>
                    </label>
                    <button id='focus4' onclick={() => {toggle = !toggle}} class='invis'>Bleh</button>
                </div>

                {#if toggle}

                    <label class="dropDown"
                        transition:slide={{ duration: settings.animations ? 250 : 0 }}
                    >
                        {#each appState.technicians as t, i}
                            <label for='s{i}' class='item'>
                                {t.name}
                            </label>
                            <button class='invis' id='s{i}' onclick={() => {appointmentView.tech = t.name;}}>Select Pack</button>
                        {/each}
                    </label>

                {/if}

            </div>

            <div class="inputGroup">
                <textarea bind:value={appointmentView.notes} placeholder='Additional Notes...'></textarea>
            </div>

            <div class="buttonRow">
                {#if !checking}
                    <button class='nextButton' id="check" onclick={() => {checking = true; setTimeout(() => {checking = false;}, 5000)}}><Trash size={20} /> Delete</button>

                {:else}
                    <button class='nextButton' id="check" onclick={deleteAppointment}>
                        {#if deleting}
                            <div class="svgWrapper loading">
                                <Loader2 size=20 />
                            </div> 
                            Processing...
                        {:else}
                            <Trash size={20} /> You sure?
                        {/if}
                    </button>

                {/if}

                <button class='nextButton' onclick={saveAppointment}>

                    {#if showLoader}
                        <div class="svgWrapper loading">
                            <Loader2 size=20 />
                        </div> 
                        Processing...
                    {:else}
                        <PlusCircle size={20} /> Save
                    {/if}


                </button>
            </div>


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

.buttonRow {
    width: 100%;
    display: flex;
    padding-bottom: 20px;
    gap: 20px;
    flex-direction: row;
    justify-content: center;
}

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