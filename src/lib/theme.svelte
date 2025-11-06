<script>
    import { settings, color, themes, loadTheme, saveGlobal } from "../global.svelte";
    import { Sun, Moon } from '@lucide/svelte'




</script>

<div class="main">

<div class="headerRow">
    <h1>Theme</h1>
</div>

<div class="menu">

    {#each themes as theme, i}
        <label for="chooseTheme{i}" class="modelCard themeCard {color.name == theme.name ? "selected" : ""}">
            {#if theme.type == "light"}
                <Sun size={24} />
            {:else}
                <Moon size={24} />
            {/if}
            
            <div class="textContainer">
                <p1 class="modelName">{theme.name}</p1> 
                <div class="inline">
                    <div class="styleExample" style="background-color: {theme.mainColor}; border: 2px solid {theme.textColor} !important;"></div>
                    <div class="styleExample" style="background-color: {theme.dimMainColor}; border: 2px solid {theme.textColor} !important;"></div>
                    <div class="styleExample" style="background-color: {theme.bgColor}; border: 2px solid {theme.textColor} !important;"></div>
                    <div class="styleExample" style="background-color: {theme.inputColor}; border: 2px solid {theme.textColor} !important;"></div>
                </div>  
            </div>

            <button
                class="invis"
                id="chooseTheme{i}"
                onclick={() => loadTheme(theme, i)}
            >Load Theme</button>

        </label>
    {/each}

</div>


</div>


<style>

    .inline {
        display: flex;
        flex-direction: row;
        gap: 10px;
        width: fit-content;
        height: 100%;
        align-items: center;
        justify-content: left;
    }

    .styleExample {
        width: 20px;
        height: 20px;
        border-radius: 100%;
        box-sizing: border-box;
    }
    
    .textContainer {
        width: 100%;
        justify-content: space-between;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    
    .modelCard:hover {
        background-color: var(--lighter-bg-color);
    }

    .selected {
        background-color: var(--main-color) !important;
    }


    .modelCard {
        justify-content: space-between;
        width: 100%;
        display: flex;
        box-sizing: border-box;
        gap: 10px;  
        height: fit-content;
        transition: background-color 250ms;
        cursor: pointer;
        padding: 10px;
        border-radius: 5px;
        min-height: 50px;
        max-width: 600px;
        align-items: center;
        font-size: 20px;
        color: var(--header-color);
        background-color: var(--light-bg-color);
    }

    .main {
        place-items: center;
    }

    .menu {
        width: 100%;
        max-width: 600px;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        padding: 10px;
        gap: 10px;
    }

</style>