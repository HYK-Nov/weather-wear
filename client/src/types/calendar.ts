export type TCalendarEvent = {
  title?: string;
  date?: string;
  start?: Date | string;
  end?: Date | string;
  allDay?: boolean;
  extendedProps?: {
    color?: string;
    id?: string;
  };
};

export type TEventInfo = {
  contents?: string;
} & TCalendarEvent;
