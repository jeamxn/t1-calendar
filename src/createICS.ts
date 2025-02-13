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
    const stamp = dayjs.utc(event.createdAt);
    console.log(event);
    const start = event.allDay
      ? dayjs(event.startAtAllDay).utc().startOf("day")
      : dayjs(event.startAt).utc();
    const end = event.allDay
      ? start.add(1, "day")
      : event.endAt
        ? dayjs(event.endAt).utc()
        : start.add(1, "hour");

    lines.push(
      "BEGIN:VEVENT",
      `UID:${event.id}`,
      `DTSTAMP:${stamp.format("YYYYMMDDTHHmmss[Z]")}`,
      `SUMMARY:${event.title}${event.starAttendees?.length ? ` - ${event.starAttendees.map((a) => a.nickname).join(", ")}` : ""}`,
      event.allDay
        ? `DTSTART;VALUE=DATE:${start.format("YYYYMMDD")}`
        : `DTSTART:${start.format("YYYYMMDDTHHmmss[Z]")}`,
      event.allDay
        ? `DTEND;VALUE=DATE:${end.format("YYYYMMDD")}`
        : `DTEND:${end.format("YYYYMMDDTHHmmss[Z]")}`,
      `DESCRIPTION:${event.label?.name ?? ""}`,
      `CLASS:${event.linked ? "PUBLIC" : "PRIVATE"}`,
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
};

export default createICS;
