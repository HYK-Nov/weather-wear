import { TCalendarEvent, TEventInfo } from "@/types/calendar.ts";
import { create } from "zustand/index";

type CurrentEventsStore = {
  curEvents: { date: Date; events: TCalendarEvent[] | [] };
  setCurEvents: (data: { date: Date; events: TCalendarEvent[] | [] }) => void;
};

type EventListStore = {
  eventList: TEventInfo[] | [];
  setEventList: (eventList: TEventInfo[] | []) => void;
};

export const useCurrentEventStore = create<CurrentEventsStore>((set) => ({
  curEvents: { date: new Date(), events: [] },
  setCurEvents: (data: { date: Date; events: TCalendarEvent[] | [] }) =>
    set(() => ({ curEvents: data })),
}));

export const useEventListStore = create<EventListStore>((set) => ({
  eventList: JSON.parse(<string>localStorage.getItem("eventList") || "[]"),
  setEventList: (data: TEventInfo[]) =>
    set(() => {
      localStorage.setItem("eventList", JSON.stringify(data));
      return {
        eventList: data,
      };
    }),
}));
