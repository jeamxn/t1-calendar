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
    "BEGIN:VTIMEZONE", // VTIMEZONE 시작
    "TZID:Asia/Seoul",
    "BEGIN:STANDARD",
    "DTSTART:19700101T000000",
    "TZOFFSETFROM:+0900",
    "TZOFFSETTO:+0900",
    "TZNAME:KST",
    "END:STANDARD",
    "END:VTIMEZONE", // VTIMEZONE 종료
  ];

  for (const event of events) {
    const stamp = dayjs(event.createdAt).tz("Asia/Seoul");
    console.log(event);

    const start = event.allDay
      ? dayjs(event.startAtAllDay).tz("Asia/Seoul").startOf("day")
      : dayjs(event.startAt).tz("Asia/Seoul");

    const end = event.allDay
      ? start.add(1, "day")
      : event.endAt
        ? dayjs(event.endAt).tz("Asia/Seoul")
        : start.add(1, "hour");

    lines.push(
      "BEGIN:VEVENT",
      `UID:${event.id}`,
      `DTSTAMP:${stamp.format("YYYYMMDDTHHmmss[Z]")}`,
      event.allDay
        ? `DTSTART;VALUE=DATE:${start.format("YYYYMMDD")}`
        : `DTSTART;TZID=Asia/Seoul:${start.format("YYYYMMDDTHHmmss")}`,
      event.allDay
        ? `DTEND;VALUE=DATE:${end.format("YYYYMMDD")}`
        : `DTEND;TZID=Asia/Seoul:${end.format("YYYYMMDDTHHmmss")}`,
      `SUMMARY:${event.title}${event.starAttendees?.length ? ` - ${event.starAttendees.map((a) => a.nickname).join(", ")}` : ""}`,
      `DESCRIPTION:${event.label?.name ?? ""}`,
      "CLASS:PUBLIC",
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
};

export default createICS;
