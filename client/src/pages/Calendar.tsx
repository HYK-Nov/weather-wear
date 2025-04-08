import dayjs from "dayjs";
import "dayjs/locale/ko.js";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import Calendar from "@/components/calendar/Calendar.tsx";
import { useEffect } from "react";
import { useWeeklyWeatherStore } from "@/stores/weatherStore.ts";
import EventInfo from "@/components/calendar/EventInfo.tsx";

dayjs.locale("ko");
dayjs.extend(LocalizedFormat);

export default function CalendarPage() {
  const { weeklyWeather, setWeeklyWeather } = useWeeklyWeatherStore();
  useEffect(() => {
    if (!weeklyWeather) {
      /* empty */
    }

    const titleElement = document.getElementsByTagName("title")[0];
    titleElement.innerHTML = `웨더웨어 | 캘린더`;
  }, []);

  return (
    <div className={"grid h-full grid-cols-4 gap-5"}>
      <div
        className={
          "col-span-4 rounded border p-5 lg:col-span-3 dark:border-neutral-700"
        }
      >
        <Calendar />
      </div>
      <div className="sticky top-8 col-span-1 hidden h-[calc(100vh-50px)] overflow-y-auto lg:block">
        <EventInfo />
      </div>
    </div>
  );
}
