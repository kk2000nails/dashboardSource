<script>
    import { saveGlobal, settings } from "../global.svelte";

</script>

<div class="main">

<div class="headerRow">
    <h1>Settings</h1>
</div>

    <div class="settingsMenu">

        <div class="row">
            <div class="text">
                <p class='header'>24 Hour Times</p>
                <p class='content'>Toggle the times to display in military time or standard time</p>
            </div>

            <label for='toggleClock' class="toggle {settings.animations ? "anims" : ""}" style='{settings.clock24hr ? "background-color: var(--main-color);" : "background-color: var(--lighter-bg-color);"}'>
                <div class="toggleBody {settings.animations ? "anims" : ""}" style='{settings.clock24hr ? "left: calc(100% - 25px);" : "left: 5px;"}'></div>
            </label>

            <button onclick={() => {settings.clock24hr = !settings.clock24hr; saveGlobal()}} id='toggleClock' class='invis'>Toggle 24HR Time</button>
        </div>

        <div class="row">
            <div class="text">
                <p class='header'>Animations</p>
                <p class='content'>Controls animations across the app</p>
            </div>

            <label for='toggleAnim' class="toggle {settings.animations ? "anims" : ""}" style='{settings.animations ? "background-color: var(--main-color);" : "background-color: var(--lighter-bg-color);"}'>
                <div class="toggleBody {settings.animations ? "anims" : ""}" style='{settings.animations ? "left: calc(100% - 25px);" : "left: 5px;"}'></div>
            </label>

            <button onclick={() => {settings.animations = !settings.animations; saveGlobal()}} id='toggleAnim' class='invis'>Toggle Animations</button>
        </div>
        
        <div class="row">
            <div class="text">
                <p class='header'>Notifications</p>
            <p class='content'>Controls all popup and push notifications</p>
            </div>

            <label for='toggleNotif' class="toggle {settings.animations ? "anims" : ""}" style='{settings.notifications ? "background-color: var(--main-color);" : "background-color: var(--lighter-bg-color);"}'>
                <div class="toggleBody {settings.animations ? "anims" : ""}" style='{settings.notifications ? "left: calc(100% - 25px);" : "left: 5px;"}'></div>
            </label>

            <button onclick={() => {settings.notifications = !settings.notifications; saveGlobal()}} id='toggleNotif' class='invis'>Toggle Notifications</button>
        </div>

    </div>


</div>


<style>

    .toggle {
        width: 60px;
        height: 30px;
        box-sizing: border-box;
        border-radius: 15px;
        position: relative;
        cursor: pointer;
        margin-top: 5px;
    }

    .toggle.anims {
        transition: background-color .2s ease;
    }

    .toggleBody {
        position: absolute;
        width: 20px;
        top: 5px;
        height: 20px;
        background-color: var(--header-color);
        border-radius: 100%;
    }

    .toggleBody.anims {
        transition: left .2s ease, right .2s ease;
    }

    .text {
        width: 100%;
        height: fit-content;
    }

    .row {
        width: 100%;
        display: flex;
        height: fit-content;
        flex-direction: row;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 10px;
        box-sizing: border-box;
        border-radius: 5px;
    }

    .text .header {
        font-weight: 500;
        font-size: 20px;
        margin: 0px;
        color: var(--header-color);
    }

    .content {
        color: var(--text-color);
    }

    .main {
        place-items: center;
    }

    .settingsMenu {
        width: 100%;
        max-width: 600px;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        padding: 10px;

    }

</style>