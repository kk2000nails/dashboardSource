<script>
    import {replace, location} from 'svelte-spa-router';
    import { appState } from '../global.svelte';
    import { fade } from 'svelte/transition';
    import { House, CirclePlus, CalendarDays, Settings2, PaintBucket, User } from '@lucide/svelte';
</script>



<div class="smain">

    <div class="optionGroup">
        <div class="header">
            <p>KK 2000 Nails</p>
        </div>
        <label for='home' class="option {($location) == "/" || ($location) == '/calendar/focus' ? 'highlighted' : ""}">
            <House size={24} />
            <p>Home</p>
        </label>


        <button class='invis' id='home' onclick={() => {appState.sidebarToggle = false; replace('/')}}>toHome</button>

        <label for='new' class="option {($location) == "/new" ? 'highlighted' : ""}">
            <CirclePlus size={24} />
            <p>New</p>
        </label>

        <button class='invis' id='new' onclick={() => {appState.sidebarToggle = false; replace('/new')}}>tonew</button>

        <label for='calendar' class="option {($location) == "/calendar" ? 'highlighted' : ""}">
            <CalendarDays size={24} />
            <p>Upcoming</p>
        </label>

        <button class='invis' id='calendar' onclick={() => {appState.sidebarToggle = false; replace('/calendar')}}>tocalendar</button>

        <label for='users' class="option {($location) == "/users" ? 'highlighted' : ""}">
            <User size={24} />
            <p>Techs</p>
        </label>

        <button class='invis' id='users' onclick={() => {appState.sidebarToggle = false; replace('/users')}}>tocalendar</button>

    </div>

    <div class="optionGroup">

        <label for='theme' class="option {($location) == "/theme" ? 'highlighted' : ""}">
            <PaintBucket size={24} />
            <p>Theme</p>
        </label>

        <button class='invis' id='theme' onclick={() => {appState.sidebarToggle = false; replace('/theme')}}>totheme</button>

        <label for='settings' class="option {($location) == "/settings" ? 'highlighted' : ""}">
            <Settings2 size={24} />
            <p>Settings</p>
        </label>

        <button class='invis' id='settings' onclick={() => {appState.sidebarToggle = false; replace('/settings')}}>tosettings</button>

    </div>

    

</div>

<style>

    .smain {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        background-color: var(--light-bg-color);
        padding-top: 10px;
        box-sizing: border-box;
        justify-content: space-between;
    }

    .highlighted {
        background-color: var(--lightest-bg-color) !important;
    }

    .optionGroup {
        width: 100%;
        height: fit-content;
        display: flex;
        flex-direction: column;
        padding: 10px;
        box-sizing: border-box;
        gap: 5px;
        padding-bottom: 10px;
    }

    .header {
        margin-top: 10px;
        margin-bottom: 40px;
        justify-content: center;
        display: flex;
        color: var(--header-color);
    }

    .option {
        width: 100%;
        display: flex;
        box-sizing: border-box;
        padding: 10px;
        border-radius: 10px;
        transition: background-color 250ms ease;
        cursor: pointer;
        position: relative;
        gap: 10px;
        align-items: center;
        color: var(--header-color);
    }

    .option:hover {
        background-color: var(--lighter-bg-color);
    }

    p {
        margin: 0px;
        font-weight: 500;
        font-size: 18px;
    }
</style>