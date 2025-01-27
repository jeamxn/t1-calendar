import axios from "axios";
import type { CalendarResponse } from "./type";
import dayjs from "dayjs";
import fs from "fs";
import { cacheFolder } from "./getEvents";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const fetchCalendar = async ({
  year = 2025,
  month = 1,
}: {
  year: number;
  month: number;
}): Promise<CalendarResponse> => {
  const baseUrl = "https://t1.fan/svc/space/api/v1/calendar";

  const today = dayjs(`${year}-${month}-01`);
  const startAt = today.startOf("month").startOf("day");
  const endAt = today.endOf("month").endOf("day");

  const params = {
    startAt: startAt.toISOString(),
    endAt: endAt.toISOString(),
    startAtForAllDay: startAt.format("YYYY-MM-DD"),
    endAtForAllDay: endAt.format("YYYY-MM-DD"),
  };

  const { data } = await axios.get<CalendarResponse>(baseUrl, { params });

  const cachePath = `${cacheFolder}/${year}-${month}.json`;
  const exportData = {
    createdAt: dayjs().toISOString(),
    ...data,
  };

  fs.mkdirSync(cacheFolder, { recursive: true });
  fs.writeFileSync(cachePath, JSON.stringify(exportData, null, 2));

  return data;
};

export default fetchCalendar;
