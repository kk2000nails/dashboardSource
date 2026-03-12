import { addNotification, appState, getTimeUntil } from './global.svelte';
import { Check } from '@lucide/svelte';

import { createClient } from '@supabase/supabase-js';
export const SB_KEY = "sb_publishable_UBDi48qUodzBIIcElTWrTA_LzhyjanV"; // not even a private key so we can just publish like ts
export const sb = createClient("https://sbxythzxwezmeytccogi.supabase.co", SB_KEY);

/*

This contains code for some of the interfacing with the backend API
There are some file-specific functions in appointmentView.svelte and newAppointment.svelte, so make sure to replace those if changing the backend
^
Thanks George from the past. Helpful documentation

*/

const getDay = (month, day, year) => {
  const date = new Date(year, month - 1, day);
  return date.getDay();
}

export const deleteDone = async () => {
    let targetIDs = [];
    for(let i of appState.appointments){
        if(i.timeUntil == "Done"){
            targetIDs.push(i.id); // aggregate all done records into a list of their id's
        }
    }
    const { data, error } = await sb.from('appointments').delete().in('id', targetIDs); // delete all of target ids
    addNotification('success', 'Expired appointments deleted!', 5000, Check);
    await refreshData();
}

export const refreshData = async () => {
    appState.appointments.length = 0;
    await loadAppointments();
    for(let a of appState.appointments){
        a.timeUntil = getTimeUntil(a);
    }
}

// formats date and time and returns parsed JSON object from record
export const convertRecordToJson = (i) => {
    let [recordDate, recordTime] = i.startTime.split("T");
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
        tech: i.tech,
        phone: i.phone,
        id: i.id
    }
}

export const loadAppointments = async () => {
    const record = await sb.from('appointments').select();
    for(let i of record.data){
        appState.appointments.push(convertRecordToJson(i));
    }
}

export const loadTechnicians = async () => {
    appState.technicians.length = 0;
    const record = await sb.from('technicians').select();

    for(let i of record.data){
        appState.technicians.push(i);
    }
}
