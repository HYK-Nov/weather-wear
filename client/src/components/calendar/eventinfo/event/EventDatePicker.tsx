import { useEffect, useRef, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";

type Props = {
  value: Date;
  fallback: Date;
  onChange: (date: Date) => void;
  disabled?: (date: Date) => boolean;
};

export default function EventDatePicker({
  value,
  fallback,
  onChange,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false);
  const calRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        event.target instanceof Node &&
        calRef.current &&
        !calRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <Button
        variant="outline"
        className={cn("w-full justify-start text-left font-normal")}
        onClick={() => setOpen((prev) => !prev)}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {dayjs(value || fallback).format("YYYY-MM-DD")}
      </Button>

      {open && (
        <div
          ref={calRef}
          className="absolute z-10 mt-2 rounded-md border bg-white shadow-md dark:border-neutral-700"
        >
          <Calendar
            mode="single"
            selected={value || fallback}
            onSelect={(day) => {
              if (day) {
                onChange(day);
                setOpen(false);
              }
            }}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
}
