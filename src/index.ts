import { serve } from "bun";

import createICS from "./createICS";
import getEvents from "./getEvents";

const fetch = async (req: Request) => {
  const url = new URL(req.url);
  if (url.pathname === "/calendar.ics") {
    const type = url.searchParams.get("type");
    const events = await getEvents(type);
    const ics = createICS(events);
    return new Response(ics, {
      headers: {
        "Content-Type": "text/calendar",
        "Content-Disposition": `attachment; filename="calendar.ics"`,
      },
    });
  } else {
    const events = await getEvents(null);
    const types = events.map(event => event.label?.name).filter((value, index, self) => value && self.indexOf(value) === index);

    return Response.json({
      error: true,
      message: "아래 링크를 사용하여 캘린더를 구독하세요.",
      types: {
        all: `${url.origin}/calendar.ics`,
        ...types.reduce((acc, type) => {
          if (type) {
            acc[type] = `${url.origin}/calendar.ics?type=${type}`;
          }
          return acc;
        }, {} as Record<string, string>),
      },
    }, {
      status: 404,
    });
  }
}

serve({
  port: 3000,
  fetch,
});

console.log("Server is running on http://localhost:3000/calendar.ics");
