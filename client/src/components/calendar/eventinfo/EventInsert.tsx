import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { cn } from "@/lib/utils.ts";
import dayjs from "dayjs";
import "dayjs/locale/ko.js";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { useEffect, useState } from "react";
import { TEventInfo } from "@/types/calendar.ts";
import { TbClock, TbTextPlus } from "react-icons/tb";
import { Button } from "@/components/ui/button.tsx";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

dayjs.locale("ko");
dayjs.extend(LocalizedFormat);

type Props = {
  date: Date;
};

export default function EventInsert({ date }: Props) {
  const [open, setOpen] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const [event, setEvent] = useState<TEventInfo>();

  /*const onClickBtn = () => {
    // localStorage.setItem("events", {});
    setOpen(false);
  };*/

  useEffect(() => {
    if (!open) {
      setStartOpen(false);
      setEndOpen(false);
    }
  }, [open]);

  useEffect(() => {
    setEvent((prev: any) => ({ ...prev, start: date }));
  }, [date]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className={"w-full text-left"}>
          <button className={"bg-primary text-background w-full rounded py-2"}>
            일정 추가하기
          </button>
        </DialogTrigger>
        <DialogContent>
          <div className={"flex flex-col gap-5 py-4"}>
            <div className={"flex items-center gap-5 text-xl"}>
              <button
                className={cn("h-6 w-6 rounded-full", "bg-primary")}
              ></button>
              <input
                tabIndex={-1}
                onChange={(e) =>
                  setEvent((prev) => {
                    return { ...prev, title: e.target.value };
                  })
                }
                placeholder={"일정 제목"}
                className={
                  "focus:bg-primary/10 w-full rounded px-2 py-1 font-semibold focus:outline-none"
                }
              />
            </div>
            <div className={"flex gap-5"}>
              <TbClock className={"size-[30px]"} />
              <div className={"flex w-full flex-col gap-2"}>
                <div className="relative">
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                    )}
                    onClick={() => setStartOpen((prev) => !prev)}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                      dayjs(event?.start || date).format("YYYY-MM-DD")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>

                  {startOpen && (
                    <div className="absolute z-10 mt-2 rounded-md border bg-white shadow-md dark:border-neutral-700">
                      <Calendar
                        mode="single"
                        selected={event?.start || date}
                        onSelect={(day) => {
                          setEvent((prev: any) => ({ ...prev, start: day }));
                          setStartOpen(false); // 선택하면 닫히게
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="relative">
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                    )}
                    onClick={() => setEndOpen((prev) => !prev)}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                      dayjs(event?.end || date).format("YYYY-MM-DD")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>

                  {endOpen && (
                    <div className="absolute z-10 mt-2 rounded-md border bg-white shadow-md dark:border-neutral-700">
                      <Calendar
                        mode="single"
                        selected={event?.end || date}
                        onSelect={(day) => {
                          setEvent((prev: any) => ({ ...prev, end: day }));
                          setEndOpen(false); // 선택하면 닫히게
                        }}
                        disabled={(date) =>
                          !event?.start || date < event?.start
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className={"flex gap-5"}>
              <TbTextPlus className={"size-[30px]"} />
              <textarea
                className={
                  "w-full resize-none border p-3 dark:border-neutral-700"
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
              onClick={() => setOpen(false)}
            >
              저장
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
