<script>
    import { Check, HeartCrack, PlusCircle, Trash } from "@lucide/svelte";
    import { addNotification, appState, settings } from "../global.svelte";
    import { loadTechnicians, refreshData, sb } from "../api.svelte";
    import { onMount } from "svelte";

    const deleteTech = async (tech) => {
        try {
            await sb.from('technicians').delete().eq('id', tech.id);
            await loadTechnicians();
        } catch {
            addNotification('fail', "Something went wrong!", 5000, HeartCrack)
        }
    }

    const addTech = async () => {
        try {
            await sb.from('technicians').insert({name: newName});
            await loadTechnicians();
            addNotification("success", "Technician Added", 5000, Check)
            newName = "";
        } catch {
            addNotification('fail', "Something went wrong!", 5000, HeartCrack)
        }

    }

    onMount(async () => {
        await loadTechnicians();
    })

    let newName = $state("");

</script>



<div class="main">


    <div class="headerRow">
        <h1>Techs</h1>
    </div>

    <div class="appointmentGroup">

        {#each appState.technicians as t}
            <div class="focusLabel">
                <p>{t.name}</p>
                <button style="{settings.animations ? "transition: color .25s ease;" : ""}" onclick={() => deleteTech(t)}>
                    <Trash size={20} />
                </button>
            </div>
        {/each}

        <div class="focusLabel" style='background-color: var(--lighter-bg-color);'>
            <input bind:value={newName} placeholder="New Technician...">
        </div>


        <button class="nextButton" onclick={addTech}>
            <PlusCircle size={20} />
            Add
        </button>

    </div>

    

</div>



<style>

    .nextButton {
        width: fit-content;
        background-color: var(--lighter-bg-color);
        border: none;
        font-size: 18px;
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

    .main {
        place-items: center;
    }

    .focusLabel {
        width: 100%;
        background-color: var(--light-bg-color);
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        height: fit-content;
        border-radius: 10px;
        box-sizing: border-box;
        align-items: center;
        padding: 15px;
    }
    
    .focusLabel input {
        width: 100%;
        font-size: 18px;
        background: none;
        border: none;
        outline: none !important;
    }

    .focusLabel * {
        color: var(--header-color);
    }

    .focusLabel button {
        border: none;
        background: none;
        cursor: pointer;
    }

    .focusLabel button:hover {
        color: var(--dim-main-color);
    }

    .focusLabel p {
        margin: 0px;
        font-size: 18px;
    }

    .appointmentGroup {
        width: 100%;
        max-width: 600px;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        padding: 10px;
        gap: 20px;
        align-items: center;
    }

</style>