<script>
    import { ListTodo, User, Clock1, Clock10, Calendar, PlusCircle} from "@lucide/svelte";
    import { newData, settings } from "../global.svelte";
    let focused = $state(-1);
    import { replace } from 'svelte-spa-router';
    import CalendarPicker from "./calendarPicker.svelte";
    import TimePicker from "./timePicker.svelte";
    import { pb } from "../api.svelte";

    const debug = true;

    let sMinutes = $state(0);
    let sHour = $state(12);
    let endMinutes = $state(45);
    let endHours = $state(12);
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
        let end = endHours * 60 + endMinutes;
        let start = sHour * 60 + sMinutes;
        return end - start;
    }


    const addAppointment = async () => {
        let duration = getDuration();
        if(duration < 0){
            alert("You cannot set an appointment to end before it begins");
            return;
        }

        let dateString = `${newData.year}-${(newData.month + 1) < 10 ? `0${(newData.month + 1)}` : (newData.month + 1)}-${newData.date < 10 ? `0${newData.date}` : newData.date} ${sHour < 10 ? `0${sHour}` : sHour}:${sMinutes < 10 ? `0${sMinutes}` : sMinutes}:00.123Z`;
        console.log(dateString);
        let data = {
            "startTime": dateString,
            "duration": duration,
            "type": newData.type,
            "clientName": newData.clientName,
            "notes": newData.notes
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
            alert("Appointment Created");
            replace('/')
        } catch {
            alert("Something went wrong. Please try again later");
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
                    <input type='text' placeholder='Client Name...' bind:value={newData.clientName} onkeydown={(e) => e.key === "Enter" && focusElement('type')}>
                </div>
                <div class="spacer"></div>
                <div class="inputRow">
                    <ListTodo size={20}/>
                    <input type='text' id='type' placeholder='Appointment Type...' bind:value={newData.type} onkeydown={(e) => e.key === "Enter" && focus(1)}>
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
                    <CalendarPicker />
                {/if}
                
                <div class="spacer"></div>


                <div class="inputRow">
                    <Clock1 size={20} />
                    <p class='idkText'>Start Time</p>
                    <label for='focus2' class='focusLabel'>
                        <p>{buildTime(sHour, sMinutes)}</p>
                    </label>
                    <button class='invis' id='focus2' onclick={() => focus(2)}>Focus Start Time</button>
                </div>

                {#if focused == 2}
                    <TimePicker bind:minutes={sMinutes} bind:hours={sHour} id={id1}/>
                {/if}

                <div class="spacer"></div>

                <div class="inputRow">
                    <Clock10 size={20} />
                    <p class='idkText'>End Time</p>
                    <label for='focus3' class='focusLabel'>
                        <p>{buildTime(endHours, endMinutes)}</p>
                    </label>
                    <button class='invis' id='focus3' onclick={() => focus(3)}>Focus End Time</button>
                </div>


                {#if focused == 3}
                    <TimePicker bind:minutes={endMinutes} bind:hours={endHours} id={id2}/>
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