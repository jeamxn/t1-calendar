import dayjs from "dayjs";
import fetchCalendar from "./fetchCalendar";
import type { Event } from "./type";
import fs from "fs";
import pLimit from "p-limit";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const limit = pLimit(5);

export const cacheFolder = "./cache";

const processPromises = async (promises: Promise<Event[]>[]) => {
  const limitedPromises = promises.map((promise) => limit(() => promise));
  return Promise.all(limitedPromises);
};

const fetchOrCache = async (
  year: number,
  month: number,
  type: string | null,
): Promise<Event[]> => {
  let events: Event[] = [];
  const cachePath = `${cacheFolder}/${year}-${month}.json`;
  if (fs.existsSync(cachePath)) {
    const parsed = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
    const createdAt = dayjs(parsed.createdAt);
    if (parsed?.createdAt && dayjs().diff(createdAt, "day") < 1) {
      events = parsed.events;
    } else {
      events = (await fetchCalendar({ year, month })).events;
    }
  } else {
    events = (await fetchCalendar({ year, month })).events;
  }
  return type
    ? events.filter((event) =>
        event.label
          ? event.label.name.toLowerCase() === type.toLowerCase()
          : false,
      )
    : events;
};

const getEvents = async (type: string | null): Promise<Event[]> => {
  const promises = Array.from({ length: 24 }).map((_, i) => {
    const year = dayjs().year() - Math.floor(i / 12);
    const month = 12 - (i % 12);
    return fetchOrCache(year, month, type);
  });
  const events = await processPromises(promises);
  return events.flat();
};

export default getEvents;
