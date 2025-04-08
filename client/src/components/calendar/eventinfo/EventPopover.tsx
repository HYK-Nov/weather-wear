import { EventContentArg } from "@fullcalendar/core";
import dayjs from "dayjs";
import "dayjs/locale/ko.js";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { cn } from "@/lib/utils.ts";
import { TCalendarEvent } from "@/types/calendar.ts";
import { useEffect, useState } from "react";
import { TbClock } from "react-icons/tb";

dayjs.locale("ko");
dayjs.extend(LocalizedFormat);

type Props =
  | {
      children: React.ReactNode;
      arg: EventContentArg;
    }
  | { children: React.ReactNode; event: TCalendarEvent };

export default function EventPopover({ children, ...props }: Props) {
  const event = "arg" in props ? props.arg.event : props.event; // 타입 좁히기

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(event.title);

  useEffect(() => {
    setTitle(event.title);
  }, [event]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className={"w-full text-left"}>{children}</DialogTrigger>
        <DialogContent>
          <div className={"flex flex-col gap-5 py-4"}>
            <div className={"flex items-center gap-5 text-xl"}>
              <div
                className={cn(
                  "h-6 w-6 rounded-full",
                  event.extendedProps?.color ?? "bg-primary",
                )}
              ></div>
              <input
                tabIndex={-1}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={"일정 제목"}
                className={
                  "focus:bg-primary/10 w-full rounded px-2 py-1 font-semibold focus:outline-none"
                }
              />
            </div>
            <div className={"flex gap-5"}>
              <TbClock className={"size-[30px]"} />
              <div className={"flex w-full flex-col gap-2"}>
                <div className="flex items-center">
                  <p>
                    {dayjs(event.start).format("MMM D일")}
                    {event.end !== null &&
                      ` ~ ${dayjs(event.end).format("MMM D일")}`}
                  </p>
                </div>
                <div className="relative"></div>
              </div>
            </div>
          </div>
          <DialogFooter className={"flex items-center justify-center"}>
            <button
              className={
                "bg-background text-primary border-primary hover:bg-primary/10 rounded border px-8 py-2 font-bold"
              }
              onClick={() => setOpen(false)}
            >
              삭제
            </button>
            <button
              className={
                "bg-primary text-background rounded px-8 py-2 font-bold"
              }
              onClick={() => setOpen(false)}
            >
              수정
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
