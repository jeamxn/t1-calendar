import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import type { Event } from "./type";

dayjs.extend(utc);
dayjs.extend(timezone);

const createICS = (events: Event[]): string => {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "CALSCALE:GREGORIAN",
    "PRODID:-//Custom Calendar//EN",
  ];

  for (const event of events) {
    const stamp = dayjs.utc(event.createdAt); // UTC 변환
    console.log(event);
    
    const start = event.allDay
      ? dayjs.utc(event.startAtAllDay).startOf("day") // UTC 변환 + 날짜 시작점
      : dayjs.utc(event.startAt);
    
    const end = event.allDay
      ? start.add(1, "day") // 하루 추가
      : event.endAt
        ? dayjs.utc(event.endAt)
        : start.add(1, "hour"); // 기본적으로 1시간짜리 이벤트

    lines.push(
      "BEGIN:VEVENT",
      `UID:${event.id}`,
      `DTSTAMP:${stamp.format("YYYYMMDDTHHmmss[Z]")}`, // UTC 명시
      event.allDay
        ? `DTSTART;VALUE=DATE:${start.format("YYYYMMDD")}` // 날짜형식 (All-day 이벤트)
        : `DTSTART:${start.format("YYYYMMDDTHHmmss[Z]")}`, // UTC 적용
      event.allDay
        ? `DTEND;VALUE=DATE:${end.format("YYYYMMDD")}` // All-day 이벤트 처리
        : `DTEND:${end.format("YYYYMMDDTHHmmss[Z]")}`, // UTC 적용
      `SUMMARY:${event.title}${event.starAttendees?.length ? ` - ${event.starAttendees.map((a) => a.nickname).join(", ")}` : ""}`,
      `DESCRIPTION:${event.label?.name ?? ""}`,
      `CLASS:${event.linked ? "PUBLIC" : "PRIVATE"}`,
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
};

export default createICS;