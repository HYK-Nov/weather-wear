export type TCalendarEvent = {
  title?: string;
  date?: string;
  start?: Date | null;
  end?: Date | null;
  allDay?: boolean;
  extendedProps?: {
    color?: string;
    id?: string;
  };
};

export type TEventInfo = {
  contents?: string;
} & TCalendarEvent;
