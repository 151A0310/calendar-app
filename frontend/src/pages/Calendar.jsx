import React from "react";
import FullCalendar from "@fullcalendar/react";
import jaLocale from "@fullcalendar/core/locales/ja";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Link, useNavigate } from "react-router-dom";

const Calendar = ({ events, fetchEvents }) => {
  const navigate = useNavigate();

  // DBのendに+1 日してFullCalendar に渡す
  function adjustEnd(start, end) {
    if (!end) return start;

    // 時間ありイベントはそのまま
    if (start.includes("T") || end.includes("T")) {
      return end;
    }

    // 終日：DB の end（inclusive）を +1 日して exclusive にする
    const e = new Date(end);
    e.setDate(e.getDate() + 1);
    return e.toISOString().split("T")[0];
  }

  function toISO(datetime) {
    if (!datetime) return null;
    return datetime.replace(" ", "T").slice(0, 16);
  }

  return (
    <div>
      <Link to="/add">
        <button className="floatingAddBtn">+</button>
      </Link>

      <FullCalendar
        locales={[jaLocale]}
        locale="ja"
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        editable={true}
        selectable={true}

        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay"
        }}

        //終日イベント
        events={events.map(e => {
          const startISO = toISO(e.start);
          const endISO = adjustEnd(toISO(e.start), toISO(e.end));

          const isAllDay =
            e.start.length === 10 && e.end.length === 10;

          return {
            id: e.id,
            title: e.title,
            start: startISO,
            end: endISO,
            color: e.color,
            allDay: isAllDay
          };
        })}

        //編集画面遷移
        eventClick={(info) => {
          const id = info.event.id;
          navigate(`/edit/${id}`);
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
            // 終日イベント
            const startDate = new Date(info.event.startStr);

            const endDate = info.event.endStr
              ? new Date(info.event.endStr)
              : new Date(info.event.startStr);

            // exclusive → inclusive
            endDate.setDate(endDate.getDate() - 1);

            startStr = startDate.toISOString().split("T")[0];
            endStr = endDate.toISOString().split("T")[0];
          } else {
            // 時間ありイベント
            const start = info.event.start; // Date object
            const end = info.event.end || info.event.start;

            // JST のまま yyyy-mm-ddThh:mm に変換
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

          await fetch(`https://calendar-app-gdwo.onrender.com/api/tasks/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: info.event.title,
              start: isTimed ? startStr.replace("T", " ") + ":00" : startStr,
              end: isTimed ? endStr.replace("T", " ") + ":00" : endStr,
              color: info.event.backgroundColor
            })
          });

          fetchEvents();
        }}

        //イベントの縮小、拡大時の処理
        eventResize={async (info) => {
          const id = info.event.id;
          const isTimed = info.event.allDay === false;

          let startStr, endStr;

          if (!isTimed) {
            // 終日イベント
            const startDate = new Date(info.event.startStr);

            const endDate = info.event.endStr
              ? new Date(info.event.endStr)
              : new Date(info.event.startStr);

            // exclusive → inclusive
            endDate.setDate(endDate.getDate() - 1);

            startStr = startDate.toISOString().split("T")[0];
            endStr = endDate.toISOString().split("T")[0];
          } else {
            // 時間ありイベント
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

          await fetch(`https://calendar-app-gdwo.onrender.com/api/tasks/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: info.event.title,
              start: isTimed ? startStr.replace("T", " ") + ":00" : startStr,
              end: isTimed ? endStr.replace("T", " ") + ":00" : endStr,
              color: info.event.backgroundColor
            })
          });

          fetchEvents();
        }}

      />
    </div>
  );
};

export default Calendar;