// FullCalendar → DB 保存用に整形
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

// DB → FullCalendar 表示用に整形
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

// FullCalendar の exclusive end を補正（必要な場合のみ）
export function fixExclusiveEnd(start, end, allDay) {
  if (!end) return end;

  // 終日の場合はそのまま
  if (allDay) return end;

  // FullCalendar の end は「終了時刻を含まない」ため、
  // あなたの構成では補正しない方針だった
  return end;
}
