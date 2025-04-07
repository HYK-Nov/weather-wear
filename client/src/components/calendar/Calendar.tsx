import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils.ts";
import "@/styles/Calendar.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

type TEvents = {
  title: string;
  date?: string;
  start?: string;
  end?: string;
  allDay?: boolean;
  color?: string;
};

export default function Calendar() {
  const calendarRef = useRef<FullCalendar>(null);
  const [curMonth, setCurMonth] = useState("");
  const [events, setEvents] = useState<TEvents[]>([
    { title: "event 1", date: "2025-04-01" },
    { title: "event 2", date: "2025-04-02" },
    {
      title: "event 3",
      start: "2025-04-03",
      end: "2025-04-05",
      allDay: true,
      color: "#f87171",
    },
  ]);

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

  return (
    <>
      <div className={"flex h-screen flex-col"}>
        {/* 헤더 */}
        <div className="flex items-center justify-between gap-4 pb-5 select-none">
          <div className="flex items-center gap-5">
            <div className="flex">
              <button
                onClick={handlePrev}
                className="hover:bg-primary/5 rounded-l-md border px-2 py-1"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={handleNext}
                className="hover:bg-primary/5 border-y px-2 py-1"
              >
                <ChevronRight />
              </button>
              <button
                onClick={handleToday}
                className="hover:bg-primary/5 rounded-r-md border px-3 py-1"
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
            events={events}
            datesSet={updateMonthText}
            dateClick={() => {}}
            selectable={true}
            dayCellContent={(arg) => {
              const onlyNumber = arg.dayNumberText.replace("일", "");
              return (
                <>
                  <div
                    className={cn(
                      {
                        "bg-primary text-background flex h-7 w-7 items-center justify-center rounded-lg":
                          arg.isToday,
                      },
                      { "text-red-500": arg.date.getDay() === 0 },
                      { "text-blue-500": arg.date.getDay() === 6 },
                    )}
                  >
                    <p>{onlyNumber}</p>
                  </div>
                </>
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
            headerToolbar={false}
            eventContent={(arg) => {
              return (
                <>
                  <p className={"text-background px-2"}>{arg.event.title}</p>
                </>
              );
            }}
            eventClick={(event) => {
              alert(event.event.title);
            }}
          />
        </div>
      </div>
    </>
  );
}
