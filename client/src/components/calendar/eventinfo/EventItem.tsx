import { TCalendarEvent } from "@/types/calendar.ts";
import dayjs from "dayjs";
import "dayjs/locale/ko.js";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { cn } from "@/lib/utils.ts";

dayjs.locale("ko");
dayjs.extend(LocalizedFormat);

export default function EventItem({ data }: { data: TCalendarEvent }) {
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
          style={{ backgroundColor: data.extendedProps?.color ?? "#000000" }}
        />
        <div className={"px-4 py-2 text-left"}>
          <p className={"text-lg"}>{data.title}</p>
          {data.end && (
            <p className={"text-sm text-neutral-500"}>
              {dayjs(data.start).format("MMM D일")}&nbsp;~&nbsp;
              {dayjs(data.end).subtract(1, "days").format("MMM D일")}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
