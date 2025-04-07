import dayjs from "dayjs";
import "dayjs/locale/ko.js";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import Calendar from "@/components/calendar/Calendar.tsx";

dayjs.locale("ko");
dayjs.extend(LocalizedFormat);

export default function CalendarPage() {
  return (
    <div className={"grid h-full grid-cols-4 gap-5"}>
      <div className={"col-span-4 rounded border p-5 lg:col-span-3"}>
        <Calendar />
      </div>
      <div className={"col-span-1 hidden rounded border lg:block"}>
        <p>호에에엥</p>
      </div>
    </div>
  );
}
