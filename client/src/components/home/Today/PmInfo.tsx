import { useLocationStore } from "@/stores/weatherStore.ts";
import { useEffect, useState } from "react";
import { getSidoName } from "@/features/district.ts";
import { TNowAir } from "@/types/air.ts";
import {
  FaFaceSmile,
  FaFaceMeh,
  FaFaceTired,
  FaFaceFrownOpen,
} from "react-icons/fa6";
import { TbQuestionMark } from "react-icons/tb";
import { cn } from "@/lib/utils.ts";

const PM_GRADE_STYLE: Record<
  string,
  { icon: React.ElementType; style: string; label: string }
> = {
  "1": { label: "좋음", icon: FaFaceSmile, style: "text-blue-500" },
  "2": { label: "보통", icon: FaFaceMeh, style: "text-green-400" },
  "3": { label: "나쁨", icon: FaFaceFrownOpen, style: "text-amber-400" },
  "4": { label: "매우나쁨", icon: FaFaceTired, style: "text-red-500" },
};

export default function PmInfo() {
  const { region } = useLocationStore();
  const [airInfo, setAirInfo] = useState<TNowAir>();

  useEffect(() => {
    if (!region) return;

    const sidoName = getSidoName(region[0]);
    const stationName = region[1] ? region[1] : region[2];

    (async () => {
      try {
        const data = await fetch(
          `${import.meta.env.VITE_SERVER_API}/api/air/now?sido=${sidoName}&station=${stationName}`,
        ).then((res) => res.json());

        if (data) {
          setAirInfo(data);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [region]);

  const Pm10Icon =
    PM_GRADE_STYLE[airInfo?.pm10Grade1h as keyof typeof PM_GRADE_STYLE]?.icon ||
    TbQuestionMark;
  const Pm25Icon =
    PM_GRADE_STYLE[airInfo?.pm25Grade1h as keyof typeof PM_GRADE_STYLE]?.icon ||
    TbQuestionMark;

  return (
    <div
      className={
        "bg-background flex h-fit w-full flex-col justify-center gap-1 rounded-lg border px-3 py-2 font-bold break-keep dark:border-neutral-700"
      }
    >
      {airInfo && (
        <>
          {/* 미세 */}
          <div className={"flex items-center justify-between gap-3"}>
            <p className={"text-sm text-neutral-700 dark:text-white/70"}>
              미세
            </p>
            <div
              className={cn(
                PM_GRADE_STYLE[airInfo.pm10Grade1h].style,
                "flex items-center gap-1",
              )}
            >
              <Pm10Icon className={"size-5"} />
              <p>{PM_GRADE_STYLE[airInfo.pm10Grade1h].label}</p>
            </div>
          </div>
          {/* 초미세 */}
          <div className={"flex items-center justify-between gap-3"}>
            <p className={"text-sm text-neutral-700 dark:text-white/70"}>
              초미세
            </p>
            <div
              className={cn(
                PM_GRADE_STYLE[airInfo.pm25Grade1h].style,
                "flex items-center gap-1",
              )}
            >
              <Pm25Icon className={"size-5"} />
              <p>{PM_GRADE_STYLE[airInfo.pm25Grade1h].label}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
