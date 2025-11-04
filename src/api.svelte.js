import Pocket from 'pocketbase';
import { appState } from './global.svelte';
export const pb = new Pocket('https://georgeeggers.xyz');
/*
        clientName: ,
        type: ,
        time: ,
        day: ,
        date: ,
        month: ,
        year: ,
        duration: 
        timeUntil: ""
*/

const getDay = (month, day, year) => {
  const date = new Date(year, month - 1, day);
  return date.getDay();
}


export const convertPocketToJson = (i) => {
    let [recordDate, recordTime] = i.startTime.split(" ");
    let [year, month, date] = recordDate.split("-");
    let [hours, minutes, seconds] = recordTime.split(":");
    let time = (parseInt(hours) * 60) + parseInt(minutes);

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
