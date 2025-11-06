<script>
    import { onMount, tick } from "svelte";
    import { appState, newData } from "../global.svelte";
    import { push, replace } from 'svelte-spa-router';

    let now = new Date();
    let year = $state(now.getFullYear());
    let date = $state(now.getDate());
    let month = $state(now.getMonth());
    let page = $state(1);


    const monthLength = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    }

    
    const firstDayOfMonth = (month, year) => {
        return new Date(year, month, 1).getDay();
    }

    let length = $derived(monthLength(month, year));

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

    let currentData = $state({
        data: []
    });

    let target = $state(null);
    let isVisible = $state(false);

    onMount(async () => {
        await tick();
        refreshData(month, year);
        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    isVisible = entry.isIntersecting;
                });
            },
            {
                root: document.getElementById("bleh"),
            }
        );

        obs.observe(target);


    });

    const refreshData = (month, year) => {
        // pad start
        let output = [];

        const startPad = firstDayOfMonth(month, year);
        for(let i = 0; i < startPad; i++){
            output.push({
                date: -1,
                appt: [],
                display: false,
            });
        }

        for(let i = 0; i < monthLength(month, year); i++){
            output.push({                
                date: i + 1,
                appt: [],
                display: true,
            })
        }

        for(let i of appState.appointments){
            if(i.month == month && i.year == year){
                output[i.date - 1 + startPad].appt.push(i)
            }
        }

        const offset = (length + startPad) % 7;
        // fill the end with blank spots
        for(let i = 0; i < (7 - offset); i++){
            output.push({
                date: -1,
                appt: [],
                display: false,
            })
        }

        currentData.data.push(output);
    }

    let loading = $state(false);

    $effect(() => {
        if(isVisible){
            if(!loading){
                loading = true;
                refreshData(
                   (month + page) % 12,
                    year + Math.floor((page + month) / 12)
                )
                page++;

                setTimeout(() => {
                    loading = false;
                }, 25);
            }

        }
    })

    const focus = (a, m, d) => {
        if(a.appt.length == 0){
            // if there is not an appointment, go to the new one
            newData.month = m;
            console.log(a);
            newData.date = a.date;
            replace('/new');
            return;
        }

        appState.focusAppt = a;
        appState.focusAppt.month = months[m];
        appState.focusAppt.day = d;
        push('/calendar/focus');
    }
</script>


<div class="main" id="bleh">
<!-- If zooming, render the large calendar view-->
    {#if currentData.data.length != 0}

        <div class="calendar">
            {#each {length: page} as _, p}

                <div class="headerRow">
                    <h1>{months[(month + p) % 12]} {year + Math.floor((p + month) / 12)}</h1>
                </div>

                <div class="calRow" style='border-top: none;'>
                    {#each ["S", "M", "T", "W", "T", "F", "S"] as d}
                        <div class="calItem" style='min-height: 0px; padding-bottom: 20px; justify-content: center; display: flex;'>
                            <p style='font-weight: bold; font-size: 22px;'>{d}</p>
                        </div>
                    {/each}
                </div>

                {#each {length: (
                    Math.ceil((
                        monthLength((month + p) % 12, 
                        year + Math.floor((p + month) / 12)) + 
                        firstDayOfMonth((month + p) % 12, 
                        year + Math.floor((p + month) / 12))
                    ) / 7)
                )} as _, i}
                    <div class="calRow">
                        {#each currentData.data[p].slice(i * 7, i * 7 + 7) as a, apptIndex}
                            <label for='p{p}a{i}l{apptIndex}' class="calItem {a.display ? "highlight" : ""}">
                                {#if a.display}


                                
                                    <button id='p{p}a{i}l{apptIndex}' class='invis' onclick={() => focus(a, (month + p) % 12, apptIndex)}>p{p}a{i}</button>



                                    <div class="calInfo" style='font-weight: bold;'>
                                        <div class="infoDot" style='{a.date == date && p == 0 ? "background-color: var(--main-color);" : ""}'>
                                            <p>{a.date}</p>
                                        </div>
                                    </div>
                                    <div class="calData">
                                        {#each a.appt.toSorted((a, b) => {
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
                                        }) as appt}
                                            <div class="appt">
                                                <div class="dot"
                                                    style="{appt.timeUntil.includes("For") ? "background-color: var(--main-color);" : (appt.timeUntil == "Done" ? "background-color: var(--fail-color);": "")}"
                                                ></div>
                                                <p class='text'>{appt.clientName}</p>
                                            </div>
                                        {/each}
                                    </div>
                                {/if}
                            </label>
                        {/each}
                    </div>
                {/each}
            {/each}
        </div>
    {/if}
    <div id='loadMore' bind:this={target}></div>

</div>

<style>

    #loadMore {
        width: 100%;
        height: 5px;
        min-height: 5px;
    }

    .infoDot {
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;

    }

    .calInfo p {
        padding: 10px;
        box-sizing: border-box;
        display: flex;

    }

    .dot {
        min-width: 12px;
        min-height: 12px;
        border-radius: 50%;
        background-color: var(--text-color);
    }

    .appt {
        width: 100%;
        font-size: 12px;
        display: flex;
        gap: 5px;
        align-items: center;
        background-color: var(--lightest-bg-color);
        padding: 5px;
        border-radius: 15px;
        box-sizing: border-box;
    }

    .calInfo {
        width: 100%;
        gap: 10px;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: space-between;
        box-sizing: border-box;
    }

    .calItem {
        width: 100%;
        height: 100%;
        min-height: 100px;
        box-sizing: border-box;
        padding: 10px;
        border-radius: 25px;
        transition: background-color .25s ease;
    }

    .calItem p {
        font-size: 18px;
        margin: 0px;
        color: var(--header-color);
    }

    .highlight {
        cursor: pointer;
    }

    .highlight:hover {
        background-color: var(--light-bg-color);
    }

    .calData {
        width: 100%;
        height: fit-content;
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding-top: 10px;
    }

    .calRow {
        width: 100%;
        border-top: var(--text-color) 1px solid;
        display: flex;
        box-sizing: border-box;
        justify-content: space-between;
        flex-direction: row;
        padding: 10px;
        gap: 10px;
    }

    .calendar {
        display: flex;
        box-sizing: border-box;
        width: 100%;
        height: fit-content;
        flex-direction: column;
        gap: 10px;
        padding: 10px;        
    }

    .text {
        display: none;
    }

    @media (min-width: 751px){
        .text {
            display: block;
            font-size: 12px;
        }
    }

    @media (max-width: 750px){
        .calItem {
            padding: 0px;
        }

        .appt {
            justify-content: center;
            width: fit-content;
        }

        .calRow {
            padding-left: 0px;
            padding-right: 0px;
        }

        .calData {
            flex-wrap: wrap;
            flex: 1;
            flex-direction: row;
            justify-content: center;
        }
        
    }
</style>