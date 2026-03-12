import Main from "./lib/main.svelte";
import Settings from "./lib/settings.svelte";
import Calendar from "./lib/calendar.svelte";
import FocusDate from "./lib/focusDate.svelte";
import Theme from "./lib/theme.svelte";
import p404 from "./lib/404.svelte";
import NewAppointment from "./lib/newAppointment.svelte";
import AppointmentView from "./lib/appointmentView.svelte";
import TechManager from "./lib/techManager.svelte";
export const routes = {
    "/": Calendar,
    "/settings": Settings,
    "/calendar": Main,
    "/calendar/focus": FocusDate,
    "/new": NewAppointment,
    "/theme": Theme,
    "/apptView": AppointmentView,
    "/users": TechManager,
    "*": p404
}