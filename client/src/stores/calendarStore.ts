import { TCalendarEvent } from "@/types/calendar.ts";
import { create } from "zustand/index";

type CurrentEventsStore = {
  curEvents: { date: Date; events: TCalendarEvent[] | null };
  setCurEvents: (event: {
    date: Date;
    events: TCalendarEvent[] | null;
  }) => void;
};

export const useCurrentEventStore = create<CurrentEventsStore>((set) => ({
  curEvents: { date: new Date(), events: null },
  setCurEvents: (data: { date: Date; events: TCalendarEvent[] | null }) =>
    set(() => ({ curEvents: data })),
}));
