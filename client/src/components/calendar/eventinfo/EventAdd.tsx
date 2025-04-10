import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import dayjs from "dayjs";
import "dayjs/locale/ko.js";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { useEffect, useState } from "react";
import { TEventInfo } from "@/types/calendar.ts";
import { TbClock, TbTextPlus } from "react-icons/tb";
import EventDatePicker from "@/components/calendar/eventinfo/event/EventDatePicker.tsx";
import ColorPicker from "@/components/calendar/eventinfo/event/ColorPicker.tsx";
import { useEventListStore } from "@/stores/calendarStore.ts";

dayjs.locale("ko");
dayjs.extend(LocalizedFormat);

type Props = {
  date: Date;
};

export default function EventAdd({ date }: Props) {
  const [open, setOpen] = useState(false);
  const [event, setEvent] = useState<TEventInfo>({
    start: dayjs(date).format("YYYY-MM-DD"),
    end: dayjs(date).format("YYYY-MM-DD"),
    extendedProps: { color: "bg-sky-500" },
  });
  const { eventList, setEventList } = useEventListStore();

  useEffect(() => {
    setEvent((prev: any) => ({
      ...prev,
      start: date,
      end: date,
    }));
  }, [date]);

  useEffect(() => {
    setEvent({
      start: date,
      end: date,
    });
  }, [open]);

  const onClickEventAdd = () => {
    if ((event.title ?? "").trim().length > 0) {
      setEventList([
        ...(eventList ?? []),
        {
          ...event,
          start: dayjs(event.start).format("YYYY-MM-DD"),
          end: dayjs(event.end).add(1, "day").format("YYYY-MM-DD"),
          extendedProps: {
            color: event.extendedProps?.color ?? "bg-sky-500",
            id: Date.now().toString(),
          },
        },
      ]);
      setOpen(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className={"w-full text-left"}>
          <button className={"bg-primary text-background w-full rounded py-2"}>
            일정 추가하기
          </button>
        </DialogTrigger>
        <DialogContent>
          <div className={"flex flex-col gap-5 py-6"}>
            <div className={"grid grid-cols-10 text-xl"}>
              <ColorPicker
                value={event.extendedProps?.color || "bg-sky-500"}
                className={"col-span-1"}
                onColorChange={(color: string) =>
                  setEvent((prev) => ({
                    ...prev,
                    extendedProps: { color: color },
                  }))
                }
              />
              <input
                autoFocus={true}
                maxLength={50}
                onChange={(e) =>
                  setEvent((prev) => {
                    return { ...prev, title: e.target.value };
                  })
                }
                placeholder={"일정 제목"}
                className={
                  "focus:bg-primary/10 col-span-9 w-full rounded px-2 py-1 font-semibold focus:outline-none"
                }
              />
            </div>
            <div className={"grid grid-cols-10"}>
              <TbClock className={"col-span-1 size-[30px]"} />
              <div className={"col-span-9 flex w-full flex-col gap-2"}>
                <EventDatePicker
                  value={(event?.start as Date) || date}
                  fallback={date}
                  onChange={(day) => {
                    setEvent((prev: any) => ({
                      ...prev,
                      start: dayjs(day).format("YYYY-MM-DD"),
                      end:
                        dayjs(day).diff(event?.end) > 0
                          ? dayjs(date).format("YYYY-MM-DD")
                          : prev.end,
                    }));
                  }}
                />
                <EventDatePicker
                  value={(event?.end as Date) || date}
                  fallback={date}
                  onChange={(day) => {
                    setEvent((prev: any) => ({ ...prev, end: day }));
                  }}
                  disabled={(date) => !event?.start || date < event?.start}
                />
              </div>
            </div>
            <div className={"grid grid-cols-10"}>
              <TbTextPlus className={"col-span-1 size-[30px]"} />
              <textarea
                className={
                  "col-span-9 h-30 w-full resize-none rounded border p-3 dark:border-neutral-700"
                }
                maxLength={300}
                onChange={(e) =>
                  setEvent((prev) => {
                    return { ...prev, contents: e.target.value };
                  })
                }
              />
            </div>
          </div>
          <DialogFooter className={"flex items-center justify-center"}>
            <button
              className={
                "bg-primary text-background rounded px-10 py-2 font-bold"
              }
              onClick={onClickEventAdd}
            >
              저장
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
