import { useEffect, useState } from "react";
import { useLocationStore } from "@/stores/weatherStore.ts";
import { getSidoName } from "@/features/district.ts";
import { TNowAir } from "@/types/air.ts";
import {
  FaFaceTired,
  FaFaceFrown,
  FaFaceMeh,
  FaFaceSmile,
} from "react-icons/fa6";
import { TbQuestionMark } from "react-icons/tb";
import { cn } from "@/lib/utils.ts";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";

const PM_GRADE: Record<
  string,
  { icon: React.ElementType; label: string; style: string }
> = {
  "1": { label: "좋음", icon: FaFaceSmile, style: "text-blue-500" },
  "2": { label: "보통", icon: FaFaceMeh, style: "text-green-400" },
  "3": { label: "나쁨", icon: FaFaceFrown, style: "text-amber-400" },
  "4": { label: "매우 나쁨", icon: FaFaceTired, style: "text-red-500" },
};

export default function AirInfo() {
  const { region } = useLocationStore();
  const [reqApi, setReqApi] = useState({ sido: "", station: "" });
  const [pmValue, setPmValue] = useState({
    pm10: { value: "", grade: "" },
    pm25: { value: "", grade: "" },
  });

  useEffect(() => {
    if (region) {
      const sidoName = getSidoName(region[0]);
      if (sidoName) {
        setReqApi({
          sido: sidoName,
          station: region[1] ? region[1] : region[2],
        });
      }
    }
  }, [region]);

  useEffect(() => {
    (async () => {
      if (!reqApi.sido || !reqApi.station) return;

      const data: TNowAir = await fetch(
        `${import.meta.env.VITE_SERVER_API}/air/now?sido=${reqApi.sido}&station=${reqApi.station}`,
      ).then((res) => res.json());

      if (data) {
        setPmValue({
          pm10: { value: data.pm10Value, grade: data.pm10Grade1h },
          pm25: { value: data.pm25Value, grade: data.pm25Grade1h },
        });
      }
    })();
  }, [reqApi]);

  const Pm10IconComponent =
    PM_GRADE[pmValue.pm10.grade as keyof typeof PM_GRADE]?.icon ||
    TbQuestionMark;
  const Pm25IconComponent =
    PM_GRADE[pmValue.pm25.grade as keyof typeof PM_GRADE]?.icon ||
    TbQuestionMark;

  return (
    <div className={"grid w-full grid-cols-2 justify-items-center"}>
      <div className={"flex w-full flex-col items-center"}>
        <p className={"text-lg"}>미세</p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div
                className={cn(
                  PM_GRADE[pmValue.pm10.grade]?.style,
                  "flex items-center gap-2",
                )}
              >
                <Pm10IconComponent className={"size-5"} />
                <p className={"text-xl font-bold"}>
                  {PM_GRADE[pmValue.pm10.grade]?.label}
                </p>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side={"bottom"}
              className={"bg-neutral-500 fill-neutral-500"}
            >
              <p className={"font-bold"}>{pmValue.pm10.value}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className={"flex w-full flex-col items-center"}>
        <p className={"text-lg"}>초미세</p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div
                className={cn(
                  PM_GRADE[pmValue.pm25.grade]?.style,
                  "flex items-center gap-2",
                )}
              >
                <Pm25IconComponent className={"size-5"} />
                <p className={"text-xl font-bold"}>
                  {PM_GRADE[pmValue.pm25.grade]?.label}
                </p>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side={"bottom"}
              className={"bg-neutral-500 fill-neutral-500"}
            >
              <p className={"font-bold"}>{pmValue.pm25.value}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
