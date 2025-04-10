import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const COLOR_CLASSES = [
  "bg-rose-500",
  "bg-amber-500",
  "bg-teal-400",
  "bg-sky-500",
];

type Props = {
  value: string;
  onColorChange: (color: string) => void;
} & React.ComponentPropsWithoutRef<"div">;

export default function ColorPicker({
  value,
  onColorChange,
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        e.target instanceof Node &&
        pickerRef.current &&
        !pickerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={pickerRef} className={cn("flex items-center", className)}>
      <button
        className={cn("size-6 rounded-full", value)}
        onClick={() => setOpen((prev) => !prev)}
      />
      {open && (
        <div className="absolute left-0 z-10 mt-1 flex gap-2 rounded-md bg-white p-2 shadow-md">
          {COLOR_CLASSES.map((color) => (
            <button
              key={color}
              className={cn(
                "size-6 rounded-full transition hover:scale-110",
                color,
                value === color && "ring-primary ring-2 ring-offset-2",
              )}
              onClick={() => {
                onColorChange(color);
                setOpen(false);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
