import Main from "./lib/main.svelte";
import Settings from "./lib/settings.svelte";
import Calendar from "./lib/calendar.svelte";
import FocusDate from "./lib/focusDate.svelte";
import Theme from "./lib/theme.svelte";
import p404 from "./lib/404.svelte";
import NewAppointment from "./lib/newAppointment.svelte";
import AppointmentView from "./lib/appointmentView.svelte";
export const routes = {
    "/": Main,
    "/settings": Settings,
    "/calendar": Calendar,
    "/calendar/focus": FocusDate,
    "/new": NewAppointment,
    "/theme": Theme,
    "/apptView": AppointmentView,
    "*": p404
}