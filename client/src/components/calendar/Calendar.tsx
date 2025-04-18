import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils.ts";
import "@/styles/Calendar.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useCurrentEventStore,
  useEventListStore,
} from "@/stores/calendarStore.ts";
import dayjs from "dayjs";
import "dayjs/locale/ko.js";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import EventPopover from "@/components/calendar/eventinfo/EventPopover.tsx";
import { useWeeklyWeatherStore } from "@/stores/weatherStore.ts";
import WeatherIcon from "@/components/common/WeatherIcon.tsx";
import { getMidCode, getNxNy, getRainCode } from "@/features/apiCode.ts";
import { district } from "@/features/district.ts";

dayjs.locale("ko");
dayjs.extend(LocalizedFormat);

export default function Calendar() {
  const { setCurEvents } = useCurrentEventStore();
  const { weeklyWeather, setWeeklyWeather } = useWeeklyWeatherStore();
  const calendarRef = useRef<FullCalendar>(null);
  const [curMonth, setCurMonth] = useState("");
  const { eventList } = useEventListStore();

  const updateMonthText = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      setCurMonth(calendarApi.view.title);
    }
  };

  useEffect(() => {
    updateMonthText();
  }, []);

  const handleToday = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.today();
  };

  const handlePrev = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.prev();
  };

  const handleNext = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.next();
  };

  const onClickDate = (arg: DateClickArg) => {
    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) return;

    const eventsOnDate = calendarApi.getEvents().filter((event) => {
      const start = dayjs(event.start);
      const end = dayjs(event.end);
      const clicked = dayjs(arg.date);

      return (
        clicked.isSame(start, "day") ||
        (clicked.isAfter(start, "day") && clicked.isBefore(end, "day"))
      );
    });

    const result = eventsOnDate.map((item) => {
      return {
        title: item.title,
        start: item.start ?? undefined,
        end: item.end ?? undefined,
        extendedProps: {
          color: item.extendedProps.color,
          id: item.extendedProps.id,
        },
      };
    });

    setCurEvents({ date: arg.date, events: result });
  };

  useEffect(() => {
    if (!weeklyWeather) {
      const getCurrentDistrict = (): Promise<{
        region: string[];
        code: string;
      }> => {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition((position) => {
            district(position.coords)
              .then((res) => {
                const region = [
                  res.region_1depth_name,
                  res.region_2depth_name,
                  res.region_3depth_name,
                ];
                const code = res.code;
                resolve({ region, code });
              })
              .catch(reject);
          }, reject);
        });
      };

      (async () => {
        try {
          const { region, code } = await getCurrentDistrict();
          const midCode = await getMidCode(region);
          const nxny = await getNxNy(code);
          const rainCode = await getRainCode(region);

          if (!midCode || !nxny || !rainCode) return;

          const res = await fetch(
            `${import.meta.env.VITE_SERVER_API}/api/weather/week?regId1=${midCode}&regId2=${rainCode}&nx=${nxny["격자 X"]}&ny=${nxny["격자 Y"]}`,
          );
          const data = await res.json();
          setWeeklyWeather(data);
        } catch (err) {
          console.error(err);
        }
      })();
    }
  }, []);

  return (
    <>
      <div className={"relative"}>
        <div className={"flex h-screen flex-col"}>
          {/* 헤더 */}
          <div className="flex items-center justify-between gap-4 pb-5 select-none">
            <div className="flex items-center gap-5">
              <div className="flex">
                <button
                  onClick={handlePrev}
                  className="hover:bg-primary/5 rounded-l-md border px-2 py-1 dark:border-neutral-700"
                >
                  <ChevronLeft />
                </button>
                <button
                  onClick={handleNext}
                  className="hover:bg-primary/5 border-y px-2 py-1 dark:border-neutral-700"
                >
                  <ChevronRight />
                </button>
                <button
                  onClick={handleToday}
                  className="hover:bg-primary/5 rounded-r-md border px-3 py-1 dark:border-neutral-700"
                >
                  오늘
                </button>
              </div>
              <h2 className="text-2xl font-bold">{curMonth}</h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              locale={"ko"}
              height={"100%"}
              contentHeight={"100%"}
              expandRows={true}
              titleFormat={{ year: "numeric", month: "short" }}
              events={eventList}
              datesSet={updateMonthText}
              selectable={true}
              headerToolbar={false}
              dayCellContent={(arg) => {
                const date = dayjs(arg.date);
                const index = date.diff(dayjs().startOf("day"), "day");
                const onlyNumber = arg.dayNumberText.replace("일", "");

                const weather = index >= 0 && weeklyWeather?.[index];

                const icon = weather ? (
                  <WeatherIcon
                    state={weather.pmWf}
                    className={"daycell-icon size-[20px]"}
                  />
                ) : null;

                return (
                  <div className="daycell-content flex flex-col items-center gap-1 leading-none">
                    <div
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full",
                        arg.isToday && "bg-primary text-background",
                        !arg.isToday &&
                          (arg.date.getDay() === 0
                            ? "text-red-500"
                            : arg.date.getDay() === 6
                              ? "text-blue-500"
                              : ""),
                      )}
                    >
                      {onlyNumber}
                    </div>
                    {icon}
                  </div>
                );
              }}
              dayHeaderContent={(arg) => {
                return (
                  <>
                    <p
                      className={cn(
                        { "text-red-500": arg.text === "일" },
                        { "text-blue-500": arg.text === "토" },
                      )}
                    >
                      {arg.text}
                    </p>
                  </>
                );
              }}
              dayMaxEvents={2}
              dateClick={onClickDate}
              eventDidMount={(arg) => {
                arg.el.style.border = "0px";
                arg.el.style.backgroundColor = "transparent";
                arg.el.style.paddingLeft = "0.3rem";
                arg.el.style.paddingRight = "0.3rem";
              }}
              eventContent={(arg) => {
                return (
                  <>
                    <EventPopover arg={arg}>
                      <div
                        className={`rounded ${arg.event.extendedProps.color} mb-1`}
                      >
                        <p className={"text-background truncate px-2"}>
                          {arg.event.title}
                        </p>
                      </div>
                    </EventPopover>
                  </>
                );
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
