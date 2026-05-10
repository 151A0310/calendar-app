//FullCalendar→DB保存用に整形
export function toDbFormat(event) {
  return {
    id: event.id,
    title: event.title,
    start: event.start ? event.start.toISOString() : null,
    end: event.end ? event.end.toISOString() : null,
    color: event.backgroundColor,
    allDay: event.allDay,
  };
}

//DB→FullCalendar表示用に整形
export function toCalendarEvent(task) {
  return {
    id: task.id,
    title: task.title,
    start: task.start,
    end: task.end,
    color: task.color,
    allDay: task.allDay,
  };
}

export function fixExclusiveEnd(start, end, allDay) {
  if (!end) return end;
  if (allDay) return end;

  return end;
}
