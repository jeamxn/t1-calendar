interface Label {
  id: string;
  name: string;
  color: string;
};

interface StarAttendee {
  id: string;
  nickname: string;
  avatarImgPath: string;
  type: string;
}

interface DefaultEvent {
  id: string;
  title: string;
  label?: Label;
  starAttendees?: StarAttendee[];
  linked: boolean;
  createdAt: string;
}

export type Event = DefaultEvent & ({
  startAt: string;
  endAt?: string;
  allDay: false;
} | {
  startAtAllDay: string;
  allDay: true;
});

export interface CalendarResponse {
  exposed: boolean;
  firstEventStartAt: string;
  lastEventEndAt: string;
  events: Event[];
};