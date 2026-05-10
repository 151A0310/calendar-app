import React, { useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import jaLocale from "@fullcalendar/core/locales/ja";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Link, useNavigate } from "react-router-dom";
import authFetch from "../utils/authFetch";

const Calendar = ({ events, fetchEvents }) => {
  const navigate = useNavigate();
  const calendarRef = useRef(null);

  // DBのendに+1 日してFullCalendar に渡す
  function adjustEnd(start, end) {
    if (!end) return start;

    if (start.includes("T") || end.includes("T")) {
      return end;
    }

    const e = new Date(end);
    e.setDate(e.getDate() + 1);
    return e.toISOString().split("T")[0];
  }

  function toISO(datetime) {
    if (!datetime) return null;
    return datetime.replace(" ", "T").slice(0, 16);
  }

  return (
    <div className="calendar-wrapper page">

      <Link to="/add">
        <button className="floatingAddBtn">+</button>
      </Link>

      <FullCalendar
        ref={calendarRef}
        locales={[jaLocale]}
        locale="ja"
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        editable={true}
        selectable={true}
        eventStartEditable={true}
        eventDurationEditable={true}

        slotDuration="00:15:00"
        slotMinTime="00:00:00"
        slotMaxTime="24:00:00"

        height="100%"
        contentHeight="100%"
        expandRows={true}

        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay"
        }}

        events={events.map(e => {
          const startISO = toISO(e.start);
          const endISO = adjustEnd(toISO(e.start), toISO(e.end));
          const isAllDay = e.start.length === 10 && e.end.length === 10;
          if (e.description === null) e.description = "";

          return {
            id: e.id,
            title: e.title,
            start: startISO,
            end: endISO,
            color: e.color,
            description: e.description,
            allDay: isAllDay
          };
        })}

        eventClick={(info) => {
          navigate(`/edit/${info.event.id}`);
        }}

        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        }}

        eventDrop={async (info) => {
          const id = info.event.id;
          const isTimed = info.event.allDay === false;

          let startStr, endStr;

          if (!isTimed) {
            const startDate = new Date(info.event.startStr);
            const endDate = info.event.endStr
              ? new Date(info.event.endStr)
              : new Date(info.event.startStr);

            endDate.setDate(endDate.getDate() - 1);

            startStr = startDate.toISOString().split("T")[0];
            endStr = endDate.toISOString().split("T")[0];
          } else {
            const start = info.event.start;
            const end = info.event.end || info.event.start;

            const formatLocal = (d) => {
              const yyyy = d.getFullYear();
              const mm = String(d.getMonth() + 1).padStart(2, "0");
              const dd = String(d.getDate()).padStart(2, "0");
              const hh = String(d.getHours()).padStart(2, "0");
              const mi = String(d.getMinutes()).padStart(2, "0");
              return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
            };

            startStr = formatLocal(start);
            endStr = formatLocal(end);
          }

          const res = await authFetch(`/tasks/${id}`, {
            method: "PUT",
            body: JSON.stringify({
              title: info.event.title,
              start: isTimed ? startStr.replace("T", " ") + ":00" : startStr,
              end: isTimed ? endStr.replace("T", " ") + ":00" : endStr,
              color: info.event.backgroundColor
            })
          });

          if (!res.ok) {
            console.error("PUT failed");
            return;
          }

          fetchEvents();
        }}

        eventResize={async (info) => {
          const id = info.event.id;
          const isTimed = info.event.allDay === false;

          let startStr, endStr;

          if (!isTimed) {
            const startDate = new Date(info.event.startStr);
            const endDate = info.event.endStr
              ? new Date(info.event.endStr)
              : new Date(info.event.startStr);

            endDate.setDate(endDate.getDate() - 1);

            startStr = startDate.toISOString().split("T")[0];
            endStr = endDate.toISOString().split("T")[0];
          } else {
            const start = info.event.start;
            const end = info.event.end || info.event.start;

            const formatLocal = (d) => {
              const yyyy = d.getFullYear();
              const mm = String(d.getMonth() + 1).padStart(2, "0");
              const dd = String(d.getDate()).padStart(2, "0");
              const hh = String(d.getHours()).padStart(2, "0");
              const mi = String(d.getMinutes()).padStart(2, "0");
              return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
            };

            startStr = formatLocal(start);
            endStr = formatLocal(end);
          }

          const res = await authFetch(`/tasks/${id}`, {
            method: "PUT",
            body: JSON.stringify({
              title: info.event.title,
              start: isTimed ? startStr.replace("T", " ") + ":00" : startStr,
              end: isTimed ? endStr.replace("T", " ") + ":00" : endStr,
              color: info.event.backgroundColor
            })
          });

          if (!res.ok) {
            console.error("PUT failed");
            return;
          }

          fetchEvents();
        }}
      />
    </div>
  );
};

export default Calendar;
