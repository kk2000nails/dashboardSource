import { replace } from "svelte-spa-router";

export let appState = $state({
    sidebarToggle: false,
    appointments: [],
    homeNotification: false,
    focusAppt: null,
});

let now = new Date();

export let newData = $state(
    {
        clientName: "",
        type: "",
        date: now.getDate(),
        month: now.getMonth(),
        year: now.getFullYear(),
        notes: "",
    }
)

export let appointmentView = $state({
    clientName: "",
    type: "",
    startHours: 12,
    startMinutes: 0,
    endHours: 12,
    endMinutes: 45,
    date: now.getDate(),
    month: now.getMonth(),
    year: now.getFullYear(),
    notes: "",
    id: "",
})

export let viewAppt = (a) => {
    appointmentView.clientName = a.clientName;
    appointmentView.type = a.type;
    appointmentView.startHours = Math.floor(a.time / 60);
    appointmentView.startMinutes = a.time % 60;
    appointmentView.endHours = Math.floor((a.time + a.duration) / 60);
    appointmentView.endMinutes = (a.time + a.duration) % 60;
    appointmentView.date = a.date;
    appointmentView.month = a.month;
    appointmentView.year = a.year;
    appointmentView.notes = a.notes;
    appointmentView.id = a.id;
    replace('/apptView');
}


export let color = $state(
    {
        name: 'Default',
        headerColor: "#f8f8f8",
        textColor: "#c9c9c9",
        mainColor: "#018d6c",
        lightMainColor: "#00ad85ff",
        dimMainColor: "#006e55ff",
        grayColor: "#2f2f2f",
        inputColor: "#161616d0",
        bgColor: "#0f0f0f",
        lightBgColor: "#181818",
        lighterBgColor: "#232323",
        lightestBgColor: "#2e2e2e",
        fail: "#a52100",
        index: 0
    }
);

export const themes = [{
    name: 'Default',
    type: 'dark',
    headerColor: "#f8f8f8",
    textColor: "#c9c9c9",
    mainColor: "#018d6c",
    lightMainColor: "#00ad85ff",
    dimMainColor: "#006e55ff",
    grayColor: "#2f2f2f",
    inputColor: "#006e5580",
    bgColor: "#0f0f0f",
    lightBgColor: "#181818",
    lighterBgColor: "#232323",
    lightestBgColor: "#2e2e2e",
    fail: "#a52100"
},{
    name: "Matcha",
    type: "dark",
    headerColor: "#e1e6f8ff",
    textColor: "#cdd6f4",
    mainColor: "#60995aff",
    lightMainColor: "#7cca76ff",
    dimMainColor: "#53884eff",
    grayColor: "#313244",
    inputColor: "#53884e80",
    bgColor: "#1e1e2e",
    lightBgColor: "#242436ff",
    lighterBgColor: "#2e2e46ff",
    lightestBgColor: "#393957ff",
    fail: "#df6174ff"
},{
    name: "Ocean",
    type: "dark",
    headerColor: "#f0f2fdff",
    textColor: "#e3e7ffff",
    mainColor: "#5966d6ff",
    lightMainColor: "#7482f2ff",
    dimMainColor: "#4a56b3ff",
    grayColor: "#2e2f44ff",
    inputColor: "#4a56b380",
    bgColor: "#191a2c",
    lightBgColor: "#202136ff",
    lighterBgColor: "#2b2c46ff",
    lightestBgColor: "#383a5eff",
    fail: "#d94f5cff"
},{
    name: "Sunset",
    type: "dark",
    headerColor: "#fffdfbff",
    textColor: "#ffeedd",
    mainColor: "#ff7f50ff",
    lightMainColor: "#ff9e70ff",
    dimMainColor: "#e36b44ff",
    grayColor: "#403b3dff",
    inputColor:  "#e36b4480",
    bgColor: "#1b1b24",
    lightBgColor: "#232330ff",
    lighterBgColor: "#2d2d3bff",
    lightestBgColor: "#3f3f57ff",
    fail: "#bb0a0aff"
},{
    name: "Regal",
    type: "dark",
    headerColor: "#e9e1f8ff",
    textColor: "#d5cdeaff",
    mainColor: "#a678dfff",
    lightMainColor: "#c29cf2ff",
    dimMainColor: "#8a5fd1ff",
    grayColor: "#343046ff",
    inputColor: "#8a5fd180",
    bgColor: "#1d1a26ff",
    lightBgColor: "#242032ff",
    lighterBgColor: "#2b263fff",
    lightestBgColor: "#332e4cff",
    fail: "#df6174ff"
},{
    name: "Forest",
    type: "dark",
    headerColor: "#e4f2e1ff",
    textColor: "#d2e8d0ff",
    mainColor: "#5aa469ff",
    lightMainColor: "#74c282ff",
    dimMainColor: "#4b8f59ff",
    grayColor: "#2f3b33ff",
    inputColor: "#5aa46980",
    bgColor: "#1c241eff",
    lightBgColor: "#232c25ff",
    lighterBgColor: "#29352dff",
    lightestBgColor: "#313f37ff",
    fail: "#df6174ff"
},{
    name: 'Light',
    type: 'light',
    headerColor: "#020202",
    textColor: "#080808",
    mainColor: "#018d6c",
    lightMainColor: "#00ad85",
    dimMainColor: "#006e55",
    grayColor: "#2f2f2f",
    inputColor: "#006e5580",
    bgColor: "#f8f8f8",
    lightBgColor: "#e8e8e8",
    lighterBgColor: "#dedede",
    lightestBgColor: "#d1d1d1ff",
    fail: "#a52100"
},{
    name: "Sandstone",
    type: "light",
    headerColor: "#1d1b18ff",
    textColor: "#2d2925",
    mainColor: "#d2a679ff",
    lightMainColor: "#e6bf95ff",
    dimMainColor: "#b8906aff",
    grayColor: "#dad4cfff",
    inputColor: "#b8906a80",
    bgColor: "#fdfaf6",
    lightBgColor: "#f6f0ebff",
    lighterBgColor: "#ece2daff",
    lightestBgColor: "#d3b59fff",
    fail: "#ff0000ff"
},{
    name: "Skyline",
    type: "light",
    headerColor: "#0a1a2fff",
    textColor: "#14213d",
    mainColor: "#0077b6",
    lightMainColor: "#00b4d8",
    dimMainColor: "#005f8a",
    grayColor: "#b0c4de",
    inputColor: "#0077b680",
    bgColor: "#d6dce2ff",
    lightBgColor: "#beccd6ff",
    lighterBgColor: "#99afc2ff",
    lightestBgColor: "#8fb2c9ff",
    fail: "#d62828ff"
},
{
    name: "Peach",
    type: "light",
    headerColor: "#3d0c02ff",
    textColor: "#432818",
    mainColor: "#f9844a",
    lightMainColor: "#f6aa1c",
    dimMainColor: "#e36414",
    grayColor: "#c9b5aaff",
    inputColor: "#e3641480",
    bgColor: "#fff5ec",
    lightBgColor: "#ffebd8",
    lighterBgColor: "#fde2c8",
    lightestBgColor: "#f9d8b6",
    fail: "#db0028ff"
},
{
    name: "Mint",
    type: "light",
    headerColor: "#1a2e1aff",
    textColor: "#243424",
    mainColor: "#5bb98c",
    lightMainColor: "#84d9ab",
    dimMainColor: "#449970",
    grayColor: "#cfd8d3ff",
    inputColor: "#5bb98c80",
    bgColor: "#f4fff9",
    lightBgColor: "#e7f8ef",
    lighterBgColor: "#d9efe4",
    lightestBgColor: "#cce6d8",
    fail: "#d81e1eff"
}]

const encoder = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-=!@#$%^&*()_+\`~,./<>?;\':\"[]{}\\|";

export const getID = () => {
    let id = "";
    for(let i = 0; i < 10; i++){
        id += encoder[random(0, encoder.length)];
    }

    return id;
}

export let settings = $state({
    clock24hr: false,
    animations: true,
    
})

export const saveGlobal = () => {
    const data = {
        clock24hr: settings.clock24hr,
        animations: settings.animations,
        colorIndex: color.index
    }
    localStorage.setItem("settings", JSON.stringify(data));
}

export const loadSettings = async () => {
    const data = JSON.parse(await localStorage.getItem("settings"));
    if(data == null){
        console.log("No Settings :(");
        return;
    }
    settings.clock24hr = data.clock24hr;
    settings.animations = data.animations;
    color.index = data.colorIndex;
    loadTheme(themes[data.colorIndex], color.index);
}


export const loadTheme = (theme, index) => { 
    color.name = theme.name;
    color.headerColor = theme.headerColor;
    color.textColor = theme.textColor;
    color.mainColor = theme.mainColor;
    color.lightMainColor = theme.lightMainColor;
    color.dimMainColor = theme.dimMainColor;
    color.grayColor = theme.grayColor;
    color.inputColor = theme.inputColor;
    color.bgColor = theme.bgColor;
    color.lightBgColor = theme.lightBgColor;
    color.lighterBgColor = theme.lighterBgColor;
    color.lightestBgColor = theme.lightestBgColor,
    color.fail = theme.fail;


    color.index = index;

    saveGlobal();
};



export const getRandomItem = (list) => {
  const index = Math.floor(Math.random() * list.length);
  return list[index];
};

export const random = (min, max) => { 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const getTimeUntil = (a) => {

    const appointmentDate = new Date(a.year, a.month, a.date, Math.floor(a.time / 60), a.time % 60);
    const now = new Date();
    // ignore this error because it's stupid
    // @ts-ignore
    const diff = (appointmentDate - now) / 60000;

    const daysUntil = diff / 1440;
    const hoursUntil = diff / 60;
    const minutesUntil = diff % 60;
    if((diff + a.duration) < 0){
        appState.homeNotification = true;
        return 'Done';
    }

    if(daysUntil >= 1){
        if(Math.floor(daysUntil) == 1){
            return `In 1 Day`
        } else {
            return `In ${Math.floor(daysUntil)} Days`
        }
    } else if (hoursUntil >= 1){
        if(Math.ceil(hoursUntil) == 1){
            if(minutesUntil > 1){
                return `In ${Math.floor(hoursUntil)} Hour, ${Math.floor(minutesUntil)} Minutes`
            } else if (Math.ceil(minutesUntil) == 1){
                return `In ${Math.floor(hoursUntil)} Hour, 1 Minute`
            } else {
                return `In ${Math.floor(hoursUntil)} Hour`
            }
        } else {
            if(minutesUntil > 1){
                return `In ${Math.floor(hoursUntil)} Hours, ${Math.floor(minutesUntil)} Minutes`
            } else if (Math.ceil(minutesUntil) == 1){
                return `In ${Math.floor(hoursUntil)} Hours, 1 Minute`
            } else {
                return `In ${Math.floor(hoursUntil)} Hours`
            }
        }
    } else if (minutesUntil > 0){
        if(minutesUntil > 2){
            return `In ${Math.ceil(minutesUntil)} Minutes`
        } else {
            return `In ${Math.ceil(minutesUntil)} Minute`
        }
    }
    return `For ${Math.floor(minutesUntil + a.duration)} More Minutes`
}

export let notifications = $state([]);

export const removeNotification = (thing) => {
    const index = notifications.indexOf(thing);
    notifications.splice(index, 1);
}

export const addNotification = (type, content, time, icon) => {
    let thing = {type: type, content: content, icon: icon, id: getID()};
    notifications.push(thing);
    setTimeout(() => {
        removeNotification(thing);
    }, time);
}