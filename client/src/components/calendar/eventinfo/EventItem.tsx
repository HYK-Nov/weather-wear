import { TCalendarEvent } from "@/types/calendar.ts";
import dayjs from "dayjs";
import "dayjs/locale/ko.js";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { cn } from "@/lib/utils.ts";

dayjs.locale("ko");
dayjs.extend(LocalizedFormat);

export default function EventItem({ data }: { data: TCalendarEvent }) {
  const start = dayjs(data.start);
  const end = dayjs(data.end);

  return (
    <button
      className={"hover:bg-primary/5 dark:hover:bg-primary/10 w-full rounded"}
    >
      <div className="flex">
        <div
          className={cn(
            "text w-1.5 rounded-full",
            data.extendedProps?.color ?? "bg-primary",
          )}
        />
        <div className={"px-4 py-2 text-left"}>
          <p className={"truncate text-lg"}>{data.title}</p>
          {data.end && end.diff(start, "day") > 1 && (
            <p className={"text-sm text-neutral-500"}>
              {start.format("MMM D일")}&nbsp;~&nbsp;
              {end.subtract(1, "days").format("MMM D일")}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
