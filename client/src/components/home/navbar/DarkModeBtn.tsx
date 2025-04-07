import { cn } from "@/lib/utils.ts";
import { useEffect, useState } from "react";
import { HiMiniMoon, HiMiniSun } from "react-icons/hi2";

export default function DarkModeBtn() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const theme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    return theme === "dark" || (!theme && prefersDark);
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggle = () => setIsDark((prev) => !prev);

  return (
    <button
      className={cn(
        "hover:bg-primary hover:text-background rounded-full p-3 transition",
      )}
      onClick={toggle}
    >
      {isDark ? <HiMiniSun size={25} /> : <HiMiniMoon size={25} />}
    </button>
  );
}
