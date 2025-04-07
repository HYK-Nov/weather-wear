import dayjs from "dayjs";
import "dayjs/locale/ko.js";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { cn } from "@/lib/utils.ts";
import { TDayTemp } from "@/types/weather.ts";
import { MdWaterDrop } from "react-icons/md";
import WeatherIcon from "@/components/common/WeatherIcon.tsx";

dayjs.locale("ko");
dayjs.extend(LocalizedFormat);

const DayOfWeek = {
  0: "일",
  1: "월",
  2: "화",
  3: "수",
  4: "목",
  5: "금",
  6: "토",
} as const;

export default function WeeklyItem({
  data,
  later,
}: {
  later: number | string;
  data: TDayTemp;
}) {
  const NOW = dayjs();
  const DATE = NOW.add(Number(later), "days");
  const pop = Math.max(Number(data.amPop), Number(data.pmPop));

  return (
    <div className={"grid grid-cols-4 items-center gap-5 py-2"}>
      <div className={"flex flex-col"}>
        <p
          className={cn(
            "text-lg font-bold",
            `${DATE.day() == 0 && "text-rose-500"}`,
            `${DATE.day() == 6 && "text-blue-500"}`,
          )}
        >
          {later == 0
            ? "오늘"
            : later == 1
              ? "내일"
              : `${DayOfWeek[DATE.day()]}요일`}
        </p>
        <p className={"text-neutral-500"}>
          {DATE.format(
            `${DATE.month() >= 10 ? "MM" : "M"}.${DATE.day() >= 10 ? "DD" : "D"}`,
          )}
        </p>
      </div>

      {/* 강수 확률 */}
      <div
        className={cn(
          "flex items-center justify-end gap-2 font-bold",
          `${pop > 0 ? "text-blue-500" : "text-neutral-300"}`,
        )}
      >
        <MdWaterDrop className={"size-3.5"} />
        <p>{pop}%</p>
      </div>

      {/* 오전, 오후 날씨 아이콘*/}
      <div className={"flex gap-2"}>
        <WeatherIcon state={data.amWf} size={"sm"} />
        <WeatherIcon state={data.pmWf} size={"sm"} />
      </div>

      {/* 최고, 최저 기온 */}
      <div className={"grid grid-cols-2 justify-end gap-4 text-xl"}>
        <p className={"font-bold text-rose-500"}>
          {`${Number(data.max).toFixed(Number(data.max) % 1 === 0 ? 0 : 1)}°`}
        </p>
        <p className={"font-bold text-blue-500"}>
          {`${Number(data.min).toFixed(Number(data.min) % 1 === 0 ? 0 : 1)}°`}
        </p>
      </div>
    </div>
  );
}
