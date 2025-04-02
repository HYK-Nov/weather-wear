import dayjs from "dayjs";
import "dayjs/locale/ko.js";
import LocalizedFormat from "dayjs/plugin/localizedFormat";

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
  tempMax,
  tempMin,
  later,
}: {
  later: number | string;
  tempMin: number;
  tempMax: number;
}) {
  const NOW = dayjs().add(Number(later), "days");

  return (
    <div className={"flex justify-between gap-3 py-2"}>
      <div className={"flex flex-col"}>
        <p className={"text-lg font-bold"}>{DayOfWeek[NOW.day()]}요일</p>
        <p className={"text-neutral-500"}>
          {NOW.format(
            `${NOW.month() >= 10 ? "MM" : "M"}.${NOW.day() >= 10 ? "DD" : "D"}`,
          )}
        </p>
      </div>
      <div className={"flex flex-col text-lg"}>
        <p className={"font-bold text-rose-500"}>{tempMax}°</p>
        <p className={"font-bold text-blue-500"}>{tempMin}°</p>
      </div>
    </div>
  );
}
