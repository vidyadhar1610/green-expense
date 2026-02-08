import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

/* 
  FullCalendar v6+ no longer exports CSS from daygrid or timegrid.
  The required CSS is imported globally in index.css:
  @import "@fullcalendar/common/main.css";
*/

export default function BillCalendar({ events, onDateClick, onEventClick }) {
  return (
    <div className="bg-white shadow-lg rounded-xl p-4">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="auto"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: ""
        }}
        events={events}
        dateClick={(info) => onDateClick(info.dateStr)}
        eventClick={(info) => onEventClick(info.event.extendedProps.bill)}
        dayMaxEvents={true}
        eventColor="#16a34a" // Tailwind green-600
      />
    </div>
  );
}

