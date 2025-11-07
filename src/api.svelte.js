import Pocket from 'pocketbase';
import { addNotification, appState, getTimeUntil } from './global.svelte';
import { Check } from '@lucide/svelte';

// hosting pb on my personal server right now, but we'll have to switch it later
export const pb = new Pocket('https://georgeeggers.xyz');

/*

This contains code for some of the interfacing with the backend API
There are some file-specific functions in appointmentView.svelte and newAppointment.svelte, so make sure to replace those if changing the backend

*/

const getDay = (month, day, year) => {
  const date = new Date(year, month - 1, day);
  return date.getDay();
}

export const deleteDone = async () => {
    for(let i of appState.appointments){
        if(i.timeUntil == "Done"){
            await pb.collection('appointments').delete(i.id);
        }
    }
    addNotification('success', 'Expired appointments deleted!', 5000, Check);
    await refreshData();
}

export const refreshData = async () => {
    appState.appointments = [];
    await loadAppointments();
    for(let a of appState.appointments){
        a.timeUntil = getTimeUntil(a);
    }
}

export const convertPocketToJson = (i) => {
    let [recordDate, recordTime] = i.startTime.split(" ");
    let [year, month, date] = recordDate.split("-");
    let [hours, minutes, seconds] = recordTime.split(":");
    let time = (parseInt(hours) * 60) + parseInt(minutes);

    // program just needs to return JSON in this format. Pocketbase is, theoretically, replacable
    return {
        clientName: i.clientName,
        type: i.type,
        time: time,
        day: getDay(month, date, year),
        date: parseInt(date),
        month: parseInt(month) - 1,
        year: parseInt(year),
        duration: i.duration,
        timeUntil: "",
        notes: i.notes,
        id: i.id
    }
}

export const loadAppointments = async () => {
    const response = await pb.collection('appointments').getFullList({
        sort: '-created'
    });

    for(let i of response){
        appState.appointments.push(convertPocketToJson(i));
    }
}
