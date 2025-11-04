<script>
    import { HeartCrack } from "@lucide/svelte";
    import { getRandomItem } from "../global.svelte";


</script>

<div class="main">

    <div class="error">
        <h1>{getRandomItem(['Zoinks', 'Uh Oh', 'Yikes', 'Oops', 'Gee Whiz', 'Jinkies', 'Jeepers'])}... <HeartCrack size={30}/></h1>
        <p>Page not found... <a href='/#/'>Go back</a> to the main page</p>
    </div>

</div>
