import { useCurrentEventStore } from "@/stores/calendarStore.ts";
import EventItem from "@/components/calendar/eventinfo/EventItem.tsx";
import dayjs from "dayjs";
import "dayjs/locale/ko.js";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import EventPopover from "@/components/calendar/eventinfo/EventPopover.tsx";
import EventInsert from "@/components/calendar/eventinfo/EventInsert.tsx";

dayjs.locale("ko");
dayjs.extend(LocalizedFormat);

export default function EventInfo() {
  const { curEvents } = useCurrentEventStore();
  return (
    <div className="flex h-full flex-col justify-between rounded border p-5 dark:border-neutral-700">
      <div className="flex flex-col">
        <h2 className={"font-bold"}>
          {dayjs(curEvents.date).format("MMM D일 dddd")}
        </h2>
        <div className={"flex grow flex-col gap-3 overflow-y-auto py-5"}>
          {curEvents?.events &&
            curEvents?.events.map((event) => (
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
      </div>
      <EventInsert date={curEvents.date} />
    </div>
  );
}
