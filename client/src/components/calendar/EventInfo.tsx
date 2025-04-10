import { useCurrentEventStore } from "@/stores/calendarStore.ts";
import EventItem from "@/components/calendar/eventinfo/EventItem.tsx";
import dayjs from "dayjs";
import "dayjs/locale/ko.js";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import EventPopover from "@/components/calendar/eventinfo/EventPopover.tsx";
import EventAdd from "@/components/calendar/eventinfo/EventAdd.tsx";
import { useEffect, useState } from "react";
import { TCalendarEvent } from "@/types/calendar.ts";

dayjs.locale("ko");
dayjs.extend(LocalizedFormat);

export default function EventInfo() {
  const { curEvents } = useCurrentEventStore();
  const [events, setEvents] = useState<TCalendarEvent[]>([]);

  useEffect(() => {
    setEvents([...curEvents.events]);
  }, [curEvents]);

  return (
    <div className="flex h-full flex-col justify-between rounded border p-5 dark:border-neutral-700">
      <>
        <div className="flex flex-col">
          <h2 className={"font-bold"}>
            {dayjs(curEvents.date).format("MMM D일 dddd")}
          </h2>
          {events.length > 0 && (
            <div className={"flex grow flex-col gap-3 overflow-y-auto py-5"}>
              {events.map((event) => (
                <EventPopover
                  event={event}
                  key={`${event.title}-${event.start}-popup`}
                >
                  <EventItem
                    key={`${event.title}-${event.date}-info`}
                    data={event}
                  />
                </EventPopover>
              ))}
            </div>
          )}
        </div>
        <EventAdd date={curEvents.date} />
      </>
    </div>
  );
}
